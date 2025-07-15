import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Mesh, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';


import vertexShader from '../vertexShader';
import fragmentShader from '../fragmentShader_1';


const SimpleBlob=()=>{
    const mesh = useRef<Mesh>(null);

    //. uniforms 생성
    const uniforms = useRef({
    u_time: { value: 0 },
    u_intensity: { value: 0.4 },
    u_color: { value: [1, 1, 1] },
    u_colorIntensity: { value: 1.0 },
    });

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        uniforms.current.u_time.value = t;
        uniforms.current.u_intensity.value = 0.2 + 0.1 * Math.sin(t * 0.4);
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

    return(
        <mesh ref={mesh} scale={1.0} position={[0, 0, 0]}>
            <icosahedronGeometry args={[2, 16]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms.current}
            />
        </mesh>

    );
}

export default SimpleBlob;