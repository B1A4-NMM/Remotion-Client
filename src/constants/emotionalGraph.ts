import type { NodeData } from "../types/emotionalGraph";

export const NODES_DATA: NodeData[] = [
  { label: "가족", level: 1, color: "#FF6B6B" },
  { label: "친구", level: 2, color: "#6BCB77" },
  { label: "연인", level: 1.5, color: "#4D96FF" },
  { label: "동료", level: 2.2, color: "#FFD93D" },
  { label: "과거친구", level: 3, color: "#9D4EDD" },
];

export const PHYSICS_CONSTANTS = {
  repulsionConstant: 2000,
  springConstant: 0.06,
  gravityConstant: 0.004,
  damping: 0.9,
  minNodeDistance: 35,
} as const;

export const CANVAS_CONFIG = {
  padding: 20, // 여백 설정 등
};
export const EMOTION_COLORS = [
  ["#FFF5B7", "#B2F2BB"],
  ["#FFCCE5", "#AEDFF7"],
  ["#FFC9DE", "#A0D2EB"],
  ["#FFDEB4", "#C6F8D5"],
  ["#FEC7B4", "#B1E5F2"],
];
