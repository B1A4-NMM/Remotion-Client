
import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils, Vector3 } from 'three';
import { Sphere } from '@react-three/drei';

// Define a type for the props to ensure type safety
interface ColoredBlobProps {
  colors: string[];
}

const ColoredBlob: React.FC<ColoredBlobProps> = ({ colors }) => {
  const mesh = React.useRef<any>();
  const hover = React.useRef(false);

  const uniforms = useMemo(() => {
    const colorVecs = colors.map(color => {
      const vec = new Vector3();
      vec.set(parseInt(color.slice(1, 3), 16) / 255, parseInt(color.slice(3, 5), 16) / 255, parseInt(color.slice(5, 7), 16) / 255);
      return vec;
    });

    return {
      u_time: { value: 0 },
      u_intensity: { value: 0.3 },
      u_colors: { value: colorVecs },
    };
  }, [colors]);

  useFrame(state => {
    const { clock } = state;
    if (mesh.current) {
      mesh.current.material.uniforms.u_time.value = 0.4 * clock.getElapsedTime();
      mesh.current.material.uniforms.u_intensity.value = MathUtils.lerp(
        mesh.current.material.uniforms.u_intensity.value,
        hover.current ? 0.85 : 0.15,
        0.02,
      );
    }
  });

  return (
    <Sphere ref={mesh} args={[1, 32, 32]}>
      <shaderMaterial
        vertexShader={`
          uniform float u_intensity;
          uniform float u_time;
          varying vec3 v_position;
          varying vec3 v_normal;

          void main() {
            v_normal = normal;
            v_position = position;
            vec3 pos = position;
            pos.y += sin(pos.x * 2.0 + u_time) * u_intensity;
            pos.x += cos(pos.y * 2.0 + u_time) * u_intensity;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 u_colors[3];
          uniform float u_time;
          varying vec3 v_position;

          void main() {
            vec3 color = u_colors[0];
            color = mix(color, u_colors[1], (sin(v_position.x * 2.0 + u_time) + 1.0) / 2.0);
            color = mix(color, u_colors[2], (cos(v_position.y * 2.0 + u_time) + 1.0) / 2.0);
            gl_FragColor = vec4(color, 1.0);
          }
        `}
        uniforms={uniforms}
      />
    </Sphere>
  );
};

export default ColoredBlob;
