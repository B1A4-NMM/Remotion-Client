// components/VirtualizedRelationNode.tsx
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import StaticBlob from './StaticBlob';
import { Canvas } from '@react-three/fiber';
import { mapEmotionToColor } from '../../constants/emotionColors';

export type ColorKey = "gray" | "gray2" | "blue" | "green" | "red" | "yellow";

interface Emotion {
  color: ColorKey;
  intensity: number;
}

interface RelationNodeData {
  affection: number;
  count: number;
  highestEmotion: string;
  id: number;
  name: string;
  secondEmotion?: string;
}

interface VirtualizedRelationNodeProps {
  nodeData: RelationNodeData;
  x: number;
  y: number;
  radius: number;
  isActive?: boolean;
  onClick?: () => void;
  isMe?: boolean;
}

const VirtualizedRelationNode: React.FC<VirtualizedRelationNodeProps> = ({
    nodeData,
    x,
    y,
    radius,
    isActive = true,
    onClick,
    isMe = false
  }) => {
    // ✅ '나' 노드는 초기값을 true로 설정
    const [shouldRender, setShouldRender] = useState(isMe);
    const nodeRef = useRef<HTMLDivElement>(null);
    
    const { isIntersecting } = useIntersectionObserver(nodeRef, {
      threshold: 0.1,
      rootMargin: '100px'
    });
  
    useEffect(() => {
      // ✅ '나' 노드는 항상 렌더링, 다른 노드만 viewport 기반
      if (isMe) {
        setShouldRender(true);
      } else {
        setShouldRender(isIntersecting && isActive);
      }
    }, [isIntersecting, isActive, isMe]);
  

  // ✅ 관계 데이터를 emotions 배열로 변환
  const processRelationEmotions = useCallback((data: RelationNodeData): Emotion[] => {
    const emotions: Emotion[] = [];
    
    if (data.highestEmotion && data.highestEmotion !== '무난') {
      const primaryColor = mapEmotionToColor(data.highestEmotion);
      emotions.push({
        color: primaryColor,
        intensity: Math.min(data.affection / 100, 1) || 0.7
      });
    }
    
    if (data.secondEmotion && data.secondEmotion !== data.highestEmotion && data.secondEmotion !== '무난') {
      const secondaryColor = mapEmotionToColor(data.secondEmotion);
      emotions.push({
        color: secondaryColor,
        intensity: 0.3
      });
    }
    
    if (emotions.length === 0) {
      emotions.push({ color: "gray", intensity: 1 });
    }
    
    return emotions;
  }, []);

  // ✅ '나' 노드는 무색, 다른 노드는 감정 기반 색상
  const processedEmotions = useMemo(() => {
    if (isMe) {
        return [{ color: "red" as ColorKey, intensity: 1 }]; // 매우 연한 회색
    }
    return processRelationEmotions(nodeData);
  }, [isMe, nodeData, processRelationEmotions]);

  const scale = useMemo(() => {
    const baseScale = radius / 30; // 기본 반지름 30 기준
    return Math.max(0.5, Math.min(2.0, baseScale));
  }, [radius]);

  // ✅ '나' 노드용 placeholder 색상
  const getPlaceholderColor = () => {
    if (isMe) {
      return '#F3F4F6'; // 매우 연한 회색
    }
    
    const primaryEmotion = processedEmotions[0];
    if (!primaryEmotion) return '#9CA3AF';
    
    const colorMap: Record<ColorKey, string> = {
      gray: '#9CA3AF',
      gray2: '#D1D5DB',
      blue: '#3B82F6',
      green: '#10B981',
      red: '#EF4444',
      yellow: '#F59E0B'
    };
    
    return colorMap[primaryEmotion.color] || '#9CA3AF';
  };

  return (
    <div
      ref={nodeRef}
      className="absolute pointer-events-auto"
      style={{
        left: x - radius,
        top: y - radius,
        width: radius * 2,
        height: radius * 2,
        zIndex: isMe ? 20 : 10,
      }}
      onClick={onClick}
    >
      <div className="w-full h-full cursor-pointer" style={{ borderRadius: '50%', overflow: 'hidden' }}>
        {/* ✅ '나' 노드는 항상 Canvas, 다른 노드는 조건부 */}
        {(shouldRender || isMe) ? (
          <Canvas camera={{ position: [0, 0, 3 * scale] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <StaticBlob emotions={processedEmotions} scale={scale} />
          </Canvas>
        ) : (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-xs font-medium"
            style={{
              backgroundColor: getPlaceholderColor(),
              color: isMe ? '#6B7280' : '#FFFFFF',
              border: isMe ? '2px solid #E5E7EB' : 'none'
            }}
          >
            {nodeData.name}
          </div>
        )}
      </div>
      
      {/* 이름 라벨 */}
      <div 
        className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-center font-medium whitespace-nowrap"
        style={{ 
          color: isMe ? '#000' : '#666',
          fontWeight: isMe ? 'bold' : 'normal'
        }}
      >
        {nodeData.name}
      </div>
    </div>
  );  
};

export default VirtualizedRelationNode;
