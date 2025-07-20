"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useRef, useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import { useNavigate } from "react-router-dom";

import type { Node, AnimatedBranch, Edge } from "@/types/emotionalGraph";
import { useGetRelation } from "../api/queries/relation/useGetRelation";

import { updatePhysics } from "@/utils/physics";
import {
  createRootNode,
  createAnimatedBranches,
  updateNodeOpacity,
  updateEdgeOpacity,
  updateNodeBounce,
  createNodeFromBranch,
} from "@/utils/animation";
import { drawEdges, drawAnimatedBranch, drawNodes } from "@/utils/drawing";

const EmotionalGraph = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // 캔버스 DOM 참조
  const containerRef = useRef<HTMLDivElement | null>(null); // 캔버스를 감싸는 div 참조
  const hasScrolledToMe = useRef(false); // "나" 노드로 한 번만 스크롤 이동 여부 체크

  const animationRef = useRef<number>(); // animation frame ID 저장
  const nodesRef = useRef<Node[]>([]); // 현재 모든 노드 정보 저장
  const edgesRef = useRef<Edge[]>([]); // 노드 간 간선 정보 저장
  const animatedBranchesRef = useRef<AnimatedBranch[]>([]); // 점진적으로 생성될 브랜치(노드)

  const startTimeRef = useRef<number>(0); // 전체 애니메이션 시작 시간
  const previousTimestampRef = useRef<number>(0); // 프레임 간 시간 차 계산용

  const { data: relationData } = useGetRelation(); // 관계 데이터 패칭

  const dpr = window.devicePixelRatio || 1; // 디바이스 픽셀 비율
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 }); // 캔버스 크기 상태

  const offsetX = useMotionValue(0); // 드래그에 따른 X 오프셋
  const offsetY = useMotionValue(0); // 드래그에 따른 Y 오프셋

  const navigate = useNavigate(); // 페이지 이동용

  const clickStartRef = useRef<{ x: number; y: number } | null>(null); // 클릭/드래그 구분용 좌표 저장

  // 🔹 드래그 시작 시 좌표 저장
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    clickStartRef.current = { x: e.clientX, y: e.clientY };
  };

  // 🔹 드래그 끝났을 때 클릭으로 판단되면 클릭 핸들러 실행
  const handleCanvasMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!clickStartRef.current) return;
    const dx = e.clientX - clickStartRef.current.x;
    const dy = e.clientY - clickStartRef.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 5) {
      handleCanvasClick(e);
    }
    clickStartRef.current = null;
  };

  // 🔹 캔버스 클릭 시, 해당 위치의 노드 확인 후 페이지 이동
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const cssX = e.clientX - rect.left;
    const cssY = e.clientY - rect.top;

    const offsetXValue = offsetX.get();
    const offsetYValue = offsetY.get();

    let clickedNode = null;

    for (const node of nodesRef.current) {
      const dx = cssX - node.x;
      const dy = cssY - node.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= node.radius) {
        clickedNode = node;
        break;
      }
    }

    // 클릭된 노드가 있으면 조건에 따라 라우팅
    if (clickedNode) {
      const id = clickedNode.diaryId || clickedNode.id;

      if (typeof id === "number" || (typeof id === "string" && !isNaN(Number(id)))) {
        navigate(`/relation/${id}`);
      } else if (clickedNode.label === "나") {
        navigate(`/analysis`);
      } else {
        console.warn("⚠️ 유효하지 않은 ID:", id);
        navigate(`/relation/1`);
      }
    }
  };

  // 🔹 캔버스 렌더링 및 애니메이션 로직
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const { width, height } = parent.getBoundingClientRect();

      canvas.width = width * dpr * 3 + 200;
      canvas.height = height * dpr;
      canvas.style.width = `${width * 3 + 200}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0); // 초기화
      ctx.scale(dpr, dpr); // 고해상도 대응
      setCanvasSize({ width, height });
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const { width, height } = canvas.parentElement?.getBoundingClientRect() || { width: 0, height: 0 };
    const centerX = width / 2;
    const centerY = height / 2;

    // 초기화
    nodesRef.current = [];
    edgesRef.current = [];
    animatedBranchesRef.current = [];

    // 루트 노드("나") 생성
    const rootNode = createRootNode(centerX, centerY);
    nodesRef.current.push(rootNode);

    // 브랜치(자식 노드)들 생성
    const relationArray = relationData?.relations?.relations;
    if (Array.isArray(relationArray)) {
      animatedBranchesRef.current = createAnimatedBranches(
        rootNode,
        centerX,
        centerY,
        relationArray
      );
    }

    // 메인 draw 루프 (requestAnimationFrame 기반)
    const draw = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
        previousTimestampRef.current = timestamp;
      }

      const dt = (timestamp - previousTimestampRef.current) / 16; // 물리 시뮬레이션용 시간 차이
      const elapsed = timestamp - startTimeRef.current;
      previousTimestampRef.current = timestamp;

      const { width, height } = canvasSize;
      ctx.clearRect(0, 0, width, height); // 캔버스 초기화

      const centerX = width / 2 - offsetX.get();
      const centerY = height / 2 - offsetY.get();

      // 첫 6초 동안만 물리 시뮬레이션 적용
      if (elapsed < 1000) {
        updatePhysics(nodesRef.current, edgesRef.current, dt);
      }

      // const centerX = width / 2 - offsetX.get();
      // const centerY = height / 2 - offsetY.get();

      // 루트 노드 페이드인
      updateNodeOpacity(nodesRef.current[0], elapsed);

      drawEdges(ctx, edgesRef.current);

      // 각 애니메이티드 브랜치 진행
      for (let i = animatedBranchesRef.current.length - 1; i >= 0; i--) {
        const branch = animatedBranchesRef.current[i];
        if (!branch.finished && elapsed >= branch.startTime) {
          const branchElapsed = elapsed - branch.startTime;
          branch.progress = Math.min(branchElapsed / branch.duration, 1);
          branch.opacity = Math.min(branchElapsed / (branch.duration * 0.3), 1);
          drawAnimatedBranch(ctx, branch);

          if (branch.progress === 1) {
            const newNode = createNodeFromBranch(branch, elapsed);
            nodesRef.current.push(newNode);
            edgesRef.current.push({
              from: branch.from,
              to: newNode,
              restLength: Math.hypot(newNode.x - branch.from.x, newNode.y - branch.from.y),
              opacity: branch.opacity,
            });
            branch.finished = true;
            animatedBranchesRef.current.splice(i, 1);
          }
        }
      }

      // [As-is] 마우스 중심 근처의 노드 확대 효과
      // [To-be] 노드 투명도, 간선 투명도 및 바운스 업데이트
      nodesRef.current.forEach(node => {
        if (node.label === "나") return;

        // const dx = node.x - centerX;
        // const dy = node.y - centerY;
        // const dist = Math.sqrt(dx * dx + dy * dy);
        // const activeRadius = 100;
        // const maxRadius = 50;
        // const minRadius = 30;

        // if (dist < activeRadius) {
        //   node.radius = Math.min(node.radius + 0.5, maxRadius);
        // } else {
        //   node.radius = Math.max(node.radius - 0.5, minRadius);
        // }

        const dx = node.x - centerX;
        const dy = node.y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const activeRadius = 100;

        if (
          dist < activeRadius &&
          (node.bounceStart === undefined || elapsed - node.bounceStart > (node.bounceDuration ?? 300))
        ) {
          node.bounceStart = elapsed;
        }

        updateNodeBounce(node, elapsed);
        updateNodeOpacity(node, elapsed);
        updateEdgeOpacity(edgesRef.current, node);
      });

      drawNodes(ctx, nodesRef.current);
      ctx.globalAlpha = 1;

      // 최초 진입 시 "나" 노드로 스크롤 이동
      if (!hasScrolledToMe.current) {
        const meNode = nodesRef.current.find(n => n.label === "나");
        const container = containerRef.current;
        if (meNode && container) {
          const targetX = meNode.x - container.clientWidth / 2;

          const smoothScrollTo = (element: HTMLElement, target: number, duration = 1500) => {
            const start = element.scrollLeft;
            const change = target - start;
            const startTime = performance.now();

            const easeInOutQuad = (t: number) =>
              t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

            const animateScroll = (currentTime: number) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const eased = easeInOutQuad(progress);
              element.scrollLeft = start + change * eased;
              if (progress < 1) {
                requestAnimationFrame(animateScroll);
              }
            };

            requestAnimationFrame(animateScroll);
          };

          smoothScrollTo(container, targetX, 1000);
          hasScrolledToMe.current = true;
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [canvasSize.width, canvasSize.height, relationData]);

  return (
    <div ref={containerRef} className="w-full h-screen overflow-hidden relative">
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.1}
        style={{ x: offsetX, y: offsetY }}
        className="w-[300%] h-full relative"
      >
        {/* 캔버스를 motion.div 안에 넣어야 드래그에 반응 */}
        <canvas
          ref={canvasRef}
          onMouseDown={handleCanvasMouseDown}
          onMouseUp={handleCanvasMouseUp}
          className="absolute top-0 left-0 w-full h-full z-10"
          style={{
            cursor: "pointer",
            borderRadius: 20,
            display: "block",
            pointerEvents: "auto",
          }}
        />
      </motion.div>
    </div>
  );
};

export default EmotionalGraph;
