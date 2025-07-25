// components/Blob.tsx
import React, { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import WebGLContextPool from "./WebGLContextPool";

import vertexShader from "./vertexShader";
import fragmentShaderLight from "./fragmentShaderLight";
import fragmentShaderDark from "./fragmentShaderDark";
import { baseColors, ColorKey } from "../../constants/emotionColors";
import { useTheme } from "../theme-provider";

// 타입 정의
// ColorKey는 constants/emotionColors.ts에서 import
interface Emotion {
  color: ColorKey;
  intensity: number;
}

interface BlobProps {
  emotions: Emotion[]; // ✅ VirtualizedRelationNode에서 계산된 emotions 배열
  scale?: number;
  id?: string;
  onContextLost?: () => void;
}

const Blob: React.FC<BlobProps> = ({ emotions, scale = 1, id, onContextLost }) => {
  const mesh = useRef<Mesh>(null);
  const [isActive, setIsActive] = useState(false);
  const contextPool = WebGLContextPool.getInstance();

  const { theme } = useTheme();

  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const frag = isDark ? fragmentShaderDark : fragmentShaderLight;

  // 컴포넌트 마운트 시 컨텍스트 요청
  useEffect(() => {
    if (!id) return;

    const canRender = contextPool.requestContext(id);
    setIsActive(canRender);

    if (!canRender) {
      onContextLost?.();
    }

    return () => {
      contextPool.releaseContext(id);
    };
  }, [id]);

  // ✅ hexToRgb 유틸리티 함수만 유지
  const hexToRgb = useCallback((hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
  }, []);

  // ✅ 받은 emotions 배열을 그대로 shader에 전달할 형태로 변환만 수행
  const shaderColors = useMemo(() => {
    // emotions 배열이 비어있는 경우 기본값
    if (!emotions || emotions.length === 0) {
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

    // ✅ VirtualizedRelationNode에서 계산된 색상과 강도를 그대로 사용
    const emotion1 = emotions[0];
    const emotion2 = emotions[1] || emotion1; // 두 번째가 없으면 첫 번째 재사용
    const emotion3 = emotions[2] || emotion1; // 세 번째가 없으면 첫 번째 재사용

    return {
      color1: hexToRgb(baseColors[emotion1.color]),
      color2: hexToRgb(baseColors[emotion2.color]),
      color3: hexToRgb(baseColors[emotion3.color]),
      intensity1: emotion1.intensity,
      intensity2: emotions[1]?.intensity || 0.0,
      intensity3: emotions[2]?.intensity || 0.0,
    };
  }, [emotions, hexToRgb]);

  // uniforms 생성
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

  // ✅ shader에 색상 값 전달 (계산은 하지 않음)
  useEffect(() => {
    uniforms.current.u_color1.value = shaderColors.color1;
    uniforms.current.u_color2.value = shaderColors.color2;
    uniforms.current.u_color3.value = shaderColors.color3;
    uniforms.current.u_colorIntensity1.value = shaderColors.intensity1;
    uniforms.current.u_colorIntensity2.value = shaderColors.intensity2;
    uniforms.current.u_colorIntensity3.value = shaderColors.intensity3;
  }, [shaderColors]);

  // 프레임 업데이트
  useFrame(state => {
    const t = state.clock.getElapsedTime();
    uniforms.current.u_time.value = t;
    uniforms.current.u_intensity.value = 0.2 + 0.1 * Math.sin(t * 0.4);
  });

  if (!isActive && id) {
    return null;
  }

  return (
    <mesh ref={mesh} scale={scale} position={[0, 0, 0]}>
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
