import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Mesh, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';

import vertexShader from './vertexShader_1';
import fragmentShader from './fragmentShader_1';

interface JustBlobProps {
  type?: number;
}

const JustBlob = ({ type }: JustBlobProps) => {
  const mesh = useRef<Mesh>(null);
  const [startColor, setStartColor] = useState([1, 1, 1]);
  const [endColor, setEndColor] = useState([1, 1, 1]);
  const [duration, setDuration] = useState(0);

  // 타입별 애니메이션 설정 함수
  const getAnimationConfig = (type: number) => {
    switch(type) {
      case 1: // 분노 진정하기 - 격렬한 움직임에서 차분해지는 애니메이션
        return {
          positionAmplitude: 0.5,        // 큰 위치 변화
          positionReduction: 0.9,        // 90% 감소 (격렬함 → 차분함)
          positionFrequency: [0.8, 0.6, 0.7], // 빠른 주파수
          scaleAmplitude: 0.25,          // 큰 크기 변화
          scaleReduction: 0.8,           // 80% 감소
          scaleFrequency: 1.0,           // 빠른 크기 변화
          intensityStart: 1.2,           // 매우 강한 시작
          intensityEnd: 0.05,            // 매우 차분한 끝
          intensityVariation: 0.3,       // 강한 변동
          intensityFrequency: 0.6        // 변동 주파수
        };
      
      case 2: // 우울 다스리기 - 부드럽고 따뜻한 움직임
        return {
          positionAmplitude: 0.2,        // 부드러운 위치 변화
          positionReduction: 0.3,        // 30% 감소 (꾸준한 움직임 유지)
          positionFrequency: [0.3, 0.25, 0.2], // 느린 주파수
          scaleAmplitude: 0.1,           // 작은 크기 변화
          scaleReduction: 0.2,           // 20% 감소
          scaleFrequency: 0.4,           // 느린 크기 변화
          intensityStart: 0.6,           // 보통 시작
          intensityEnd: 0.3,             // 따뜻한 끝
          intensityVariation: 0.1,       // 부드러운 변동
          intensityFrequency: 0.3        // 느린 변동
        };
      
      case 3: // 긴장 완화하기 - 릴랙스되는 느린 움직임
        return {
          positionAmplitude: 0.15,       // 매우 부드러운 위치 변화
          positionReduction: 0.7,        // 70% 감소
          positionFrequency: [0.2, 0.15, 0.1], // 매우 느린 주파수
          scaleAmplitude: 0.08,          // 최소 크기 변화
          scaleReduction: 0.5,           // 50% 감소
          scaleFrequency: 0.25,          // 매우 느린 크기 변화
          intensityStart: 0.8,           // 적당한 시작
          intensityEnd: 0.1,             // 매우 차분한 끝
          intensityVariation: 0.05,      // 미세한 변동
          intensityFrequency: 0.2        // 매우 느린 변동
        };
      
      default:
        return {
          positionAmplitude: 0.3,
          positionReduction: 0.8,
          positionFrequency: [0.5, 0.3, 0.4],
          scaleAmplitude: 0.15,
          scaleReduction: 0.6,
          scaleFrequency: 0.7,
          intensityStart: 0.8,
          intensityEnd: 0.1,
          intensityVariation: 0.2,
          intensityFrequency: 0.4
        };
    }
  };

  // useEffect로 props 변경 시에만 상태 업데이트
  useEffect(() => {
    switch(type) {
      case 1:
        setStartColor([1, 0, 0]); // 빨간색
        setEndColor([0, 0, 1]);   // 파란색
        setDuration(240);         // 240초
        break;
      case 2:
        setStartColor([0, 1, 0]); // 녹색
        setEndColor([1, 1, 0]);   // 노란색
        setDuration(180);         // 180초
        break;
      case 3:
        setStartColor([1, 0, 1]); // 자주색
        setEndColor([0, 1, 1]);   // 청록색
        setDuration(120);         // 120초
        break;
      case 4:
        setStartColor([1, 0.5, 0]); // 주황색
        setEndColor([0.5, 0, 1]);   // 보라색
        setDuration(300);           // 300초
        break;
      default:
        setStartColor([1, 1, 1]);
        setEndColor([1, 1, 1]);
        setDuration(240);
    }
  }, [type]);

  // uniforms 생성
  const uniforms = useRef({
    u_time: { value: 0 },
    u_intensity: { value: 0.4 },
    u_color: { value: [1, 1, 1] },
    u_colorIntensity: { value: 1.0 },
  });

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();
    const animationDuration = duration;
    const progress = Math.min(elapsedTime / animationDuration, 1.0);
    
    // 타입별 애니메이션 설정 가져오기
    const config = getAnimationConfig(type || 1);

    // [1] 타입별 위치 애니메이션
    const positionAmplitude = config.positionAmplitude * (1.0 - progress * config.positionReduction);
    const posX = Math.sin(elapsedTime * config.positionFrequency[0]) * positionAmplitude;
    const posY = Math.cos(elapsedTime * config.positionFrequency[1]) * positionAmplitude;
    const posZ = Math.sin(elapsedTime * config.positionFrequency[2]) * positionAmplitude * 0.5;

    // [2] 타입별 크기 변화 애니메이션
    const scaleAmplitude = config.scaleAmplitude * (1.0 - progress * config.scaleReduction);
    const scale = 1.0 + Math.sin(elapsedTime * config.scaleFrequency) * scaleAmplitude;

    // [3] 타입별 표면 요동 강도
    const intensityBase = config.intensityStart * (1.0 - progress) + config.intensityEnd * progress;
    const intensityVariation = Math.sin(elapsedTime * config.intensityFrequency) * config.intensityVariation * (1.0 - progress);
    uniforms.current.u_intensity.value = intensityBase + intensityVariation;

    // [4] 색상 변화 - 타입별로 이미 설정됨
    const colorStart = startColor;
    const colorEnd = endColor;
    
    uniforms.current.u_color.value[0] = colorStart[0] * (1.0 - progress) + colorEnd[0] * progress;
    uniforms.current.u_color.value[1] = colorStart[1] * (1.0 - progress) + colorEnd[1] * progress;
    uniforms.current.u_color.value[2] = colorStart[2] * (1.0 - progress) + colorEnd[2] * progress;

    // 메쉬 위치와 크기 업데이트
    if (mesh.current) {
      mesh.current.position.set(posX, posY, posZ);
      mesh.current.scale.set(scale, scale, scale);
    }

    uniforms.current.u_time.value = elapsedTime;
  });

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

export default JustBlob;
