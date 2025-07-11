import React, { useState, useEffect } from 'react';
import '../../styles/Waveback.css';

// 타입 정의
type ColorKey = 'gray' | 'gray1' | 'gray2' | 'blue' | 'green' | 'red' | 'yellow';

// 기본 색상 정의
const baseColors: Record<ColorKey, string> = {
  green: "#4ecdc4",
  red: "#ff6b6b", 
  yellow: "#ffe66d",
  blue: "#45b7d1",
  gray: "#c4c4c4",
  gray1: "#c4c4c4",
  gray2: "#424242",
} as const;

interface Emotion {
  color: ColorKey;
  intensity: number;
}

interface WavebackProps {
  diaryContent: any;
}

// 감정을 ColorKey로 매핑하는 함수
const mapEmotionToColor = (emotion: string): ColorKey => {
  const highEnergyPleasant = new Set([
    '행복', '기쁨', '즐거움', '설렘', '흥분', '활력',
    '자긍심', '자신감', '뿌듯함', '성취감',
    '사랑', '애정', '기대', '놀람'
  ]);

  const highEnergyUnpleasant = new Set([
    '분노', '짜증', '질투', '시기', '경멸', '거부감', '불쾌',
    '긴장', '불안', '초조', '억울', '배신감', '상처'
  ]);

  const lowEnergyUnpleasant = new Set([
    '우울', '슬픔', '공허', '외로움', '실망', '속상',
    '부끄러움', '수치', '죄책감', '후회', '뉘우침', '창피', '굴욕',
    '피로', '지침', '무기력', '지루', '부담'
  ]);

  const lowEnergyPleasant = new Set([
    '평온', '편안', '안정', '차분', '감사', '존경', 
    '신뢰', '친밀', '유대', '공감', '만족감'
  ]);

  if (highEnergyPleasant.has(emotion)) return 'yellow';
  if (highEnergyUnpleasant.has(emotion)) return 'red';
  if (lowEnergyUnpleasant.has(emotion)) return 'blue';
  if (lowEnergyPleasant.has(emotion)) return 'green';
  return 'gray1';
};

