import { motion } from 'framer-motion';
import React, { useState, useEffect, useRef} from 'react';

import { Card, CardDescription, CardTitle, CardHeader, CardContent} from '../components/ui/card';
import { ArrowLeft, Clock, CirclePlus, Plus, PlusCircle } from "lucide-react"
import { Button } from '../components/ui/button';


import '../styles/moodCircle.css';


interface Emotion {
  color: string;
  intensity: number;
}

const baseColors = {
  green: '#4ecdc4',
  red: '#ff6b6b',
  yellow: '#ffe66d',
  blue: '#45b7d1'
} as const;

type ColorKey = keyof typeof baseColors;

const MoodCircle = () => {
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [scrollY, setScrollY] = useState(0);

  const contentRef = useRef<HTMLDivElement>(null);

  const processEmotions = (colors: string[], intensities: number[]): Emotion[] => {
    const colorMap = new Map<string, number>();
    
    // colors 배열을 기준으로 반복
    colors.forEach((color, index) => {
      const intensity = intensities[index];
      colorMap.set(color, (colorMap.get(color) || 0) + intensity);
    });
    
    return Array.from(colorMap.entries()).map(([color, totalIntensity]) => ({
      color: color as ColorKey,
      intensity: totalIntensity / 10 // 0-1 범위로 정규화
    }));
  };

  useEffect(() => {
      const exEmotionColors = ['blue', 'blue', 'blue', 'yellow', 'red', 'green'];
      const exIntensities = [7, 3, 4, 6, 9, 1];
      const processedEmotions = processEmotions(exEmotionColors, exIntensities);
      setEmotions(processedEmotions);
    }, []); // 빈 의존성 배열로 한 번만 실행
  
  // emotions 상태를 사용하여 그라데이션 생성
  const generateGradient = (): string => {
    if (emotions.length === 0) return '#333';
    if (emotions.length === 1) return baseColors[emotions[0].color];
    
    const intensities = emotions.map(e => e.intensity);
    const maxIntensity = Math.max(...intensities);
    const normalizedIntensities = intensities.map(i => i / maxIntensity);
    
    const totalWeight = normalizedIntensities.reduce((sum, weight) => sum + weight, 0);
    let cumulative = 0;
    
    const colors = emotions.map((emotion, index) => {
      cumulative += normalizedIntensities[index];
      const position = (cumulative / totalWeight) * 100;
      return `${baseColors[emotion.color]} ${position.toFixed(1)}%`;
    });
    
    return `radial-gradient(ellipse at center, ${colors.join(', ')})`;
    
  };

  // 드래그 위치에 따른 mood-circle 크기 계산
  const getMoodCircleScale = () => {
    const maxDrag = 100;
    const minScale = 0.8;
    const maxScale = 1; // 아래로 드래그할 때 최대 크기
    
    if (scrollY <= 0) {
      // 위로 드래그: 크기 감소 (1 → 0.5)
      return Math.max(minScale, 1 + scrollY / maxDrag);
    } else {
      // 아래로 드래그: 크기 증가 (1 → 1.2)
      return Math.min(maxScale, 1 + (scrollY / maxDrag));
    }
  };

  return (
    <div>
      <motion.div 
        className="mood-container flex justify-center mb-6"
        animate={{ 
          scale: getMoodCircleScale(),
          opacity: Math.max(0.5, getMoodCircleScale())
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div 
          className="mood-circle w-48 h-48 rounded-full"
          style={{ 
            background: generateGradient(),
            boxShadow: `0 0 40px ${emotions[0]?.color || '#4ecdc4'}40`
          }}
        />
      </motion.div>
    </div>
  );
};


const diaryList = () =>{

  return (
    <div className="space-y-4 mb-10">
      {emotionCards.map((card, index) => (
        <Card key={index} className="bg-gray-100 border-gray-300 p-4">
          <div className="mb-3">
              {card.title}
          </div>
          <div className='flex flex-wrap gap-2'>
            {card.emotions.map((emotion, index)=>(
              <Button key={index} variant="outline" size="sm" className='rounded-full'>
                {emotion}
              </Button>
            ))}
            <Button variant="outline" size="sm" className='rounded-full w-8 h-8 p-0' onClick={()=>{/*감정 추가 로직*/}}>
              <CirclePlus className='h-4 w-4'/>
            </Button>
          </div>
        </Card>
      ))}
      </div>
  )
}

const Home = () => {
  return (
    <div className='base'>
      <MoodCircle/>
    </div>
  );
};

export default Home;
