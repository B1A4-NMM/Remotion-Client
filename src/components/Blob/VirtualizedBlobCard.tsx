// VirtualizedBlobCard.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import Blob from './Blob';
import BlobPlaceholder from '../Blob/BlobPlaceholder';
import { Canvas } from '@react-three/fiber';

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
    rootMargin: '50px' // 약간 먼저 로드
  });

  useEffect(() => {
    if (isIntersecting) {
      setIsActive(true);
      setHasBeenVisible(true);
    } else {
      // viewport에서 벗어나면 3D 렌더링 중단
      setIsActive(false);
    }
  }, [isIntersecting]);

  return (
    <div ref={cardRef} className="diary-card">
      {/* 카드 내용 */}
      <div className="card-content">
        {/* 기존 카드 내용 */}
      </div>
      
      {/* Blob 영역 - 크기 명시적 설정 */}
      <div 
        className="blob-container"
        style={{
          width: '100%',
          height: '80px', // 원하는 높이 설정
          position: 'relative' // 중요: relative 또는 absolute positioning 필요
        }}
      >
        {isActive ? (
          <Canvas>
            <Blob diaryContent={diaryContent} />
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