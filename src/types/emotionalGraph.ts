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
  colorA: string;
  colorB: string;
}

export interface AnimatedBranch {
  from: Node;
  toPos: { x: number; y: number };
  startTime: number;
  duration: number;
  finished: boolean;
  nodeData: { label: string; color: string; level: number };
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
