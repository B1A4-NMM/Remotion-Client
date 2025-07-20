// components/StaticBlob.tsx
import React, { useRef, useMemo, useEffect, useCallback } from "react";
import { Mesh } from "three";
import vertexShader from "./vertexShader";
import fragmentShaderLight from "./fragmentShaderLight";
import fragmentShaderDark from "./fragmentShaderDark";
import { baseColors } from "../../constants/emotionColors";
import { useTheme } from "../theme-provider";

export type ColorKey = "gray" | "gray2" | "blue" | "green" | "red" | "yellow";

interface Emotion {
  color: ColorKey;
  intensity: number;
}

interface StaticBlobProps {
  emotions: Emotion[];
  scale?: number;
}

const StaticBlob: React.FC<StaticBlobProps> = ({ emotions, scale = 1.0 }) => {
  const mesh = useRef<Mesh>(null);
  const { theme } = useTheme();
  
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const frag = isDark ? fragmentShaderDark : fragmentShaderLight;

  const hexToRgb = useCallback((hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
  }, []);


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

  // ✅ useFrame 제거, 정적인 uniforms 사용
  const uniforms = useMemo(() => ({
    u_time: { value: 0 }, // 정지된 상태
    u_intensity: { value: 0.1 }, // 고정된 강도
    u_color1: { value: emotionColors.color1 },
    u_color2: { value: emotionColors.color2 },
    u_color3: { value: emotionColors.color3 },
    u_colorIntensity1: { value: emotionColors.intensity1 },
    u_colorIntensity2: { value: emotionColors.intensity2 },
    u_colorIntensity3: { value: emotionColors.intensity3 },
  }), [emotionColors]);

  return (
    <mesh ref={mesh} scale={scale} position={[0, 0, 0]}>
      <icosahedronGeometry args={[1.2, 8]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={frag}
        uniforms={uniforms}
      />
    </mesh>
  );
};

export default StaticBlob;
