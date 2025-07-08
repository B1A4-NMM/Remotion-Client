import type { Node, AnimatedBranch, Edge } from "@/types/emotionalGraph";
import { NODES_DATA } from "@/constants/emotionalGraph";
const emotionDistanceMap: Record<string, number> = {
  가족: 210,
  친구: 180,
  연인: 200,
  직장: 160,
  기타: 140,
};
export const createRootNode = (centerX: number, centerY: number): Node => {
  return {
    x: centerX + (Math.random() - 0.5) * 200,
    y: centerY + (Math.random() - 0.5) * 200,
    finalX: centerX,
    finalY: centerY,
    vx: 0,
    vy: 0,
    radius: 40,
    color: "#ffffff",
    label: "나",
    depth: 0,
    mass: 1.5,
    opacity: 0,
    targetOpacity: 1,
    startTime: 0,
    fadeInDuration: 800,
  };
};
export const createAnimatedBranches = (
  rootNode: Node,
  centerX: number,
  centerY: number
): AnimatedBranch[] => {
  const emotionDistanceMap: Record<string, number> = {
    가족: 300,
    친구: 180,
    연인: 200,
    직장: 160,
    기타: 140,
  };

  return NODES_DATA.map((nodeData, index) => {
    const angle = index * ((Math.PI * 2) / NODES_DATA.length) + (Math.random() - 0.5) * 0.4;

    // 감정 레이블에 따라 거리 설정
    const distance = emotionDistanceMap[nodeData.label] ?? 140;

    const targetX = centerX + Math.cos(angle) * distance;
    const targetY = centerY + Math.sin(angle) * distance;

    return {
      from: rootNode,
      toPos: { x: targetX, y: targetY },
      startTime: 400 + index * 300,
      duration: 1000 + Math.random() * 400,
      finished: false,
      nodeData,
      progress: 0,
      opacity: 0,
    };
  });
};

export const updateNodeOpacity = (node: Node, elapsed: number) => {
  if (elapsed >= node.startTime && node.opacity < node.targetOpacity) {
    const fadeProgress = Math.min((elapsed - node.startTime) / node.fadeInDuration, 1);
    node.opacity = fadeProgress * node.targetOpacity;
  }
};

export const updateEdgeOpacity = (edges: Edge[], node: Node) => {
  edges.forEach(edge => {
    if (edge.to === node) {
      edge.opacity = Math.min(edge.opacity + 0.02, node.opacity);
    }
  });
};

export function createNodeFromBranch(branch: AnimatedBranch, now: number): Node {
  return {
    x: branch.toPos.x, // 바로 목적지로
    y: branch.toPos.y,
    finalX: branch.toPos.x,
    finalY: branch.toPos.y,
    vx: 0, // 속도 0
    vy: 0,
    radius: 16,
    color: branch.nodeData.color,
    label: branch.nodeData.label,
    depth: 1,
    mass: 1,
    opacity: 0,
    targetOpacity: 1,
    startTime: now,
    fadeInDuration: 700,
    isStatic: true,
  };
}
