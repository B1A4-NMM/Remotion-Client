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
import { useGetAuthTest } from "@/api/queries/auth/useGetAuthTest";

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

const Relation = () => {
  const { data: authData, isLoading, error } = useGetAuthTest();
  const apiUser = authData?.user;
  const nickname = apiUser?.nickname || '나';
  
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasScrolledToMe = useRef(false);
  
  const { theme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  
  const [nodes, setNodes] = useState<ProcessedNode[]>([]);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  
  const { data: relationData } = useGetRelation();
  const navigate = useNavigate();
  
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
    const rect = container.getBoundingClientRect();
    
    const expandedWidth = rect.width * 1.3;  // 20% 확장
    const expandedHeight = rect.height * 1.3; // 20% 확장
    
    setContainerSize({ 
      width: expandedWidth, 
      height: expandedHeight 
    });
    
    // ✅ 확장된 Canvas 크기 기준으로 계산
    const canvasW = expandedWidth * 2;
    const canvasH = expandedHeight * 2;
    const centerX = canvasW / 2.35;    // 확장된 공간의 중심
    const centerY = canvasH / 2.8;    // 확장된 공간의 중심
    
    const relationArray = relationData.relations.relations;
    const processedNodes: ProcessedNode[] = [];
    
    // "나" 노드 생성
    const meNode: ProcessedNode = {
      id: 0,
      name: nickname,
      affection: 0,
      count: 0,
      highestEmotion: "",
      secondEmotion: "",
      x: centerX,
      y: centerY,
      radius: 80,
      isMe: true,
      emotions: [{ color: "gray" as ColorKey, intensity: 1 }],
      scale: 25  // ✅ 크기 조정 (30 → 15)
    };
    processedNodes.push(meNode);
    
    // ✅ 관계 노드들 - 확장된 공간에 맞게 배치
    relationArray.forEach((relation: RelationNodeData, index: number) => {
      const angle = (index * 2 * Math.PI) / relationArray.length;
      const baseDistance = 200;  // ✅ 기본 거리 확장 (180 → 300)
      const affectionBonus = (relation.affection / 100) * 200;  // ✅ 보너스도 확장
      const distance = baseDistance + affectionBonus;
      
      const baseRadius = 10;
      const affectionRadius = (relation.affection / 100) * 15;
      const radius = Math.max(25, Math.min(50, baseRadius + affectionRadius));
      const scale = Math.max(8, Math.min(20, radius / 2.5));  // radius 25-50 → scale 8-20
      
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
    
    // ✅ 초기 스크롤 위치 - 확장된 공간의 중심으로
    if (!hasScrolledToMe.current) {
      const targetX = (canvasW / 2) - (expandedWidth / 2);
      const targetY = (canvasH / 2) - (expandedHeight / 2);
      
      container.scrollLeft = targetX;
      container.scrollTop = targetY;
      hasScrolledToMe.current = true;
    }
    
  }, [relationData]);

  

  const handleNodeClick = (node: ProcessedNode) => {
    if (node.isMe) {
      navigate('/analysis');
    } else {
      navigate(`/relation/${node.id}`);
    }
  };

  // ✅ containerSize가 유효할 때만 Canvas 렌더링
  const canvasWidth = containerSize.width * 2;
  const canvasHeight = containerSize.height *2;

  const isMobile = useMemo(() => {
    return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center overflow-auto relative">
      <div 
        ref={containerRef} 
        className="w-full h-full max-w-[95vw] max-h-[95vh] overflow-auto relative"

      >
        <motion.div
          drag
          dragMomentum={false}
          dragElastic={0.1}
          className="relative"
          style={{
            width: canvasWidth,
            height: canvasHeight,
            minWidth: '150vw',   // 충분한 드래그 공간
            minHeight: '150vh',
          }}
        >
          {/* 연결선 SVG */}
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
              const startX = node.x + Math.cos(angle) * node.radius * 1.5;
              const startY = node.y + Math.sin(angle) * node.radius * 1.5;
              const endX = meNode.x - Math.cos(angle) * meNode.radius * 1.5;
              const endY = meNode.y - Math.sin(angle) * meNode.radius * 1.5;
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

          {/* Orthographic Camera 사용 */}
          {containerSize.width > 0 && containerSize.height > 0 && (
            <Canvas
              orthographic
              camera={{
                position: [0, 0, 350],
                zoom: 1,
                left: -canvasWidth / 2,
                right: canvasWidth / 2,
                top: canvasHeight / 2,
                bottom: -canvasHeight / 2,
                near: 1,
                far: 2000,
              }}
              style={{
                width: canvasWidth,
                height: canvasHeight,
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                zIndex: 2,
              }}
              gl={{
                antialias: !isMobile, // ✅ 모바일에서 안티알리어싱 비활성화
                alpha: true,
                powerPreference: isMobile ? "default" : "high-performance", // ✅ 모바일 최적화
                preserveDrawingBuffer: true,
              }}
              dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 2)} // ✅ 모바일에서 DPR 1로 고정
            >
              <ambientLight intensity={0.6} />
              <pointLight position={[0, 0, 500]} intensity={0.4} />
              
              {/* ✅ 1:1 좌표 매핑 */}
              {nodes.map((node) => (
                <group 
                  key={node.id} 
                  position={[
                    node.x - canvasWidth / 2,     // ✅ Canvas 중심 기준으로 변환
                    canvasHeight / 2 - node.y,   // ✅ Y축 뒤집기 (정확한 매핑)
                    0
                  ]}
                >
                  <StaticBlob 
                    emotions={node.emotions} 
                    scale={node.scale * 2.8}      // ✅ 적절한 크기로 조정
                  />
                </group>
              ))}
            </Canvas>
          )}

          {/* 라벨 오버레이 */}
          {nodes.map((node) => (
            <div
              key={`label-${node.id}`}
              style={{
                position: 'absolute',
                left: node.x - node.radius,
                top: node.y - node.radius,
                width: node.radius * 2,
                height: node.radius * 2,
                zIndex: node.isMe ? 20 : 10,
                pointerEvents: 'auto',
              }}
              onClick={() => handleNodeClick(node)}
              className="cursor-pointer" 
            >
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center font-medium whitespace-nowrap pointer-events-none select-none"
                style={{
                  color: isDark ? '#FFF' : '#000',
                  fontWeight: node.isMe ? 'bold' : 'normal',
                  fontSize: node.isMe ? '20px' : node.radius > 60 ? '16px' : node.radius > 40 ? '14px' : '12px',
                  textShadow: isDark
                    ? '1px 1px 2px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.5)'
                    : '1px 1px 2px rgba(255,255,255,0.9), 0 0 4px rgba(255,255,255,0.6)',
                  zIndex: 10,
                }}
              >
                {node.name}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Relation;
