// components/VirtualizedRelationNode.tsx
import React, { useMemo, useCallback } from 'react';
import StaticBlob from './StaticBlob';
import { Canvas } from '@react-three/fiber';
import { mapEmotionToColor } from '../../constants/emotionColors';
import { useTheme } from '../theme-provider';

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
  onClick?: () => void;
  isMe?: boolean;
}

const VirtualizedRelationNode: React.FC<VirtualizedRelationNodeProps> = ({
  nodeData,
  x,
  y,
  radius,
  onClick,
  isMe = false
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

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

  // ✅ '나' 노드는 중성 색상, 다른 노드는 감정 기반 색상
  const processedEmotions = useMemo(() => {
    if (isMe) {
      return [{ color: "gray2" as ColorKey, intensity: 0.1 }];
    }
    return processRelationEmotions(nodeData);
  }, [isMe, nodeData, processRelationEmotions]);

  const scale = useMemo(() => {
    if (isMe) {
      return 1.8; // '나' 노드는 고정 크기
    }
    const baseScale = radius / 35;
    return Math.max(0.8, Math.min(1.6, baseScale));
  }, [radius, isMe]);

  // ✅ 폰트 크기 계산
  const getFontSize = () => {
    if (isMe) return '20px';
    return radius > 60 ? '16px' : radius > 40 ? '14px' : '12px';
  };

  return (
    <div
      className="absolute pointer-events-auto"
      style={{
        left: x - radius,
        top: y - radius,
        width: radius ,
        height: radius ,
        zIndex: isMe ? 20 : 10,
      }}
      onClick={onClick}
    >
      <div
        className="w-full h-full cursor-pointer relative"
        style={{
          borderRadius: '50%',
          overflow: 'hidden',
        }}
      >
        {/* ✅ 항상 Canvas로 렌더링 - Intersection Observer 제거 */}
        <Canvas 
          camera={{ position: [0, 0, 3 * scale], fov: 5 }}
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance", // 성능 우선
            preserveDrawingBuffer: true, // 렌더링 안정성
          }}
          style={{ background: 'transparent' }}
          dpr={Math.min(window.devicePixelRatio, 2)} // DPR 제한으로 성능 최적화
        >
          <ambientLight intensity={0.6} />
          <pointLight position={[8, 8, 8]} intensity={0.4} />
          <StaticBlob emotions={processedEmotions} scale={scale} />
        </Canvas>
        
        {/* ✅ 이름 라벨 - 항상 표시 */}
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center font-medium whitespace-nowrap pointer-events-none select-none"
          style={{ 
            color: isDark ? '#FFF' : '#000',
            fontWeight: isMe ? 'bold' : 'normal',
            fontSize: getFontSize(),
            textShadow: isDark 
              ? '1px 1px 2px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.5)' 
              : '1px 1px 2px rgba(255,255,255,0.9), 0 0 4px rgba(255,255,255,0.6)',
            zIndex: 10
          }}
        >
          {nodeData.name}
        </div>
      </div>
    </div>
  );
};

export default VirtualizedRelationNode;
