import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Mesh, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';

import vertexShader from './vertexShader';
import fragmentShader from './fragmentShader';

// 타입 정의
type ColorKey = 'gray' | 'gray1' | 'gray2' | 'blue' | 'green' | 'red' | 'yellow';

interface Emotion {
  color: ColorKey;
  intensity: number;
}

interface BlobProps {
  diaryContent?: any;
}

// 기본 색상 정의
const baseColors: Record<ColorKey, string> = {
  green: "#23db91",
  red: "#fc1111", 
  yellow: "#d8cc21",
  blue: "#1c90d8",
  gray: "#E1E1E1",
  gray1: "#E1E1E1",
  gray2: "#E1E1E1",
} as const;

// 감정을 ColorKey로 매핑하는 함수
const mapEmotionToColor = (emotion: string): ColorKey => {
  const highEnergyPleasant = new Set([
    '행복', '기쁨', '즐거움', '설렘', '흥분', '활력',
    '자긍심', '자신감', '뿌듯함', '성취감',
    '사랑', '애정', '기대', '놀람'
  ]);

  const highEnergyUnpleasant = new Set([
    '분노', '짜증', '질투', '시기', '경멸', '거부감', '불쾌',
    '긴장', '불안', '초조', '억울', '배신감', '상처'
  ]);

  const lowEnergyUnpleasant = new Set([
    '우울', '슬픔', '공허', '외로움', '실망', '속상',
    '부끄러움', '수치', '죄책감', '후회', '뉘우침', '창피', '굴욕',
    '피로', '지침', '무기력', '지루', '부담'
  ]);

  const lowEnergyPleasant = new Set([
    '평온', '편안', '안정', '차분', '감사', '존경', 
    '신뢰', '친밀', '유대', '공감', '만족감'
  ]);

  if (highEnergyPleasant.has(emotion)) return 'yellow';
  if (highEnergyUnpleasant.has(emotion)) return 'red';
  if (lowEnergyUnpleasant.has(emotion)) return 'blue';
  if (lowEnergyPleasant.has(emotion)) return 'green';
  return 'gray1';
};

 
const Blob: React.FC<BlobProps> = ({ diaryContent }) => {
  const mesh = useRef<Mesh>(null);
  const [emotions, setEmotions] = useState<Emotion[]>([]);

  // 컴포넌트 언마운트 시 리소스 정리
  useEffect(() => {
    return () => {
      if (mesh.current) {
        // Geometry 정리
        mesh.current.geometry.dispose();

        // Material 정리
        if (mesh.current.material) {
          if (Array.isArray(mesh.current.material)) {
            mesh.current.material.forEach((mat) => mat.dispose());
          } else {
            mesh.current.material.dispose();
          }
        }

        // Uniform 정리
        if (!Array.isArray(mesh.current.material) && mesh.current.material?.uniforms) {
          Object.values(mesh.current.material.uniforms).forEach((uniform: any) => {
            if (uniform.value && typeof uniform.value.dispose === 'function') {
              uniform.value.dispose();
            }
          });
        }
      }
    };
  }, []);

  // diaryContent 변경 시에도 리소스 정리
  useEffect(() => {
    return () => {
      if (mesh.current?.material) {
        if (Array.isArray(mesh.current.material)) {
          mesh.current.material.forEach((mat) => mat.dispose());
        } else {
          mesh.current.material.dispose();
        }
      }
    };
  }, [diaryContent]);

  // 1. 함수들을 useCallback으로 메모이제이션
  const hexToRgb = useCallback((hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
  }, []);

  const processDiaryContentEmotions = useCallback((content: any): Emotion[] => {
    if (!content) {
      return [{ color: "gray1" as ColorKey, intensity: 1 }];
    }
  
    const allEmotions: { type: string; intensity: number }[] = [];
  
    // selfEmotion 처리
    if (content.selfEmotion && Array.isArray(content.selfEmotion)) {
      content.selfEmotion.forEach((emotion: any) => {
        if (emotion && emotion.emotionType) {
          allEmotions.push({
            type: emotion.emotionType,
            intensity: emotion.intensity || emotion.emotionIntensity || 5
          });
        }
      });
    }
  
    // stateEmotion 처리
    if (content.stateEmotion && Array.isArray(content.stateEmotion)) {
      content.stateEmotion.forEach((emotion: any) => {
        if (emotion && emotion.emotionType) {
          allEmotions.push({
            type: emotion.emotionType,
            intensity: emotion.intensity || emotion.emotionIntensity || 5
          });
        }
      });
    }
  
    // people 처리
    if (content.people && Array.isArray(content.people)) {
      content.people.forEach((person: any) => {
        if (person.feel && Array.isArray(person.feel)) {
          person.feel.forEach((emotion: any) => {
            if (emotion && emotion.emotionType) {
              allEmotions.push({
                type: emotion.emotionType,
                intensity: (emotion.intensity || emotion.emotionIntensity || 5)
              });
            }
          });
        }
      });
    }

    if (allEmotions.length === 0) {
      return [{ color: "gray1" as ColorKey, intensity: 1 }];
    }

    const colorMap = new Map<ColorKey, number>();
    allEmotions.forEach(({ type, intensity }) => {
      const color = mapEmotionToColor(type);
      colorMap.set(color, (colorMap.get(color) || 0) + intensity);
    });

    if (colorMap.size > 1) {
      colorMap.delete("gray1");
      colorMap.delete("gray2");
    }

    const totalColorIntensity = [...colorMap.values()].reduce((sum, val) => sum + val, 0);

    return [...colorMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([color, total]) => ({
        color,
        intensity: +(total / totalColorIntensity).toFixed(3),
      }));
  }, []); // 빈 의존성 배열

  // 2. 색상 계산 수정
  const emotionColors = useMemo(() => {
    if (emotions.length === 0) {
      const grayRgb = hexToRgb(baseColors.gray1);
      return {
        color1: grayRgb,
        color2: grayRgb,
        color3: grayRgb,
        intensity1: 1.0,
        intensity2: 0.0,
        intensity3: 0.0
      };
    }

    const primaryEmotion = emotions[0];
    const secondaryEmotion = emotions[1] || emotions[0];
    const tertiaryEmotion = emotions[2] || emotions[0];

    const result= {
      color1: hexToRgb(baseColors[primaryEmotion.color]),
      color2: hexToRgb(baseColors[secondaryEmotion.color]),
      color3: hexToRgb(baseColors[tertiaryEmotion.color]),
      intensity1: primaryEmotion.intensity,
      intensity2: emotions[1]?.intensity || 0.0,
      intensity3: emotions[2]?.intensity || 0.0
    };

    return result;
  }, [emotions, hexToRgb]); // 이제 hexToRgb가 안정적임

  // 3. uniforms 생성
  const uniforms = useRef({
    u_time: { value: 0 },
    u_intensity: { value: 0.4 },
    u_color1: { value: [1, 1, 1] },
    u_color2: { value: [1, 1, 1] },
    u_color3: { value: [1, 1, 1] },
    u_colorIntensity1: { value: 1.0 },
    u_colorIntensity2: { value: 0.0 },
    u_colorIntensity3: { value: 0.0 },
  });

  // 4. 중복 제거 - 하나의 useEffect만 사용
  useEffect(() => {
    const processedEmotions = processDiaryContentEmotions(diaryContent);
    setEmotions(processedEmotions);
  }, [diaryContent, processDiaryContentEmotions]);
  
  // 5. 색상 업데이트
  useEffect(() => {
    uniforms.current.u_color1.value = emotionColors.color1;
    uniforms.current.u_color2.value = emotionColors.color2;
    uniforms.current.u_color3.value = emotionColors.color3;
    uniforms.current.u_colorIntensity1.value = emotionColors.intensity1;
    uniforms.current.u_colorIntensity2.value = emotionColors.intensity2;
    uniforms.current.u_colorIntensity3.value = emotionColors.intensity3;
  }, [emotionColors]);

  // 6. 프레임 업데이트
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    uniforms.current.u_time.value = t;
    uniforms.current.u_intensity.value = 0.2 + 0.1 * Math.sin(t * 0.4);
  });

  return (
    <mesh ref={mesh} scale={1.0} position={[0, 0, 0]}>
      <icosahedronGeometry args={[2, 16]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
      />
    </mesh>
  );
};

export default Blob;