const Waveback: React.FC<WavebackProps> = ({ diaryContent }) => {
  const [emotions, setEmotions] = useState<Emotion[]>([]);

  console.log(diaryContent);
  // 감정 데이터 처리
  const processDiaryContentEmotions = (): Emotion[] => {
    if (!diaryContent) {
      return [{ color: "gray1" as ColorKey, intensity: 1 }];
    }
  
    const allEmotions: { type: string; intensity: number }[] = [];
  
    // selfEmotion 처리 (자아 감정)
    if (diaryContent.selfEmotion && Array.isArray(diaryContent.selfEmotion)) {
      diaryContent.selfEmotion.forEach((emotion: any) => {
        if (emotion && emotion.emotionType) {
          allEmotions.push({
            type: emotion.emotionType,
            intensity: emotion.intensity || emotion.emotionIntensity || 5
          });
        }
      });
    }
  
    // stateEmotion 처리 (상태 감정)
    if (diaryContent.stateEmotion && Array.isArray(diaryContent.stateEmotion)) {
      diaryContent.stateEmotion.forEach((emotion: any) => {
        if (emotion && emotion.emotionType) {
          allEmotions.push({
            type: emotion.emotionType,
            intensity: emotion.intensity || emotion.emotionIntensity || 5
          });
        }
      });
    }
  
    // people 처리 (관계 감정)
    if (diaryContent.people && Array.isArray(diaryContent.people)) {
      diaryContent.people.forEach((person: any) => {
        if (person.feel && Array.isArray(person.feel)) {
          person.feel.forEach((emotion: any) => {
            if (emotion && emotion.emotionType) {
              allEmotions.push({
                type: emotion.emotionType,
                intensity: (emotion.intensity || emotion.emotionIntensity || 5)
              });
            }
          });
        }
      });
    }

    console.log("처리된 모든 감정들: ", allEmotions);
  
    if (allEmotions.length === 0) {
      return [{ color: "gray1" as ColorKey, intensity: 1 }];
    }
  
    // 색상별로 그룹화하고 강도 계산
    const colorMap = new Map<ColorKey, number>();
    allEmotions.forEach(({ type, intensity }) => {
      const color = mapEmotionToColor(type);
      colorMap.set(color, (colorMap.get(color) || 0) + intensity);
    });
  
    // gray 색상 제거 (다른 색상이 있는 경우)
    if (colorMap.size > 1) {
      colorMap.delete("gray1");
      colorMap.delete("gray2");
    }
  
    const totalColorIntensity = [...colorMap.values()].reduce((sum, val) => sum + val, 0);
  
    return [...colorMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([color, total]) => ({
        color,
        intensity: +(total / totalColorIntensity).toFixed(3)
      }));
  };

  // 감정 데이터 업데이트
  useEffect(() => {
    const processedEmotions = processDiaryContentEmotions();
    setEmotions(processedEmotions);
    console.log("최종 감정 배열:", processedEmotions);
  }, [diaryContent]);

  // 감정에 따른 색상 계산
  // 다중 감정 색상 계산 (수정된 함수)
  const getWaveColors = () => {
    console.log("현재 emotions 상태:", emotions);
    
    if (emotions.length === 0) {
      return {
        color1: 'rgba(196,196,196,0.7)',
        color2: 'rgba(196,196,196,0.5)',
        color3: 'rgba(196,196,196,0.3)',
        color4: 'rgba(196,196,196,1)'
      };
    }

    // 4개의 파도 레이어를 위한 색상 배열 생성
    const waveColors = [];
    
    // 감정 수에 따라 색상 배정
    for (let i = 0; i < 4; i++) {
      if (i < emotions.length) {
        // 해당 인덱스에 감정이 있는 경우
        const emotion = emotions[i];
        const emotionColor = baseColors[emotion.color];
        
        // RGB 값 추출
        const rgb = emotionColor.replace('#', '');
        const r = parseInt(rgb.substr(0, 2), 16);
        const g = parseInt(rgb.substr(2, 2), 16);
        const b = parseInt(rgb.substr(4, 2), 16);
        
        // intensity에 따라 투명도 조절 (뒤로 갈수록 더 연하게)
        const baseOpacity = 1 - (i * 0.15); // 1, 0.85, 0.7, 0.55
        const finalOpacity = Math.max(0.3, baseOpacity * emotion.intensity);
        
        waveColors.push(`rgba(${r},${g},${b},${finalOpacity.toFixed(2)})`);
      } else {
        // 감정이 부족한 경우 마지막 감정의 색상을 더 연하게 사용
        const lastEmotion = emotions[emotions.length - 1];
        const lastColor = baseColors[lastEmotion.color];
        
        const rgb = lastColor.replace('#', '');
        const r = parseInt(rgb.substr(0, 2), 16);
        const g = parseInt(rgb.substr(2, 2), 16);
        const b = parseInt(rgb.substr(4, 2), 16);
        
        // 점점 더 연하게
        const opacity = Math.max(0.1, 0.4 - (i - emotions.length + 1) * 0.1);
        waveColors.push(`rgba(${r},${g},${b},${opacity.toFixed(2)})`);
      }
    }

    const result = {
      color1: waveColors[0],
      color2: waveColors[1],
      color3: waveColors[2],
      color4: waveColors[3]
    };
    
    console.log("다중 감정 색상 결과:", result);
    return result;
  };


  const waveColors = getWaveColors();

  return (
    <div className="waveback-container">
      <svg 
        className="waves" 
        xmlns="http://www.w3.org/2000/svg" 
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28" 
        preserveAspectRatio="none" 
        shapeRendering="auto"
      >
        <defs>
          <path 
            id="gentle-wave" 
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" 
          />
        </defs>
        <g className="parallax">
          <use 
            xlinkHref="#gentle-wave" 
            x="48" 
            y="0" 
            fill={waveColors.color1}
          />
          <use 
            xlinkHref="#gentle-wave" 
            x="48" 
            y="3" 
            fill={waveColors.color2}
          />
          <use 
            xlinkHref="#gentle-wave" 
            x="48" 
            y="5" 
            fill={waveColors.color3}
          />
          <use 
            xlinkHref="#gentle-wave" 
            x="48" 
            y="7" 
            fill={waveColors.color4}
          />
        </g>
      </svg>
    </div>
  );
};

export default Waveback;
