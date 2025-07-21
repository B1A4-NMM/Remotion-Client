export interface Node {
  x: number;
  y: number;
  finalX: number;
  finalY: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  label: string;
  depth: number;
  mass: number;
  opacity: number;
  targetOpacity: number;
  startTime: number;
  fadeInDuration: number;
  isStatic?: boolean;
  colorA?: string; // optional, matches utils/animation.ts
  colorB?: string; // optional, matches utils/animation.ts
  baseRadius: number;
  bounceStart?: number;
  bounceDuration?: number;
  id?: number | string; // 추가
  diaryId?: number | string; // 필요하다면 추가
}

export interface AnimatedBranch {
  from: Node;
  toPos: { x: number; y: number };
  startTime: number;
  duration: number;
  finished: boolean;
  nodeData: {
    id: number | string;
    label: string;
    colorA: string;
    colorB: string;
    affection: number;
    emotion: string;
  };
  progress: number;
  opacity: number;
}

export interface Edge {
  from: Node;
  to: Node;
  restLength: number;
  opacity: number;
}

export interface NodeData {
  label: string;
  level: number;
  color: string;
}
