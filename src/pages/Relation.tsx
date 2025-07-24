"use client";

// components/Relation.tsx
import React, { useRef, useEffect, useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import StaticBlob from "@/components/Blob/StaticBlob";
import { mapEmotionToColor, ColorKey } from "@/constants/emotionColors";
import { useGetRelation } from "../api/queries/relation/useGetRelation";
import { useTheme } from "@/components/theme-provider";
import { useGetAuthTest } from "@/api/queries/auth/useGetAuthTest";

interface RelationEmotion {
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
  emotions?: { emotion: string; intensity: number }[];
}

interface ProcessedNode extends RelationNodeData {
  x: number;
  y: number;
  radius: number;
  isMe: boolean;
  processedEmotions: RelationEmotion[];
  scale: number;
}

const Relation = () => {
  const { data: authData, isLoading, error } = useGetAuthTest();
  const apiUser = authData?.user;
  const nickname = apiUser?.nickname || "나";

  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasScrolledToMe = useRef(false);

  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const [nodes, setNodes] = useState<ProcessedNode[]>([]);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const { data: relationData } = useGetRelation();
  const navigate = useNavigate();

  // 감정 처리 함수
  const processRelationEmotions = (data: RelationNodeData): RelationEmotion[] => {
    const emotions: RelationEmotion[] = [];

    if (data.emotions && data.emotions.length > 0) {
      const primaryEmotion = data.emotions[0];
      const primaryColor = mapEmotionToColor(primaryEmotion.emotion);
      emotions.push({
        color: primaryColor,
        intensity: Math.min(primaryEmotion.intensity / 100, 1) || 0.7,
      });
    }

    if (data.emotions && data.emotions.length > 1) {
      const secondaryEmotion = data.emotions[1];
      const secondaryColor = mapEmotionToColor(secondaryEmotion.emotion);
      emotions.push({
        color: secondaryColor,
        intensity: 0.3,
      });
    }

    if (emotions.length === 0) {
      emotions.push({ color: "gray", intensity: 1 });
    }

    return emotions;
  };

  const isMobile = useMemo(() => {
    return (
      window.innerWidth <= 768 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );
  }, []);

  const mobileSettings = useMemo(() => {
    if (!isMobile) {
      return {
        dpr: Math.min(window.devicePixelRatio, 2),
        antialias: true,
        powerPreference: "high-performance" as const,
      };
    }

    // 모바일 기기별 최적화
    const dpr = window.devicePixelRatio;
    return {
      dpr: dpr >= 3 ? 2 : Math.min(dpr, 1.5), // ✅ 적절한 DPR 사용
      antialias: true, // ✅ 안티알리어싱 활성화
      powerPreference: "default" as const,
    };
  }, [isMobile]);

  // 노드 생성
  useEffect(() => {
    if (!relationData?.relations?.relations || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    const expandedWidth = rect.width * 1.3;
    const expandedHeight = rect.height * 1.3;

    setContainerSize({
      width: expandedWidth,
      height: expandedHeight,
    });

    const canvasW = expandedWidth * 2;
    const canvasH = expandedHeight * 2;
    const centerX = canvasW / 2;
    const centerY = canvasH / 2;

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
      processedEmotions: [{ color: "gray", intensity: 1 }],
      scale: 25, // ✅ 크기 조정 (30 → 15)
    };
    processedNodes.push(meNode);

    // ✅ 관계 노드들 - 확장된 공간에 맞게 배치
    relationArray.forEach((relation: RelationNodeData, index: number) => {
      const angle = (index * 2 * Math.PI) / relationArray.length;
      const baseDistance = 200;
      const affectionBonus = (relation.affection / 100) * 100;
      const distance = baseDistance + affectionBonus;

      const baseRadius = 10;
      const affectionRadius = (relation.affection / 100) * 15;
      const radius = Math.max(25, Math.min(50, baseRadius + affectionRadius));
      const scale = Math.max(8, Math.min(20, radius / 2.5)); // radius 25-50 → scale 8-20

      const node: ProcessedNode = {
        ...relation,
        x: centerX + Math.cos(angle) * distance, // 정중앙 기준
        y: centerY + Math.sin(angle) * distance, // 정중앙 기준
        radius: radius,
        isMe: false,
        processedEmotions: processRelationEmotions(relation),
        scale: scale,
      };
      processedNodes.push(node);
    });

    setNodes(processedNodes);

    // ✅ 초기 스크롤 위치 - 확장된 공간의 중심으로
    if (!hasScrolledToMe.current) {
      const meNodeX = centerX;
      const meNodeY = centerY;

      // ✅ 실제 컨테이너 크기(화면에 보이는 크기) 기준으로 중앙 계산
      const actualContainerWidth = rect.width;
      const actualContainerHeight = rect.height;

      // ✅ 플랫폼별 중앙 위치 조정
      let desiredScreenX, desiredScreenY;

      if (isMobile) {
        desiredScreenX = actualContainerWidth / 2;
        desiredScreenY = actualContainerHeight / 2;
      } else {
        desiredScreenX = actualContainerWidth / 2;
        desiredScreenY = actualContainerHeight / 2;
      }

      // ✅ 정확한 스크롤 위치 계산
      const targetX = meNodeX - desiredScreenX;
      const targetY = meNodeY - desiredScreenY * 0.8;

      // ✅ 스크롤 범위 제한 (음수 방지)
      const finalX = Math.max(0, targetX);
      const finalY = Math.max(0, targetY);

      // ✅ requestAnimationFrame으로 확실한 적용
      requestAnimationFrame(() => {
        container.scrollTo({
          left: finalX,
          top: finalY,
          behavior: "instant",
        });
      });

      hasScrolledToMe.current = true;
    }
  }, [relationData, nickname]);

  const handleNodeClick = (node: ProcessedNode) => {
    if (node.isMe) {
      navigate("/analysis");
    } else {
      navigate(`/relation/${node.id}`);
    }
  };

  // ✅ containerSize가 유효할 때만 Canvas 렌더링
  const canvasWidth = containerSize.width * 2;
  const canvasHeight = containerSize.height * 2;

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
            minWidth: "150vw", // 충분한 드래그 공간
            minHeight: "150vh",
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
            {nodes.length > 0 &&
              nodes.slice(1).map((node, index) => {
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
                position: [0, 0, 250],
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
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: "none",
                zIndex: 2,
              }}
              gl={{
                antialias: mobileSettings.antialias, // ✅ 안티알리어싱 활성화
                alpha: true,
                powerPreference: mobileSettings.powerPreference,
                preserveDrawingBuffer: true,
                // ✅ 모바일 추가 최적화
                ...(isMobile && {
                  precision: "mediump", // 중간 정밀도로 성능 향상
                  stencil: false, // 스텐실 버퍼 비활성화
                }),
              }}
              dpr={mobileSettings.dpr} // ✅ 최적화된 DPR
            >
              <ambientLight intensity={0.6} />
              <pointLight position={[0, 0, 500]} intensity={0.4} />

              {/* ✅ 1:1 좌표 매핑 */}
              {nodes.map(node => (
                <group
                  key={node.id}
                  position={[
                    node.x - canvasWidth / 2, // ✅ Canvas 중심 기준으로 변환
                    canvasHeight / 2 - node.y, // ✅ Y축 뒤집기 (정확한 매핑)
                    0,
                  ]}
                >
                  <StaticBlob
                    emotions={node.processedEmotions}
                    scale={node.scale * 2.8} // ✅ 적절한 크기로 조정
                  />
                </group>
              ))}
            </Canvas>
          )}

          {/* 라벨 오버레이 */}
          {nodes.map(node => (
            <div
              key={`label-${node.id}`}
              style={{
                position: "absolute",
                left: node.x - node.radius,
                top: node.y - node.radius,
                width: node.radius * 2,
                height: node.radius * 2,
                zIndex: node.isMe ? 20 : 10,
                pointerEvents: "auto",
              }}
              onClick={() => handleNodeClick(node)}
              className="cursor-pointer"
            >
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center font-medium whitespace-nowrap pointer-events-none select-none"
                style={{
                  color: isDark ? "#FFF" : "#000",
                  fontWeight: node.isMe ? "bold" : "normal",
                  fontSize: node.isMe
                    ? "20px"
                    : node.radius > 60
                      ? "16px"
                      : node.radius > 40
                        ? "14px"
                        : "12px",
                  textShadow: isDark
                    ? "1px 1px 2px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.5)"
                    : "1px 1px 2px rgba(255,255,255,0.9), 0 0 4px rgba(255,255,255,0.6)",
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
