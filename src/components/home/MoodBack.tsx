import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

import "../../styles/moodback.css";

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

interface MoodBackProps {
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

const MoodBack: React.FC<MoodBackProps> = ({ diaryContent}) => {
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [gradientPosition, setGradientPosition] = useState({ x: 50, y: 50 });
  const [animationPhase, setAnimationPhase] = useState(0);

  
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
  
    // people 처리 (관계 감정) - 사람별 감정이 있는 경우
    if (diaryContent.people && Array.isArray(diaryContent.people)) {
      diaryContent.people.forEach((person: any) => {
        // 사람에게 감정 데이터가 있는 경우
        if (person.emotions && Array.isArray(person.emotions)) {
          person.emotions.forEach((emotion: any) => {
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
  }, [diaryContent]);

  // 움직이는 애니메이션 효과
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 360);
      
      // 그라데이션 위치 변경 (부드럽게 움직임)
      const time = Date.now() * 0.001;
      const newX = 50 + Math.sin(time * 0.3) * 20;
      const newY = 50 + Math.cos(time * 0.2) * 15;
      
      setGradientPosition({ x: newX, y: newY });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // 그라데이션 생성
  const generateAnimatedGradient = useMemo((): string => {
    if (emotions.length === 0 || emotions.every(e => e.color === "gray1" || e.color === "gray2")) {
      return `radial-gradient(circle at ${gradientPosition.x}% ${gradientPosition.y}%, 
        ${baseColors.gray1}40, ${baseColors.gray2}60)`;
    }

    if (emotions.length === 1) {
      const color = baseColors[emotions[0].color];
      return `radial-gradient(circle at ${gradientPosition.x}% ${gradientPosition.y}%, 
        ${color}60, ${color}20, ${color}05)`;
    }

    // 여러 감정이 있을 때 복합 그라데이션
    const colors = emotions.map((emotion, index) => {
      const color = baseColors[emotion.color];
      const intensity = emotion.intensity;
      const opacity = Math.max(0.1, Math.min(0.8, intensity));
      
      // 애니메이션 위상 적용
      const phaseOffset = (index * 60 + animationPhase) % 360;
      const phaseIntensity = (Math.sin(phaseOffset * Math.PI / 180) + 1) * 0.5;
      const finalOpacity = opacity * (0.5 + phaseIntensity * 0.5);
      
      return `${color}${Math.round(finalOpacity * 100).toString(16).padStart(2, '0')}`;
    });

    // 복합 그라데이션 생성
    const primaryColor = colors[0];
    const secondaryColor = colors[1] || colors[0];
    const tertiaryColor = colors[2] || colors[1] || colors[0];

    return `
      radial-gradient(ellipse at ${gradientPosition.x}% ${gradientPosition.y}%, 
        ${primaryColor}, ${secondaryColor}80, ${tertiaryColor}40, transparent 70%),
      linear-gradient(${animationPhase}deg, 
        ${primaryColor}30, ${secondaryColor}20, ${tertiaryColor}10)
    `;
  }, [emotions, gradientPosition, animationPhase]);

  // 코닉 그라데이션 생성 함수
  const generateConicGradient = useMemo(() => {
    if (emotions.length === 0 || emotions.every(e => e.color === "gray1" || e.color === "gray2")) {
      return `conic-gradient(from 0deg, 
        ${baseColors.gray1}, ${baseColors.gray2}, 
        ${baseColors.gray1}, ${baseColors.gray2})`;
    }

    if (emotions.length === 1) {
      const color = baseColors[emotions[0].color];
      return `conic-gradient(from 0deg, 
        ${color}, ${color}80, ${color}60, ${color})`;
    }

    // 여러 감정이 있을 때 부드러운 코닉 그라데이션
    const colors = emotions.map(emotion => baseColors[emotion.color]);
    
    // 색상들을 반복하여 부드러운 전환 효과 생성
    const gradientColors = [
      ...colors,
      ...colors.map(color => `${color}b3`), // 70% 투명도
      ...colors.map(color => `${color}80`), // 50% 투명도
      colors[0] // 시작점과 연결
    ];

    return `conic-gradient(from 0deg, ${gradientColors.join(', ')})`;
  }, [emotions]);


  return (
    <div className="absolute inset-0 -z-1 overflow-hidden">
      {/* 부드러운 파스텔 베이스 그라데이션 */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #ffe8f3, #d9f3ff)'
        }}
      />

      {/* 컨테이너 */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))'
        }}
      >
        {/* 첫 번째 회전 레이어 */}
        <motion.div
          className="absolute"
          style={{
            top: '60%',
            left: '60%',
            width: '120%',
            height: '120%',
            background: generateConicGradient,
            transform: 'translate(-50%, -50%)',
            filter: 'blur(50px)',
            opacity: 0.6,
          }}
          animate={{
            rotate: [0, 360]
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* 두 번째 회전 레이어 (역방향) */}
        <motion.div
          className="absolute"
          style={{
            top: '-50%',
            left: '-50%',
            width: '150%',
            height: '150%',
            background: generateConicGradient,
            transform: 'translate(-50%, -50%)',
            filter: 'blur(50px)',
            opacity: 0.6,
          }}
          animate={{
            rotate: [0, -360]
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* 추가 부드러운 오버레이 효과 */}
        {/* 진한 오버레이로 가독성 향상 */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'rgb(255, 255, 255, 0.3)', // 검은색 40% 불투명도
        }}
      />
      </div>
    </div>
  );
};

export default MoodBack;
