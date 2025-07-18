const fragmentShader = `
uniform float u_intensity;
uniform float u_time;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
uniform vec3 u_color4;
uniform float u_colorIntensity1;
uniform float u_colorIntensity2;
uniform float u_colorIntensity3;
uniform float u_colorIntensity4;

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

    // [1] Intensity 기반 영역 계산 (4개 색상 모두 포함)
    float totalIntensity = u_colorIntensity1 + u_colorIntensity2 + u_colorIntensity3 + u_colorIntensity4 + 1e-6;
    
    // 각 색상의 중심점 (4개 모두 추가)
    vec2 center1 = vec2(sin(u_time * 0.3) * 0.5, cos(u_time * 0.2) * 0.3);
    vec2 center2 = vec2(sin(u_time * 0.2 + 2.0) * 0.4, cos(u_time * 0.3 + 1.5) * 0.5);
    vec2 center3 = vec2(sin(u_time * 0.25 + 4.0) * 0.3, cos(u_time * 0.35 + 3.0) * 0.4);
    vec2 center4 = vec2(sin(u_time * 0.4 + 5.0) * 0.35, cos(u_time * 0.25 + 2.5) * 0.45);
    
    // 현재 픽셀 위치
    vec2 pos = vPosition.xz * 0.5;
    
    // 각 색상 영역의 크기 (4개 모두 추가)
    float radius1 = sqrt(u_colorIntensity1 / totalIntensity) * 2.0;
    float radius2 = sqrt(u_colorIntensity2 / totalIntensity) * 2.0;
    float radius3 = sqrt(u_colorIntensity3 / totalIntensity) * 2.0;
    float radius4 = sqrt(u_colorIntensity4 / totalIntensity) * 2.0;
    
    // 각 중심점으로부터의 거리 (4개 모두 추가)
    float dist1 = length(pos - center1);
    float dist2 = length(pos - center2);
    float dist3 = length(pos - center3);
    float dist4 = length(pos - center4);
    
    // 부드러운 영향력 계산 (4개 모두 추가)
    float influence1 = exp(-dist1 * dist1 / (radius1 * radius1)) * u_colorIntensity1;
    float influence2 = exp(-dist2 * dist2 / (radius2 * radius2)) * u_colorIntensity2;
    float influence3 = exp(-dist3 * dist3 / (radius3 * radius3)) * u_colorIntensity3;
    float influence4 = exp(-dist4 * dist4 / (radius4 * radius4)) * u_colorIntensity4;
    
    // 가중 평균으로 색상 블렌딩 (4개 모두 포함)
    float totalInfluence = influence1 + influence2 + influence3 + influence4 + 1e-6;
    vec3 emotionColor = (u_color1 * influence1 + u_color2 * influence2 + u_color3 * influence3 + u_color4 * influence4) / totalInfluence;

    // [2] 물 효과 복원
    emotionColor = mix(emotionColor, vec3(1.0), 0.1);
    emotionColor = pow(emotionColor, vec3(1.0 / 1.1));

    // [3] 파면 색상 변동
    float colorNoise = sin(vPosition.x * 2.0 + u_time) * cos(vPosition.y * 1.5 + u_time * 0.7);
    emotionColor = mix(emotionColor, vec3(1.0), 0.05 + 0.03 * colorNoise);

    // [4] 물 색상과 블렌딩
    vec3 waterColor = vec3(0.0, 0.03, 0.15);
    vec3 deepColor = vec3(0.0, 0.0, 0.25);
    vec3 lightWaterColor = mix(waterColor, emotionColor, 0.7);
    vec3 deepWaterColor = mix(deepColor, emotionColor * 0.9, 0.6);
    float depth = abs(vDisplacement) * 2.0;
    vec3 baseColor = mix(lightWaterColor, deepWaterColor, depth);

    vec3 diffuseColor = baseColor * diffuse * 0.8;
    vec3 ambientColor = lightWaterColor * 0.4;
    vec3 fresnelColor = vec3(1.0) * fresnel * 0.5;
    vec3 specularColor = vec3(1.0) * specular * 0.7;
    vec3 rippleColor = mix(vec3(0.8, 0.9, 1.0), emotionColor, 0.4) * abs(vDisplacement) * 0.4;

    // [5] 최종 색상
    vec3 finalColor = ambientColor + diffuseColor + fresnelColor + specularColor + rippleColor;
    finalColor = mix(finalColor, vec3(1.0), 0.1);

    float alpha = 0.7 + fresnel * 0.1 + abs(vDisplacement) * 0.3;
    alpha = clamp(alpha, 0.4, 0.9);

    float timeVariation = sin(u_time * 0.4) * 0.05 + 0.95;
    finalColor *= timeVariation;

    gl_FragColor = vec4(finalColor, alpha);
}
`;

export default fragmentShader;