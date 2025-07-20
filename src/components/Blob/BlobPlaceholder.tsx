// BlobPlaceholder.tsx
import React, { useMemo } from 'react';
import { baseColors, mapEmotionToColor } from '../../constants/emotionColors';

interface BlobPlaceholderProps {
  diaryContent: any;
  hasBeenVisible: boolean;
}

const BlobPlaceholder: React.FC<BlobPlaceholderProps> = ({ 
  diaryContent, 
  hasBeenVisible 
}) => {
  const emotions = useMemo(() => {
    if (!diaryContent?.emotions) return [];
    
    return diaryContent.emotions
      .filter((emotion: any) => emotion.emotion && emotion.emotion !== '무난')
      .map((emotion: any) => ({
        color: mapEmotionToColor(emotion.emotion),
        intensity: emotion.intensity || 5
      }));
  }, [diaryContent]);

  const gradientColors = useMemo(() => {
    if (emotions.length === 0) return ['#707070'];
    
    return emotions
      .sort((a, b) => b.intensity - a.intensity)
      .slice(0, 3)
      .map(emotion => baseColors[emotion.color]);
  }, [emotions]);

  const gradientStyle = useMemo(() => {
    if (gradientColors.length === 1) {
      return { backgroundColor: gradientColors[0] };
    }
    
    const gradient = gradientColors.join(', ');
    return {
      background: `linear-gradient(45deg, ${gradient})`
    };
  }, [gradientColors]);

  return (
    <div 
      className={`blob-placeholder ${hasBeenVisible ? 'seen' : ''}`}
      style={gradientStyle}
    >
      {!hasBeenVisible && (
        <div className="loading-indicator">
          <div className="pulse-animation" />
        </div>
      )}
    </div>
  );
};


export default BlobPlaceholder;