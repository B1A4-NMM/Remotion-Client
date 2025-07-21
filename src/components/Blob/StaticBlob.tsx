// components/StaticBlob.tsx
import React, { useRef, useMemo, useEffect, useCallback } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber"; // ✅ useFrame import 추가
import vertexShader from "./vertexShader";
import fragmentShaderLight from "./fragmentShaderLight";
import fragmentShaderDark from "./fragmentShaderDark";
import { baseColors, ColorKey } from "../../constants/emotionColors";
import { useTheme } from "../theme-provider";

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

  // 메모이제이션된 geometry
  const geometry = useMemo((): [number, number] => {
    const isMobile = window.innerWidth <= 768;
    const segments = isMobile ? 8 : 12;
    return [1.2, segments];
  }, []);

  // hexToRgb 함수에 안전장치 추가
  const hexToRgb = useCallback((hex: string | undefined): [number, number, number] => {
    if (!hex || typeof hex !== 'string' || !hex.startsWith('#') || hex.length !== 7) {
      console.warn('Invalid hex color:', hex, 'Using gray as fallback');
      return [0.5, 0.5, 0.5];
    }

    try {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      
      if (isNaN(r) || isNaN(g) || isNaN(b)) {
        console.warn('Invalid hex color conversion:', hex);
        return [0.5, 0.5, 0.5];
      }
      
      return [r, g, b];
    } catch (error) {
      console.warn('Error parsing hex color:', hex, error);
      return [0.5, 0.5, 0.5];
    }
  }, []);

  const emotionColors = useMemo(() => {
    if (!emotions || !Array.isArray(emotions) || emotions.length === 0) {
      console.warn('Invalid emotions array:', emotions);
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
    const secondaryEmotion = emotions[1] || primaryEmotion;
    const tertiaryEmotion = emotions[2] || primaryEmotion;

    const getColorSafely = (colorKey: ColorKey | undefined): string => {
      if (!colorKey || !(colorKey in baseColors)) {
        console.warn('Invalid color key:', colorKey, 'Using gray as fallback');
        return baseColors.gray;
      }
      return baseColors[colorKey];
    };

    return {
      color1: hexToRgb(getColorSafely(primaryEmotion?.color)),
      color2: hexToRgb(getColorSafely(secondaryEmotion?.color)),
      color3: hexToRgb(getColorSafely(tertiaryEmotion?.color)),
      intensity1: primaryEmotion?.intensity ?? 1.0,
      intensity2: secondaryEmotion?.intensity ?? 0.0,
      intensity3: tertiaryEmotion?.intensity ?? 0.0,
    };
  }, [emotions, hexToRgb]);

  // ✅ uniforms를 useRef로 변경 (매번 재생성 방지)
  const uniforms = useRef({
    u_time: { value: 0 },
    u_intensity: { value: 0.1 },
    u_color1: { value: emotionColors.color1 },
    u_color2: { value: emotionColors.color2 },
    u_color3: { value: emotionColors.color3 },
    u_colorIntensity1: { value: emotionColors.intensity1 },
    u_colorIntensity2: { value: emotionColors.intensity2 },
    u_colorIntensity3: { value: emotionColors.intensity3 },
  });

  // ✅ emotionColors가 변경될 때 uniforms 업데이트
  useEffect(() => {
    uniforms.current.u_color1.value = emotionColors.color1;
    uniforms.current.u_color2.value = emotionColors.color2;
    uniforms.current.u_color3.value = emotionColors.color3;
    uniforms.current.u_colorIntensity1.value = emotionColors.intensity1;
    uniforms.current.u_colorIntensity2.value = emotionColors.intensity2;
    uniforms.current.u_colorIntensity3.value = emotionColors.intensity3;
  }, [emotionColors]);

  // ✅ useFrame으로 애니메이션 추가
  useFrame((state) => {
    if (mesh.current && mesh.current.material.uniforms) {
      const elapsed = state.clock.getElapsedTime();
      
      // 시간 업데이트
      mesh.current.material.uniforms.u_time.value = elapsed;
      
      // 강도를 사인파로 변화시켜 호흡하는 효과
      mesh.current.material.uniforms.u_intensity.value = 0.1 + 0.1 * Math.sin(elapsed * 0.5);
    }
  });

  return (
    <mesh ref={mesh} scale={scale} position={[0, 0, 0]}>
      <icosahedronGeometry args={geometry} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={frag}
        uniforms={uniforms.current} // ✅ .current 추가
      />
    </mesh>
  );
};

export default StaticBlob;
