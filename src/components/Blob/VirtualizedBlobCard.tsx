import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import Blob from './Blob';
import BlobPlaceholder from './BlobPlaceholder';
import { Canvas } from '@react-three/fiber';
import { getBlobEmotionsFromSimpleEmotions } from '../../utils/activityEmotionUtils';


interface VirtualizedBlobCardProps {
  diaryContent: any;
  index: number;
}

const VirtualizedBlobCard: React.FC<VirtualizedBlobCardProps> = ({ diaryContent, index }) => {
  const processedEmotions = useMemo(() => 
    getBlobEmotionsFromSimpleEmotions(diaryContent), 
    [diaryContent]
  );
  const [isActive, setIsActive] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Intersection Observer로 viewport 감지
  const { isIntersecting } = useIntersectionObserver(cardRef, {
    threshold: 0.1,
    rootMargin: '50px'
  });



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
