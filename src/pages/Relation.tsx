"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import { useNavigate } from "react-router-dom";
import VirtualizedRelationNode from "@/components/Blob/VirtualizedRelationNode";
import { useGetRelation } from "../api/queries/relation/useGetRelation";

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
  vx?: number;
  vy?: number;
}

const EmotionalGraph = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasScrolledToMe = useRef(false);
  
  const [nodes, setNodes] = useState<ProcessedNode[]>([]);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  
  const { data: relationData } = useGetRelation();
  const navigate = useNavigate();
  
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);

  // ✅ 노드 생성 및 위치 계산
  useEffect(() => {
    if (!relationData?.relations?.relations || !containerRef.current) return;
    
    const container = containerRef.current;
    const { width, height } = container.getBoundingClientRect();
    setContainerSize({ width, height });
    
    const centerX = (width ) / 2; // 전체 너비의 중앙
    const centerY = height / 2;
    
    const relationArray = relationData.relations.relations;
    const processedNodes: ProcessedNode[] = [];
    
    // "나" 노드 생성
    const meNode: ProcessedNode = {
      id: 0,
      name: "나",
      affection: 100,
      count: 0,
      highestEmotion: "",
      secondEmotion: "",
      vx:0,
      vy:0,
      x: centerX,
      y: centerY,
      radius: 100,
      isMe: true
    };
    processedNodes.push(meNode);
    console.log(processedNodes);
    
    // 관계 노드들 생성
    relationArray.forEach((relation: RelationNodeData, index: number) => {
      const angle = (index * 2 * Math.PI) / relationArray.length;
      const distance = 200 + Math.random() * 100; // 중심에서 거리
      
      const node: ProcessedNode = {
        ...relation,
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        radius: Math.max(30, Math.min(50, relation.affection / 2)), // affection 기반 크기
        isMe: false,
        vx: 0,
        vy: 0
      };
      processedNodes.push(node);
    });
    
    setNodes(processedNodes);
    
    // 초기 스크롤을 "나" 노드로 이동
    if (!hasScrolledToMe.current) {
      const targetX = centerX - width / 2;
      container.scrollLeft = targetX;
      hasScrolledToMe.current = true;
    }
    
  }, [relationData]);

  // ✅ 노드 클릭 핸들러
  const handleNodeClick = (node: ProcessedNode) => {
    if (node.isMe) {
      navigate('/analysis');
    } else {
      navigate(`/relation/${node.id}`);
    }
  };

  // ✅ 컨테이너 크기 조정
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      setContainerSize({ width, height });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        {/* ✅ 배경 연결선들 (선택적) */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width="100%"
          height="100%"
          style={{ zIndex: 1 }}
        >
          {nodes.length > 0 && (
            <>
              {nodes.slice(1).map((node, index) => {
                const meNode = nodes[0];
                return (
                  <line
                    key={`edge-${index}`}
                    x1={meNode.x}
                    y1={meNode.y}
                    x2={node.x}
                    y2={node.y}
                    stroke="#E5E7EB"
                    strokeWidth="1"
                    strokeOpacity="0.3"
                  />
                );
              })}
            </>
          )}
        </svg>

        {/* ✅ 블롭 노드들 */}
        {nodes.map((node) => (
          <VirtualizedRelationNode
            key={`node-${node.id}`}
            nodeData={node}
            x={node.x}
            y={node.y}
            radius={node.radius}
            isActive={true}
            isMe={node.isMe}
            onClick={() => handleNodeClick(node)}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default EmotionalGraph;
