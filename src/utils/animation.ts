export type Node = {
  x: number;
  y: number;
  finalX: number;
  finalY: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  colorA?: string;
  colorB?: string;
  label: string;
  depth: number;
  mass: number;
  opacity: number;
  targetOpacity: number;
  startTime: number;
  fadeInDuration: number;
  isStatic?: boolean;
};
export type Edge = {
  from: Node; // 출발 노드
  to: Node; // 도착 노드
  restLength: number; // 스프링 기본 길이 (physics에서 사용)
  opacity: number; // 투명도 (0~1), 애니메이션용
};
export type AnimatedBranch = {
  from: Node;
  toPos: { x: number; y: number };
  startTime: number;
  duration: number;
  finished: boolean;
  nodeData: {
    label: string;
    colorA: string;
    colorB: string;
    affection: number;
    emotion: string;
  };
  progress: number;
  opacity: number;
};
export const createAnimatedBranches = (
  rootNode: Node,
  centerX: number,
  centerY: number,
  relations: {
    name: string;
    affection: number;
    highestEmotion: string;
    secondEmotion: string | null;
    count: number;
  }[]
): AnimatedBranch[] => {
  return relations.map((rel, index) => {
    const angle = index * ((Math.PI * 2) / relations.length) + (Math.random() - 0.5) * 0.4;

    // affection이 높을수록 가까운 거리
    const affection = Math.max(Math.min(rel.affection, 10), -10);
    const t = (10 - affection) / 20;
    const distance = 120 + t * 200;

    const targetX = centerX + Math.cos(angle) * distance;
    const targetY = centerY + Math.sin(angle) * distance;

    // 감정 기반 색상 (기본값도 설정)
    const emotionColorMap: Record<string, [string, string]> = {
      친밀: ["#a0e7e5", "#b4f8c8"],
      애정: ["#ffb5e8", "#ff9cee"],
      짜증: ["#fcd5ce", "#f8c8dc"],
      분노: ["#ff8787", "#ff4d4d"],
      슬픔: ["#a5a5f8", "#7b7bf8"],
      감사: ["#ffeaa7", "#fab1a0"],
      무난: ["#dfe6e9", "#b2bec3"],
      실망: ["#b2bec3", "#636e72"],
      신뢰: ["#81ecec", "#00cec9"],
      경멸: ["#dfe6e9", "#636e72"],
      존경: ["#ffeaa7", "#fdcb6e"],
    };
    const [colorA, colorB] = emotionColorMap[rel.highestEmotion] ?? ["#ccc", "#999"];

    return {
      from: rootNode,
      toPos: { x: targetX, y: targetY },
      startTime: 400 + index * 300,
      duration: 1000 + Math.random() * 400,
      finished: false,
      nodeData: {
        label: rel.name,
        colorA,
        colorB,
        affection: rel.affection,
        emotion: rel.highestEmotion,
      },
      progress: 0,
      opacity: 0,
    };
  });
};

export const createNodeFromBranch = (branch: AnimatedBranch, now: number): Node => {
  return {
    x: branch.toPos.x,
    y: branch.toPos.y,
    finalX: branch.toPos.x,
    finalY: branch.toPos.y,
    vx: 0,
    vy: 0,
    radius: 16,
    color: branch.nodeData.colorA,
    colorA: branch.nodeData.colorA,
    colorB: branch.nodeData.colorB,
    label: branch.nodeData.label,
    depth: 1,
    mass: 1,
    opacity: 0,
    targetOpacity: 1,
    startTime: now,
    fadeInDuration: 700,
    isStatic: true,
  };
};
export const createRootNode = (centerX: number, centerY: number): Node => {
  return {
    x: centerX + (Math.random() - 0.5) * 200, // 약간의 랜덤 위치
    y: centerY + (Math.random() - 0.5) * 200,
    finalX: centerX,
    finalY: centerY,
    vx: 0,
    vy: 0,
    radius: 40,
    color: "#ffffff",
    colorA: "#ffffff",
    colorB: "#ffffff",
    label: "나",
    depth: 0,
    mass: 1.5,
    opacity: 0,
    targetOpacity: 1,
    startTime: 0,
    fadeInDuration: 800,
    isStatic: false,
  };
};
export const updateEdgeOpacity = (edges: Edge[], node: Node) => {
  edges.forEach(edge => {
    if (edge.to === node) {
      edge.opacity = Math.min(edge.opacity + 0.02, node.opacity);
    }
  });
};
export const updateNodeOpacity = (node: Node, elapsed: number) => {
  if (elapsed >= node.startTime && node.opacity < node.targetOpacity) {
    const fadeProgress = Math.min((elapsed - node.startTime) / node.fadeInDuration, 1);
    node.opacity = fadeProgress * node.targetOpacity;
  }
};
