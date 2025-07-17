import React, { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { Mesh, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";


import vertexShader from "./vertexShader";
import fragmentShaderLight from "./fragmentShaderLight";
import fragmentShaderDark from "./fragmentShaderDark";
import { baseColors, mapEmotionToColor } from "../../constants/emotionColors";
import { useTheme } from "../theme-provider";

// 타입 정의
export type ColorKey = "gray" | "gray2" | "blue" | "green" | "red" | "yellow";

interface Emotion {
  color: ColorKey;
  intensity: number;
}

interface BlobProps {
  diaryContent?: any;
}

const Blob: React.FC<BlobProps> = ({ diaryContent }) => {
  const mesh = useRef<Mesh>(null);
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const { theme } = useTheme();
  
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const frag= isDark? fragmentShaderDark : fragmentShaderLight;

  // 컴포넌트 언마운트 시 리소스 정리
  useEffect(() => {
    return () => {
      if (mesh.current) {
        // Geometry 정리
        mesh.current.geometry.dispose();

        // Material 정리
        if (mesh.current.material) {
          if (Array.isArray(mesh.current.material)) {
            mesh.current.material.forEach(mat => mat.dispose());
          } else {
            mesh.current.material.dispose();
          }
        }

        // Uniform 정리
        if (!Array.isArray(mesh.current.material) && mesh.current.material?.uniforms) {
          Object.values(mesh.current.material.uniforms).forEach((uniform: any) => {
            if (uniform.value && typeof uniform.value.dispose === "function") {
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
          mesh.current.material.forEach(mat => mat.dispose());
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
      return [{ color: "gray" as ColorKey, intensity: 1 }];
    }

    const allEmotions: { type: string; intensity: number }[] = [];

    // emotions 배열 지원 추가
    if (content.emotions && Array.isArray(content.emotions)) {
      content.emotions.forEach((emotion: any) => {
        if (emotion && emotion.emotion  && emotion.emotion!='무난') {
          allEmotions.push({
            type: emotion.emotion,
            intensity: emotion.intensity || 5,
          });
        }
      });
    }



    if (allEmotions.length === 0) {
      return [{ color: "gray" as ColorKey, intensity: 1 }];
    }

    const colorMap = new Map<ColorKey, number>();
    allEmotions.forEach(({ type, intensity }) => {
      const color = mapEmotionToColor(type);
      colorMap.set(color, (colorMap.get(color) || 0) + intensity);
    });



    if (colorMap.size > 1) {
      colorMap.delete("gray");
      colorMap.delete("gray2");
    }

    console.log(colorMap);
    
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
      const grayRgb = hexToRgb(baseColors.gray);
      return {
        color1: grayRgb,
        color2: grayRgb,
        color3: grayRgb,
        intensity1: 1.0,
        intensity2: 0.0,
        intensity3: 0.0,
      };
    }

    const primaryEmotion = emotions[0];
    const secondaryEmotion = emotions[1] || emotions[0];
    const tertiaryEmotion = emotions[2] || emotions[0];

    const result = {
      color1: hexToRgb(baseColors[primaryEmotion.color]),
      color2: hexToRgb(baseColors[secondaryEmotion.color]),
      color3: hexToRgb(baseColors[tertiaryEmotion.color]),
      intensity1: primaryEmotion.intensity,
      intensity2: emotions[1]?.intensity || 0.0,
      intensity3: emotions[2]?.intensity || 0.0,
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
  useFrame(state => {
    const t = state.clock.getElapsedTime();
    uniforms.current.u_time.value = t;
    uniforms.current.u_intensity.value = 0.2 + 0.1 * Math.sin(t * 0.4);
  });

  return (
    <mesh ref={mesh} scale={1.0} position={[0, 0, 0]}>
      <icosahedronGeometry args={[2.4, 17]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={frag}
        uniforms={uniforms.current}
      />
    </mesh>
  );
};

export default Blob;
