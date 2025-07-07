"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import type { Node, AnimatedBranch, Edge } from "@/types/emotionalGraph";
import { updatePhysics } from "@/utils/physics";
import {
  createRootNode,
  createAnimatedBranches,
  updateNodeOpacity,
  updateEdgeOpacity,
  createNodeFromBranch,
} from "@/utils/animation";
import { drawEdges, drawAnimatedBranch, drawNodes } from "@/utils/drawing";
import { EMOTION_COLORS } from "@/constants/emotionalGraph.ts";

const EmotionalGraph = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number>();
  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  const animatedBranchesRef = useRef<AnimatedBranch[]>([]);
  const startTimeRef = useRef<number>(0);
  const previousTimestampRef = useRef<number>(0);

  const dpr = window.devicePixelRatio || 1;
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // 드래그 위치 상태
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const { width, height } = parent.getBoundingClientRect();

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
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
    animatedBranchesRef.current = createAnimatedBranches(rootNode, centerX, centerY);

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

        // 중심점과 가까우면 커지기
        const dx = node.x - centerX;
        const dy = node.y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const activeRadius = 100; // 중심 인식 범위
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

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [canvasSize.width, canvasSize.height]);

  return (
    <div className="w-full h-screen overflow-hidden bg-black relative">
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.1}
        style={{ x: offsetX, y: offsetY }}
        className="absolute top-0 left-0 w-full h-full cursor-grab active:cursor-grabbing"
      >
        <canvas
          ref={canvasRef}
          style={{
            width: "00%",
            height: "100%",
            borderRadius: 20,
            boxShadow: "0 0 30px rgba(255, 255, 255, 0.1)",
            display: "block",
          }}
        />
      </motion.div>
    </div>
  );
};

export default EmotionalGraph;
