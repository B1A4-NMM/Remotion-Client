const fragmentShader = `
uniform float u_intensity;
uniform float u_time;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
uniform float u_colorIntensity1;
uniform float u_colorIntensity2;
uniform float u_colorIntensity3;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vDisplacement;

void main() {
    vec3 lightDirection = normalize(vec3(1.0, 1.0, 1.0));
    vec3 normal = normalize(vNormal);
    
    float diffuse = max(dot(normal, lightDirection), 0.6);
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = 1.0 - max(dot(normal, viewDirection), 0.0);
    fresnel = pow(fresnel, 1.5);
    vec3 reflectDir = reflect(-lightDirection, normal);
    float specular = pow(max(dot(viewDirection, reflectDir), 0.0), 32.0);

    // [1] 감정 색상 혼합
    float totalIntensity = u_colorIntensity1 + u_colorIntensity2 + u_colorIntensity3 + 1e-6;
    vec3 blendedEmotionColor = 
        (u_color1 * u_colorIntensity1 + 
        u_color2 * u_colorIntensity2 + 
        u_color3 * u_colorIntensity3) / totalIntensity;

    // [2] 탁함 보정
    blendedEmotionColor = mix(blendedEmotionColor, vec3(1.0), 0.35);
    blendedEmotionColor = pow(blendedEmotionColor, vec3(1.0 / 2.2));  // 감마 보정

    // [3] 수직 위치 기반 그라데이션
    float gradientFactor = clamp((vPosition.y + 2.0) / 4.0, 0.0, 1.0); // -2~2 → 0~1
    vec3 gradientEmotionColor = mix(u_color1, u_color2, gradientFactor);
    gradientEmotionColor = mix(gradientEmotionColor, u_color3, gradientFactor * (1.0 - gradientFactor));
    gradientEmotionColor = mix(gradientEmotionColor, vec3(1.0), 0.25);

    // [4] blended + gradient 결합
    vec3 emotionColor = mix(blendedEmotionColor, gradientEmotionColor, 0.5);

    // [5] 파면 색상 변동
    float colorNoise = sin(vPosition.x * 3.0 + u_time) * cos(vPosition.y * 2.0 + u_time * 0.7);
    emotionColor = mix(emotionColor, vec3(1.0), 0.1 + 0.1 * colorNoise);

    // [6] 물 색상과 블렌딩
    vec3 waterColor = vec3(0.0, 0.05, 0.2);
    vec3 deepColor = vec3(0.0, 0.0, 0.3);
    vec3 lightWaterColor = mix(waterColor, emotionColor, 0.6);
    vec3 deepWaterColor = mix(deepColor, emotionColor * 0.8, 0.5);
    float depth = abs(vDisplacement) * 2.0;
    vec3 baseColor = mix(lightWaterColor, deepWaterColor, depth);

    vec3 diffuseColor = baseColor * diffuse * 0.8;
    vec3 ambientColor = lightWaterColor * 0.4;
    vec3 fresnelColor = vec3(1.0) * fresnel * 0.6;
    vec3 specularColor = vec3(1.0) * specular * 0.8;
    vec3 rippleColor = mix(vec3(0.9, 0.95, 1.0), emotionColor, 0.3) * abs(vDisplacement) * 0.3;

    // [7] 최종 색상 + 밝기 보정
    vec3 finalColor = ambientColor + diffuseColor + fresnelColor + specularColor + rippleColor;
    finalColor = mix(finalColor, vec3(1.0), 0.2);

    float alpha = 0.7 + fresnel * 0.2 + abs(vDisplacement) * 0.3;
    alpha = clamp(alpha, 0.4, 0.9);

    float timeVariation = sin(u_time * 0.4) * 0.05 + 0.95;
    finalColor *= timeVariation;

    gl_FragColor = vec4(finalColor, alpha);
}
`;


export default fragmentShader;
