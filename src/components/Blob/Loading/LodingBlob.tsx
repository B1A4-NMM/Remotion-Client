import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Mesh } from 'three';
import { useFrame } from '@react-three/fiber';

import vertexShader from '../vertexShader';
import fragmentShaderLight from '../fragmentShaderLight';
import { baseColors } from "@/constants/emotionColors";

const LoadingBlob = () => {
    const mesh = useRef<Mesh>(null);
    
    const [animationStartTime, setAnimationStartTime] = useState<number | null>(null);
    const [targetColors, setTargetColors] = useState<number[][]>([]);
    const [currentPhase, setCurrentPhase] = useState<'toColor' | 'toWhite'>('toColor');
    
    // uniforms 생성 (처음에는 완전히 흰색)
    const uniforms = useMemo(() => ({
        u_time: { value: 1.0 },
        u_intensity: { value: 0.4 },
        u_color1: { value: [1, 1, 1] },
        u_color2: { value: [1, 1, 1] },
        u_color3: { value: [1, 1, 1] },
        u_colorIntensity1: { value: 0.0 },
        u_colorIntensity2: { value: 0.0 },
        u_colorIntensity3: { value: 0.0 },
    }), []);

    // 랜덤 색상 생성 함수
    const generateRandomColors = () => {
        const availableColors = [
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
        return shuffled.slice(0, colorCount);
    };

    // 컴포넌트 마운트 시 초기 설정
    useEffect(() => {
        setTargetColors(generateRandomColors());
        setAnimationStartTime(Date.now());
    }, []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        uniforms.u_time.value = t;
        uniforms.u_intensity.value = 0.2 + 0.1 * Math.sin(t * 0.9);
        const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

        if (animationStartTime) {
            const elapsed = Date.now() - animationStartTime;
            const phaseDuration = 4000; // 각 단계별 4초
            const progress = Math.min(elapsed / phaseDuration, 1);
            
            // 단계 완료 시 다음 단계로 전환
            if (progress >= 1) {
                if (currentPhase === 'toColor') {
                    setCurrentPhase('toWhite');
                } else {
                    setCurrentPhase('toColor');
                    // 흰색으로 돌아갈 때 새로운 랜덤 색상 선택
                    setTargetColors(generateRandomColors());
                }
                setAnimationStartTime(Date.now());
                return;
            }

            const colorCount = targetColors.length;
            const easedProgress = easeInOut(progress);

            if (currentPhase === 'toColor') {
                // 흰색에서 색상으로 변화
                if (colorCount > 0) {
                    const color1 = targetColors[0];
                    uniforms.u_color1.value = [
                        1 - easedProgress + easedProgress * color1[0],
                        1 - easedProgress + easedProgress * color1[1],
                        1 - easedProgress + easedProgress * color1[2]
                    ];
                }
                
                if (colorCount > 1) {
                    const color2 = targetColors[1];
                    uniforms.u_color2.value = [
                        1 - easedProgress + easedProgress * color2[0],
                        1 - easedProgress + easedProgress * color2[1],
                        1 - easedProgress + easedProgress * color2[2]
                    ];
                }
                
                if (colorCount > 2) {
                    const color3 = targetColors[2];
                    uniforms.u_color3.value = [
                        1 - easedProgress + easedProgress * color3[0],
                        1 - easedProgress + easedProgress * color3[1],
                        1 - easedProgress + easedProgress * color3[2]
                    ];
                }

                // 강도 증가
                const baseIntensity = easedProgress * 1.5;
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
            } else {
                // 색상에서 흰색으로 변화
                if (colorCount > 0) {
                    const color1 = targetColors[0];
                    uniforms.u_color1.value = [
                        color1[0] + easedProgress * (1 - color1[0]),
                        color1[1] + easedProgress * (1 - color1[1]),
                        color1[2] + easedProgress * (1 - color1[2])
                    ];
                }
                
                if (colorCount > 1) {
                    const color2 = targetColors[1];
                    uniforms.u_color2.value = [
                        color2[0] + easedProgress * (1 - color2[0]),
                        color2[1] + easedProgress * (1 - color2[1]),
                        color2[2] + easedProgress * (1 - color2[2])
                    ];
                }
                
                if (colorCount > 2) {
                    const color3 = targetColors[2];
                    uniforms.u_color3.value = [
                        color3[0] + easedProgress * (1 - color3[0]),
                        color3[1] + easedProgress * (1 - color3[1]),
                        color3[2] + easedProgress * (1 - color3[2])
                    ];
                }

                // 강도 감소
                const baseIntensity = (1 - easedProgress) * 1.5;
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
