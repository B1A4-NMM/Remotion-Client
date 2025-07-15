"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useGetRelation } from "../api/queries/relation/useGetRelation";
import { baseColors, mapEmotionToColor } from "@/constants/emotionColors";


interface RelationNode {
  id: number;
  name: string;
  affection: number;
  highestEmotion: string;
  secondEmotion: string;
  count: number;
}

interface RelationData {
  todayMyEmotions: Array<{
    emotion: string;
    intensity: number;
  }>;
  relations: {
    relations: RelationNode[];
  };
}

const EmotionalMindMap = () => {
  const navigate = useNavigate();
  const { data: relationData, isLoading } = useGetRelation();
  const [animationStep, setAnimationStep] = useState(0);

  // 애니메이션 단계별 실행
  useEffect(() => {
    if (!relationData) return;

    const steps = [
      500,  // 중앙 노드 등장
      1000, // 브랜치 라인 등장
      1500, // 관계 노드들 등장
    ];

    steps.forEach((delay, index) => {
      setTimeout(() => {
        setAnimationStep(index + 1);
      }, delay);
    });
  }, [relationData]);

  // 노드 클릭 핸들러
  const handleNodeClick = (id: number) => {
    navigate(`/relation/${id}`);
  };

  // affection에 따른 거리 계산 (높을수록 가까워짐)
  const getDistanceByAffection = (affection: number) => {
    const minDistance = 120;
    const maxDistance = 300;
    const normalizedAffection = Math.max(0, Math.min(100, affection));
    return maxDistance - (normalizedAffection / 100) * (maxDistance - minDistance);
  };

  // count에 따른 노드 크기 계산
  const getNodeSize = (count: number) => {
    const minSize = 60;
    const maxSize = 120;
    const normalizedCount = Math.max(1, count);
    const size = Math.min(maxSize, minSize + (normalizedCount - 1) * 8);
    return size;
  };

  // 원형 배치 좌표 계산 (affection 기반 거리 적용)
  const getNodePosition = (index: number, total: number, affection: number) => {
    const angle = (index * 360) / total;
    const radius = getDistanceByAffection(affection);
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;
    return { x, y, angle, radius };
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white text-xl">관계 데이터를 불러오는 중...</div>
      </div>
    );
  }

  if (!relationData?.relations?.relations) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white text-xl">관계 데이터가 없습니다.</div>
      </div>
    );
  }

  const relations = relationData.relations.relations;

  return (
    <div className="w-full h-screen overflow-hidden">
      {/* 드래그 가능한 전체 컨테이너 */}
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.1}
        dragConstraints={{
          top: -500,
          bottom: 500,
          left: -500,
          right: 500,
        }}
        className="relative w-full h-full cursor-grab active:cursor-grabbing"
        style={{
          width: "200%",
          height: "200%",
          transform: "translate(-25%, -25%)",
        }}
      >
        {/* 중앙 노드 - "나" */}
        <AnimatePresence>
          {animationStep >= 1 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
                <span className="text-black text-xl font-bold">나</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 브랜치 라인들 */}
        <AnimatePresence>
          {animationStep >= 2 && relations.map((relation, index) => {
            const { x, y } = getNodePosition(index, relations.length, relation.affection);
            
            return (
              <motion.div
                key={`line-${relation.id}`}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              >
                <svg
                  width="800"
                  height="800"
                  className="absolute -top-96 -left-96"
                >
                  {/* <motion.line
                    x1="400"
                    y1="400"
                    x2={400 + x}
                    y2={400 + y}
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  /> */}
                </svg>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* 관계 노드들 */}
        <AnimatePresence>
          {animationStep >= 3 && relations.map((relation, index) => {
            const { x, y } = getNodePosition(index, relations.length, relation.affection);
            const emotionColor = mapEmotionToColor(relation.highestEmotion);
            const nodeSize = getNodeSize(relation.count);
            
            return (
              <motion.div
                key={relation.id}
                initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1, 
                  x: x, 
                  y: y 
                }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.1,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer pointer-events-auto"
                onClick={() => handleNodeClick(relation.id)}
              >
                <div 
                  className="rounded-full flex flex-col items-center justify-center shadow-lg relative"
                  style={{ 
                    backgroundColor: emotionColor,
                    width: `${nodeSize}px`,
                    height: `${nodeSize}px`,
                  }}
                >
                  <span className="text-black font-bold text-center leading-tight" style={{
                    fontSize: `${Math.max(12, nodeSize / 6)}px`
                  }}>
                    {relation.name}
                  </span>
                </div>
                
                {/* 호버 시 추가 정보 */}
                <motion.div
                  className="absolute left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap pointer-events-none"
                  style={{ top: `${-nodeSize/2 - 40}px` }}
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                >
                  <div>{relation.highestEmotion}</div>
                  <div className="text-xs opacity-70">애정도: {relation.affection}</div>
                  <div className="text-xs opacity-70">상호작용: {relation.count}회</div>
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

    </div>
  );
};

export default EmotionalMindMap;
