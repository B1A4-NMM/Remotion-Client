import React, { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import WebGLContextPool from "./WebGLContextPool";

import vertexShader from "./vertexShader";
import fragmentShaderLight from "./fragmentShaderLight";
import fragmentShaderDark from "./fragmentShaderDark";
import { baseColors } from "../../constants/emotionColors";
import { useTheme } from "../theme-provider";

// 타입 정의
export type ColorKey = "gray" | "gray2" | "blue" | "green" | "red" | "yellow";

interface Emotion {
  color: ColorKey;
  intensity: number;
}

interface BlobProps {
  emotions: Emotion[]; // ✅ diaryContent 대신 emotions 배열 받기
  id?: string;
  onContextLost?: () => void;
}

const Blob: React.FC<BlobProps> = ({ emotions, id, onContextLost }) => {
  const mesh = useRef<Mesh>(null);
  const [isActive, setIsActive] = useState(false);
  const contextPool = WebGLContextPool.getInstance();
  
  const { theme } = useTheme();
  
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
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
  
  // ✅ hexToRgb 함수만 유지
  const hexToRgb = useCallback((hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
  }, []);

  // ✅ emotions 배열을 기반으로 색상 계산
  const emotionColors = useMemo(() => {
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

    const primaryEmotion = emotions[0];
    const secondaryEmotion = emotions[1] || emotions[0];
    const tertiaryEmotion = emotions[2] || emotions[0];

    return {
      color1: hexToRgb(baseColors[primaryEmotion.color]),
      color2: hexToRgb(baseColors[secondaryEmotion.color]),
      color3: hexToRgb(baseColors[tertiaryEmotion.color]),
      intensity1: primaryEmotion.intensity,
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

  // 색상 업데이트
  useEffect(() => {
    uniforms.current.u_color1.value = emotionColors.color1;
    uniforms.current.u_color2.value = emotionColors.color2;
    uniforms.current.u_color3.value = emotionColors.color3;
    uniforms.current.u_colorIntensity1.value = emotionColors.intensity1;
    uniforms.current.u_colorIntensity2.value = emotionColors.intensity2;
    uniforms.current.u_colorIntensity3.value = emotionColors.intensity3;
  }, [emotionColors]);

  // 프레임 업데이트
  useFrame(state => {
    const t = state.clock.getElapsedTime();
    uniforms.current.u_time.value = t;
    uniforms.current.u_intensity.value = 0.2 + 0.1 * Math.sin(t * 0.4);
  });

  if (!isActive) {
    return null;
  }

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
