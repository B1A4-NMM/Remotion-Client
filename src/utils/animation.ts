import { mapEmotionToColor, baseColors } from "@/constants/emotionColors";

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
  id?: number | string; // 추가
  diaryId?: number | string; // 필요하다면 추가
};

export type Edge = {
  from: Node;
  to: Node;
  restLength: number;
  opacity: number;
};

export type AnimatedBranch = {
  from: Node;
  toPos: { x: number; y: number };
  startTime: number;
  duration: number;
  finished: boolean;
  nodeData: {
    id: number | string; // 추가
    label: string;
    colorA: string;
    colorB: string;
    affection: number;
    emotion: string;
  };
  progress: number;
  opacity: number;
};

// 시드 기반 난수 생성 함수 (간단한 해시)
function seededRandom(seed: number | string) {
  let str = String(seed);
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
  }
  let x = Math.abs(hash) % 10000;
  return () => {
    // Linear congruential generator
    x = (x * 9301 + 49297) % 233280;
    return x / 233280;
  };
}

export const createAnimatedBranches = (
  rootNode: Node,
  centerX: number,
  centerY: number,
  relations: {
    id: number;
    name: string;
    affection: number;
    highestEmotion: string;
    secondEmotion: string | null;
    count: number;
  }[]
): AnimatedBranch[] => {
  return relations.map((rel, index) => {
    // 시드 기반 난수 생성기: id를 seed로 사용
    const rand = seededRandom(rel.id);
    // 각도에 약간의 시드 기반 랜덤 오프셋 추가
    const angle = index * ((Math.PI * 2) / relations.length) + (rand() - 0.5) * 0.4;

    // affection 값이 클수록 더 멀리
    const affection = Math.max(Math.min(rel.affection, 150), 0);
    const t = affection / 150; // 0 ~ 1
    const distance = 120 + t * 200; // 120 ~ 320

    const targetX = centerX + Math.cos(angle) * distance;
    const targetY = centerY + Math.sin(angle) * distance;

    // const emotionColorMap: Record<string, [string, string]> = {
    //   애정: ["#ffb5e8", "#ff9cee"], // 부드러운 핑크톤
    //   사랑: ["#ff7675", "#fd79a8"], // 따뜻한 사랑의 핑크-레드

    //   질투: ["#c0eb75", "#badc58"], // 연두빛 복잡함
    //   시기: ["#dff9fb", "#7ed6df"], // 차가운 비교
    //   분노: ["#ff6b6b", "#c44569"], // 강렬한 레드
    //   짜증: ["#fcd5ce", "#f8c8dc"], // 탁한 살구+핑크
    //   억울: ["#dfe6e9", "#b2bec3"], // 답답한 회색 계열
    //   상처: ["#a29bfe", "#6c5ce7"], // 차가운 퍼플 계열
    //   배신감: ["#636e72", "#2d3436"], // 어두운 회색
    //   경멸: ["#dcdde1", "#718093"], // 냉소적인 그레이-블루
    //   거부감: ["#ffcccc", "#fab1a0"], // 거절의 불쾌감
    //   불쾌: ["#c8d6e5", "#8395a7"], // 무채색에 가까운 탁함
    
    //   실망: ["#b2bec3", "#636e72"], // 회색빛 무기력
    //   속상: ["#dfe4ea", "#ced6e0"], // 탁한 블루-그레이

    //   감사: ["#ffeaa7", "#fab1a0"], // 따뜻하고 밝은 옐로우-살구
    //   존경: ["#f6e58d", "#f9ca24"], // 황금빛 존중
    //   신뢰: ["#81ecec", "#00cec9"], // 안정감 있는 민트
    //   친밀: ["#a0e7e5", "#b4f8c8"], // 밝고 부드러운 블루-민트
    //   유대: ["#74b9ff", "#a29bfe"], // 믿음 있는 보라-블루
    //   공감: ["#fab1a0", "#ffeaa7"], // 공감의 살구+옐로우
    // };
    // const [colorA, colorB] = emotionColorMap[rel.highestEmotion] ?? ["#ccc", "#999"];

    const colorKey = mapEmotionToColor(rel.highestEmotion);
    const color = baseColors[colorKey] ?? "#ccc";
    const colorA = color;
    const colorB = color;
    
    return {
      from: rootNode,
      toPos: { x: targetX, y: targetY },
      startTime: 400 + index * 300,
      duration: 1000 + rand() * 400, // duration도 시드 기반
      finished: false,
      nodeData: {
        id: rel.id, // 추가!
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
    id: branch.nodeData.id, // 추가!
    diaryId: branch.nodeData.id, // 필요하다면 같이 추가
  };
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
