"use client";
import { useQuery } from "@tanstack/react-query";

import React, { useRef, useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import type { Node, AnimatedBranch, Edge } from "@/types/emotionalGraph";
import { useGetRelation } from "../api/queries/relation/useGetRelation";
import { useNavigate } from "react-router-dom";

import { updatePhysics } from "@/utils/physics";
import {
  createRootNode,
  createAnimatedBranches,
  updateNodeOpacity,
  updateEdgeOpacity,
  createNodeFromBranch,
} from "@/utils/animation";
import { drawEdges, drawAnimatedBranch, drawNodes } from "@/utils/drawing";

const EmotionalGraph = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasScrolledToMe = useRef(false);

  const animationRef = useRef<number>();
  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  const animatedBranchesRef = useRef<AnimatedBranch[]>([]);
  const startTimeRef = useRef<number>(0);
  const previousTimestampRef = useRef<number>(0);
  const { data: relationData } = useGetRelation();

  // 데이터 구조 확인을 위한 로그 추가
  useEffect(() => {
    if (relationData) {
      console.log("📊 Relation API 데이터:", relationData);
      console.log("📋 relations 배열:", relationData?.relations?.relations);
    }
  }, [relationData]);

  const dpr = window.devicePixelRatio || 1;
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const navigate = useNavigate();

  // 클릭/드래그 구분용 ref
  const clickStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    clickStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleCanvasMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!clickStartRef.current) return;
    const dx = e.clientX - clickStartRef.current.x;
    const dy = e.clientY - clickStartRef.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    // 5px 이하 이동이면 클릭으로 간주
    if (distance < 5) {
      handleCanvasClick(e);
    }
    clickStartRef.current = null;
  };

  // 캔버스 클릭 핸들러: 노드 클릭 시 /relation/{id}로 이동
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.warn("❌ canvasRef가 없음");
      return;
    }

    const rect = canvas.getBoundingClientRect();
    // 클릭 좌표 (CSS 기준)
    const cssX = e.clientX - rect.left;
    const cssY = e.clientY - rect.top;

    console.log("🖱 클릭 좌표 (CSS):", { x: cssX, y: cssY });
    console.log("📐 canvas rect:", rect);

    const offsetXValue = offsetX.get();
    const offsetYValue = offsetY.get();
    console.log("📦 motion 오프셋 값:", { offsetXValue, offsetYValue });

    if (!nodesRef.current || nodesRef.current.length === 0) {
      console.warn("❌ nodesRef가 비어 있음");
      return;
    }

    let clickedNode = null;

    for (const node of nodesRef.current) {
      // 노드는 draw() 함수에서 offsetX/Y를 적용해서 그려짐
      // draw 함수에서: centerX = width/2 - offsetX.get(), centerY = height/2 - offsetY.get()
      // 따라서 클릭 좌표도 같은 방식으로 계산해야 함

      const { width, height } = canvasSize;
      const drawCenterX = width / 2 - offsetXValue;
      const drawCenterY = height / 2 - offsetYValue;

      // 실제 화면에서 노드가 그려지는 위치
      const nodeScreenX = node.x;
      const nodeScreenY = node.y;

      // 클릭 좌표를 노드 좌표계로 변환
      const adjustedClickX = cssX;
      const adjustedClickY = cssY;

      const dx = adjustedClickX - nodeScreenX;
      const dy = adjustedClickY - nodeScreenY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      console.log(`📏 노드 ${node.label}:`, {
        캔버스크기: { width, height },
        그리기중심: { x: drawCenterX, y: drawCenterY },
        노드위치: { x: nodeScreenX, y: nodeScreenY },
        클릭위치: { x: adjustedClickX, y: adjustedClickY },
        motion오프셋: { x: offsetXValue, y: offsetYValue },
        거리: distance,
        반지름: node.radius,
        선택됨: distance <= node.radius,
      });

      if (distance <= node.radius) {
        clickedNode = node;
        break;
      }
    }

    if (clickedNode) {
      const id = clickedNode.diaryId || clickedNode.id;
      console.log("🟢 클릭된 노드:", {
        id,
        label: clickedNode.label,
        diaryId: clickedNode.diaryId,
        nodeId: clickedNode.id,
        fullNode: clickedNode,
      });

      // ID 타입과 값 상세 확인
      console.log("🔍 ID 상세 정보:", {
        id: id,
        type: typeof id,
        isNumber: typeof id === "number",
        isString: typeof id === "string",
        length: typeof id === "string" ? id.length : "N/A",
        isNaN: typeof id === "string" ? isNaN(Number(id)) : "N/A",
      });

      // 숫자 ID인지 확인하고 전달
      if (typeof id === "number" || (typeof id === "string" && !isNaN(Number(id)))) {
        console.log("✅ 유효한 ID로 네비게이션:", id);
        navigate(`/relation/${id}`);
      } else {
        console.warn("⚠️ 유효하지 않은 ID:", id);
        // 기본값 사용
        navigate(`/relation/1`);
      }
    } else {
      console.log("⚪️ 노드와 일치하는 클릭 없음");
    }
  };

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

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      setCanvasSize({ width, height });
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const parent = canvas.parentElement;
    if (!parent) return;
    const { width, height } = parent.getBoundingClientRect();
    const centerX = width / 2;
    const centerY = height / 2;

    nodesRef.current = [];
    edgesRef.current = [];
    animatedBranchesRef.current = [];

    const rootNode = createRootNode(centerX, centerY);
    nodesRef.current.push(rootNode);

    // ✅ 수정: relationData를 기반으로 branches 생성
    const relationArray = relationData?.relations?.relations;
    if (Array.isArray(relationArray)) {
      animatedBranchesRef.current = createAnimatedBranches(
        rootNode,
        centerX,
        centerY,
        relationArray
      );
    }

    const draw = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
        previousTimestampRef.current = timestamp;
      }

      const dt = (timestamp - previousTimestampRef.current) / 16;
      const elapsed = timestamp - startTimeRef.current;
      previousTimestampRef.current = timestamp;

      const { width, height } = canvasSize;
      ctx.clearRect(0, 0, width, height);

      if (elapsed < 6000) {
        updatePhysics(nodesRef.current, edgesRef.current, dt);
      }

      const centerX = width / 2 - offsetX.get();
      const centerY = height / 2 - offsetY.get();

      const rootNode = nodesRef.current[0];
      if (rootNode) updateNodeOpacity(rootNode, elapsed);

      drawEdges(ctx, edgesRef.current);

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

      nodesRef.current.forEach(node => {
        if (node.label === "나") return;

        const dx = node.x - centerX;
        const dy = node.y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const activeRadius = 100;
        const maxRadius = 50;
        const minRadius = 30;

        if (dist < activeRadius) {
          node.radius = Math.min(node.radius + 0.5, maxRadius);
        } else {
          node.radius = Math.max(node.radius - 0.5, minRadius);
        }

        updateNodeOpacity(node, elapsed);
        updateEdgeOpacity(edgesRef.current, node);
      });

      drawNodes(ctx, nodesRef.current);
      ctx.globalAlpha = 1;

      const smoothScrollTo = (element: HTMLElement, target: number, duration = 1500) => {
        const start = element.scrollLeft;
        const change = target - start;
        const startTime = performance.now();

        const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

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

      if (!hasScrolledToMe.current) {
        const meNode = nodesRef.current.find(n => n.label === "나");
        const container = containerRef.current;
        if (meNode && container) {
          const targetX = meNode.x - container.clientWidth / 2;
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
        onClick={() => console.log("✅ Clicked!")}
        dragMomentum={false}
        dragElastic={0.1}
        style={{ x: offsetX, y: offsetY }}
        className="w-[300%] h-full relative"
      >
        {/* canvas는 motion.div 내부에 있어야 같이 움직임 */}
        <canvas
          ref={canvasRef}
          onMouseDown={handleCanvasMouseDown}
          onMouseUp={handleCanvasMouseUp}
          className="absolute top-0 left-0 w-full h-full z-10"
          style={{
            cursor: "pointer",
            borderRadius: 20,
            display: "block",
            pointerEvents: "auto", // 💡 아주 중요: 이벤트 통과 허용
          }}
        />
      </motion.div>
    </div>
  );
};

export default EmotionalGraph;
