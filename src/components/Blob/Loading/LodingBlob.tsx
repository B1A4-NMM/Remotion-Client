import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Mesh } from 'three';
import { useFrame } from '@react-three/fiber';

import vertexShader from '../vertexShader';
import fragmentShaderLight from '../fragmentShaderLight';
import { baseColors } from "@/constants/emotionColors";

const LoadingBlob = () => {
    const mesh = useRef<Mesh>(null);
    
    const [animationProgress, setAnimationProgress] = useState(0);
    const [animationStartTime, setAnimationStartTime] = useState<number | null>(null);
    const [targetColors, setTargetColors] = useState<number[][]>([]);
    
    // uniforms 생성 (처음에는 완전히 흰색)
    const uniforms = useMemo(() => ({
        u_time: { value: 1.0 },
        u_intensity: { value: 0.4 },
        // 처음에는 모든 색상을 흰색으로 설정
        u_color1: { value: [1, 1, 1] },
        u_color2: { value: [1, 1, 1] },
        u_color3: { value: [1, 1, 1] },
        u_colorIntensity1: { value: 0.0 },
        u_colorIntensity2: { value: 0.0 },
        u_colorIntensity3: { value: 0.0 },
    }), []);

    // 컴포넌트 마운트 시 목표 색상만 설정
    useEffect(() => {
        const availableColors = [
            // emotionColors.ts의 색상 값 사용
            [
                parseInt(baseColors.red.slice(1, 3), 16) / 255,
                parseInt(baseColors.red.slice(3, 5), 16) / 255,
                parseInt(baseColors.red.slice(5, 7), 16) / 255,
            ],
            [
                parseInt(baseColors.green.slice(1, 3), 16) / 255,
                parseInt(baseColors.green.slice(3, 5), 16) / 255,
                parseInt(baseColors.green.slice(5, 7), 16) / 255,
            ],
            [
                parseInt(baseColors.blue.slice(1, 3), 16) / 255,
                parseInt(baseColors.blue.slice(3, 5), 16) / 255,
                parseInt(baseColors.blue.slice(5, 7), 16) / 255,
            ],
            [
                parseInt(baseColors.yellow.slice(1, 3), 16) / 255,
                parseInt(baseColors.yellow.slice(3, 5), 16) / 255,
                parseInt(baseColors.yellow.slice(5, 7), 16) / 255,
            ],
        ];
        const colorCount = Math.floor(Math.random() * 3) + 1;
        const shuffled = [...availableColors].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, colorCount);
        setTargetColors(selected);
        setAnimationStartTime(Date.now());
    }, []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        uniforms.u_time.value = t;
        uniforms.u_intensity.value = 0.2 + 0.1 * Math.sin(t * 0.9);
        const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

        if (animationStartTime) {
            const elapsed = Date.now() - animationStartTime;
            const animationDuration = 10000;
            const progress = Math.min(elapsed / animationDuration, 1);
            
            setAnimationProgress(progress);
            
            
            // 애니메이션 진행에 따라 색상과 강도 업데이트
            if (progress > 0) {
                // 색상을 점진적으로 적용
                const colorCount = targetColors.length;
                
                // 색상 설정 (진행률에 따라 흰색에서 목표 색상으로)
                if (colorCount > 0) {
                    const color1 = targetColors[0];
                    uniforms.u_color1.value = [
                        1 - progress + progress * color1[0],
                        1 - progress + progress * color1[1],
                        1 - progress + progress * color1[2]
                    ];
                }
                
                if (colorCount > 1) {
                    const color2 = targetColors[1];
                    uniforms.u_color2.value = [
                        1 - progress + progress * color2[0],
                        1 - progress + progress * color2[1],
                        1 - progress + progress * color2[2]
                    ];
                }
                
                if (colorCount > 2) {
                    const color3 = targetColors[2];
                    uniforms.u_color3.value = [
                        1 - progress + progress * color3[0],
                        1 - progress + progress * color3[1],
                        1 - progress + progress * color3[2]
                    ];
                }
                
                // 강도 설정 (더 강하게)
                const easedProgress = easeInOut(progress);
                const baseIntensity = easedProgress * 1.5; // 강도 증가
                
                if (colorCount === 1) {
                    uniforms.u_colorIntensity1.value = baseIntensity;
                } else if (colorCount === 2) {
                    uniforms.u_colorIntensity1.value = baseIntensity * 0.6;
                    uniforms.u_colorIntensity2.value = baseIntensity * 0.6;
                } else if (colorCount === 3) {
                    uniforms.u_colorIntensity1.value = baseIntensity * 0.5;
                    uniforms.u_colorIntensity2.value = baseIntensity * 0.5;
                    uniforms.u_colorIntensity3.value = baseIntensity * 0.5;
                }
                
            }
        }
    });

    // 컴포넌트 언마운트 시 리소스 정리
    useEffect(() => {
        return () => {
            if (mesh.current) {
                mesh.current.geometry.dispose();
                if (mesh.current.material) {
                    if (Array.isArray(mesh.current.material)) {
                        mesh.current.material.forEach((mat) => mat.dispose());
                    } else {
                        mesh.current.material.dispose();
                    }
                }
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
                fragmentShader={fragmentShaderLight}
                uniforms={uniforms}
            />
        </mesh>
    );
};

export default LoadingBlob;
