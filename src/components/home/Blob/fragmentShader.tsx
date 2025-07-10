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
    vec3 lightDirection = normalize(vec3(0.0, 0.0, 1.0));
    vec3 normal = normalize(vNormal);
    
    // 기본 디퓨즈 라이팅
    float diffuse = max(dot(normal, lightDirection), 0.6);
    
    // 뷰 방향 벡터
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    
    // 프레넬 효과 (투명 재질의 굴절감)
    float fresnel = 1.0 - max(dot(normal, viewDirection), 0.0);
    fresnel = pow(fresnel, 1.5);
    
    // 반사 효과
    vec3 reflectDir = reflect(-lightDirection, normal);
    float specular = pow(max(dot(viewDirection, reflectDir), 0.0), 32.0);
    
    // **감정 기반 색상 믹싱 (B코드에서 가져옴)**
    float totalIntensity = u_colorIntensity1 + u_colorIntensity2 + u_colorIntensity3 + 1e-6;
    vec3 emotionColor = (u_color1 * u_colorIntensity1 + 
                        u_color2 * u_colorIntensity2 + 
                        u_color3 * u_colorIntensity3) / totalIntensity;
    
    // 파면에 따른 색상 요동 (B코드 방식)
    float colorNoise = sin(vPosition.x * 3.0 + u_time) * 
                      cos(vPosition.y * 2.0 + u_time * 0.7);
    emotionColor = mix(emotionColor * 1.0, emotionColor * 1.1, colorNoise * 0.5 + 0.5);
    
    // **A코드의 물 색상과 감정 색상 블렌딩**
    vec3 waterColor = vec3(0.1, 0.1, 0.1); // 연한 하늘색
    vec3 deepColor = vec3(0.2, 0.2, 0.2);  // 깊은 파란색
    
    // 감정 색상을 물 색상과 자연스럽게 블렌딩
    vec3 lightWaterColor = mix(waterColor, emotionColor, 0.6);
    vec3 deepWaterColor = mix(deepColor, emotionColor * 0.8, 0.5);
    
    // 깊이에 따른 색상 변화
    float depth = abs(vDisplacement) * 2.0;
    vec3 baseColor = mix(lightWaterColor, deepWaterColor, depth);
    
    // 조명 계산
    vec3 diffuseColor = baseColor * diffuse * 0.8;
    vec3 ambientColor = lightWaterColor * 0.4;
    vec3 fresnelColor = vec3(1.0, 1.0, 1.0) * fresnel * 0.6;
    vec3 specularColor = vec3(1.0, 1.0, 1.0) * specular * 0.8;
    
    // 파장에 따른 색상 변화 (감정 색상 기반)
    vec3 rippleColor = mix(vec3(0.9, 0.95, 1.0), emotionColor, 0.3) * abs(vDisplacement) * 0.3;
    
    // 최종 색상 합성
    vec3 finalColor = ambientColor + diffuseColor + fresnelColor + specularColor + rippleColor;
    
    // 투명도 계산 (A코드 방식 유지)
    float alpha = 0.7 + fresnel * 0.2 + abs(vDisplacement) * 0.3;
    alpha = clamp(alpha, 0.4, 0.9);
    
    // 시간에 따른 미묘한 변화
    float timeVariation = sin(u_time * 0.4) * 0.05 + 0.95;
    finalColor *= timeVariation;
    
    gl_FragColor = vec4(finalColor, alpha);
}
`;

export default fragmentShader;
