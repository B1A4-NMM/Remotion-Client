import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import Blob from './Blob';
import BlobPlaceholder from './BlobPlaceholder';
import { Canvas } from '@react-three/fiber';
import { mapEmotionToColor } from '../../constants/emotionColors'; // ✅ import 추가

// ✅ 타입 정의 추가
export type ColorKey = "gray" | "gray2" | "blue" | "green" | "red" | "yellow";

interface Emotion {
  color: ColorKey;
  intensity: number;
}

interface VirtualizedBlobCardProps {
  diaryContent: any;
  index: number;
}

const VirtualizedBlobCard: React.FC<VirtualizedBlobCardProps> = ({ 
  diaryContent, 
  index 
}) => {
  const [isActive, setIsActive] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Intersection Observer로 viewport 감지
  const { isIntersecting } = useIntersectionObserver(cardRef, {
    threshold: 0.1,
    rootMargin: '50px'
  });

  // ✅ processDiaryContentEmotions 함수 이동
  const processDiaryContentEmotions = useCallback((content: any): Emotion[] => {
    if (!content) {
      return [{ color: "gray" as ColorKey, intensity: 1 }];
    }

    const allEmotions: { type: string; intensity: number }[] = [];

    // emotions 배열 지원 추가
    if (content.emotions && Array.isArray(content.emotions)) {
      content.emotions.forEach((emotion: any) => {
        if (emotion && emotion.emotion && emotion.emotion !== '무난') {
          allEmotions.push({
            type: emotion.emotion,
            intensity: emotion.intensity || 5,
          });
        }
      });
    }

    if (allEmotions.length === 0) {
      return [{ color: "gray" as ColorKey, intensity: 1 }];
    }

    const colorMap = new Map<ColorKey, number>();
    allEmotions.forEach(({ type, intensity }) => {
      const color = mapEmotionToColor(type);
      colorMap.set(color, (colorMap.get(color) || 0) + intensity);
    });

    if (colorMap.size > 1) {
      colorMap.delete("gray");
      colorMap.delete("gray2");
    }
    
    const totalColorIntensity = [...colorMap.values()].reduce((sum, val) => sum + val, 0);

    return [...colorMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([color, total]) => ({
        color,
        intensity: +(total / totalColorIntensity).toFixed(3),
      }));
  }, []);

  // ✅ diaryContent를 처리해서 emotions 배열 생성
  const processedEmotions = useMemo(() => {
    return processDiaryContentEmotions(diaryContent);
  }, [diaryContent, processDiaryContentEmotions]);

  useEffect(() => {
    if (isIntersecting) {
      setIsActive(true);
      setHasBeenVisible(true);
    } else {
      setIsActive(false);
    }
  }, [isIntersecting]);

  return (
    <div ref={cardRef} className="diary-card">
      {/* 카드 내용 */}
      <div className="card-content">
        {/* 기존 카드 내용 */}
      </div>
      
      {/* Blob 영역 */}
      <div 
        className="blob-container"
        style={{
          width: '100%',
          height: '80px',
          position: 'relative'
        }}
      >
        {isActive ? (
          <Canvas>
            {/* ✅ emotions 배열을 Blob에 전달 */}
            <Blob 
              emotions={processedEmotions} 
              id={`blob-${index}`}
            />
          </Canvas>
        ) : (
          <BlobPlaceholder 
            diaryContent={diaryContent} 
            hasBeenVisible={hasBeenVisible}
          />
        )}
      </div>
    </div>
  );
};

export default VirtualizedBlobCard;
