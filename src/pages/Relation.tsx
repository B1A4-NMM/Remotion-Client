"use client";

// components/Relation.tsx
import React, { useRef, useEffect, useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { motion, useMotionValue } from "framer-motion";
import { useNavigate } from "react-router-dom";
import StaticBlob from "@/components/Blob/StaticBlob";
import { mapEmotionToColor } from "@/constants/emotionColors";
import { useGetRelation } from "../api/queries/relation/useGetRelation";
import { useTheme } from "@/components/theme-provider";

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

interface ProcessedNode extends RelationNodeData {
  x: number;
  y: number;
  radius: number;
  isMe: boolean;
  emotions: Emotion[];
  scale: number;
}

// ✅ 개별 Blob 컴포넌트
const RelationBlob: React.FC<{ 
  node: ProcessedNode; 
  position: [number, number, number];
}> = ({ node, position }) => {
  return (
    <group position={position}>
      <StaticBlob emotions={node.emotions} scale={node.scale} />
    </group>
  );
};

// ✅ 텍스트 라벨 컴포넌트
const NodeLabel: React.FC<{ 
  node: ProcessedNode; 
}> = ({ node }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  
  const getFontSize = () => {
    if (node.isMe) return '20px';
    return node.radius > 60 ? '16px' : node.radius > 40 ? '14px' : '12px';
  };

  return (
    <div
      className="absolute pointer-events-auto cursor-pointer"
      style={{
        left: node.x - node.radius,
        top: node.y - node.radius,
        width: node.radius * 2,
        height: node.radius * 2,
        zIndex: node.isMe ? 20 : 10,
      }}
    >
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center font-medium whitespace-nowrap pointer-events-none select-none"
        style={{ 
          color: isDark ? '#FFF' : '#000',
          fontWeight: node.isMe ? 'bold' : 'normal',
          fontSize: getFontSize(),
          textShadow: isDark 
            ? '1px 1px 2px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.5)' 
            : '1px 1px 2px rgba(255,255,255,0.9), 0 0 4px rgba(255,255,255,0.6)',
          zIndex: 10
        }}
      >
        {node.name}
      </div>
    </div>
  );
};

const Relation = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasScrolledToMe = useRef(false);
  
  const [nodes, setNodes] = useState<ProcessedNode[]>([]);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  
  const { data: relationData } = useGetRelation();
  const navigate = useNavigate();
  
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);

  // 감정 처리 함수
  const processRelationEmotions = (data: RelationNodeData): Emotion[] => {
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
  };

  // 노드 생성
  useEffect(() => {
    if (!relationData?.relations?.relations || !containerRef.current) return;
    
    const container = containerRef.current;
    const { width, height } = container.getBoundingClientRect();
    setContainerSize({ width, height });
    
    const centerX = width / 2;
    const centerY = height / 2;
    
    const relationArray = relationData.relations.relations;
    const processedNodes: ProcessedNode[] = [];
    
    // "나" 노드 생성
    const meNode: ProcessedNode = {
      id: 0,
      name: "나",
      affection: 0,
      count: 0,
      highestEmotion: "",
      secondEmotion: "",
      x: centerX,
      y: centerY,
      radius: 80,
      isMe: true,
      emotions: [{ color: "gray2" as ColorKey, intensity: 0.1 }],
      scale: 1.8
    };
    processedNodes.push(meNode);
    
    // 관계 노드들 생성
    relationArray.forEach((relation: RelationNodeData, index: number) => {
      const angle = (index * 2 * Math.PI) / relationArray.length;
      const baseDistance = 180;
      const affectionBonus = (relation.affection / 100) * 80;
      const distance = baseDistance + affectionBonus;
      
      const baseRadius = 20;
      const affectionRadius = (relation.affection / 100) * 25;
      const radius = Math.max(25, Math.min(75, baseRadius + affectionRadius));
      const scale = Math.max(0.8, Math.min(1.6, radius / 35));
      
      const node: ProcessedNode = {
        ...relation,
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        radius: radius,
        isMe: false,
        emotions: processRelationEmotions(relation),
        scale: scale
      };
      processedNodes.push(node);
    });
    
    setNodes(processedNodes);
    console.log(`총 ${processedNodes.length}개 노드 생성 완료`);
    
    if (!hasScrolledToMe.current) {
      const targetX = centerX - width / 2;
      container.scrollLeft = targetX;
      hasScrolledToMe.current = true;
    }
    
  }, [relationData]);

  // ✅ 수정된 3D 좌표 변환 - 화면 좌표와 정확히 일치하도록
  const blobPositions = useMemo(() => {
    if (!containerSize.width || !containerSize.height) return [];
    
    return nodes.map(node => {
      // ✅ 화면 좌표를 그대로 사용하되, 스케일만 조정
      const scale = 2; // 스케일 팩터
      const x = (node.x - containerSize.width / 2) / (containerSize.width / scale);
      const y = -(node.y - containerSize.height / 2) / (containerSize.height / scale);
      const z = 0;
      return [x, y, z] as [number, number, number];
    });
  }, [nodes, containerSize]);

  const handleNodeClick = (node: ProcessedNode) => {
    if (node.isMe) {
      navigate('/analysis');
    } else {
      navigate(`/relation/${node.id}`);
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full h-screen overflow-auto relative"
    >
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.1}
        style={{ x: offsetX, y: offsetY }}
        className="relative"
        style={{
          width: containerSize.width * 3,
          height: containerSize.height,
          minHeight: '100vh'
        }}
      >
        {/* ✅ 연결선 SVG */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width="100%"
          height="100%"
          style={{ zIndex: 1 }}
        >
          <defs>
            <marker
              id="arrowhead-v"
              markerWidth="10"
              markerHeight="8"
              refX="8"
              refY="4"
              orient="auto"
            >
              <path
                d="M 2 2 L 8 4 L 2 6"
                fill="none"
                stroke="#9CA3AF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </marker>
          </defs>

          {nodes.length > 0 && nodes.slice(1).map((node, index) => {
            const meNode = nodes[0];
            const opacity = Math.max(0.3, Math.min(0.8, node.affection / 100));
            const strokeWidth = Math.max(1.5, Math.min(3, (node.affection / 100) * 2 + 1));
            
            const angle = Math.atan2(meNode.y - node.y, meNode.x - node.x);
            const startX = node.x + Math.cos(angle) * node.radius * 1.2;
            const startY = node.y + Math.sin(angle) * node.radius * 1.2;
            const endX = meNode.x - Math.cos(angle) * meNode.radius * 1.3;
            const endY = meNode.y - Math.sin(angle) * meNode.radius * 1.3;
            
            const pathData = `M ${startX} ${startY} L ${endX} ${endY}`;
            
            return (
              <path
                key={`edge-${index}`}
                d={pathData}
                stroke="#9CA3AF"
                strokeWidth={strokeWidth}
                strokeOpacity={opacity}
                fill="none"
                markerEnd="url(#arrowhead-v)"
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* ✅ 수정된 Canvas 설정 */}
        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          <Canvas
            camera={{ 
              position: [10, 0, 20], // ✅ 카메라 위치 수정
              fov: 75,             // ✅ FOV 증가
              near: 0.1,
              far: 1000
            }}
            gl={{ 
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
            style={{ background: 'transparent' }}
          >
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={0.4} />
            
            {/* ✅ 모든 Blob을 하나의 Canvas에서 렌더링 */}
            {nodes.map((node, index) => (
              <RelationBlob
                key={`blob-${node.id}`}
                node={node}
                position={blobPositions[index] || [0, 0, 0]}
              />
            ))}
          </Canvas>
        </div>

        {/* ✅ 텍스트 라벨들 (Canvas 위에 오버레이) */}
        <div className="absolute inset-0" style={{ zIndex: 3 }}>
          {nodes.map((node) => (
            <div
              key={`label-${node.id}`}
              onClick={() => handleNodeClick(node)}
            >
              <NodeLabel node={node} />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Relation;
