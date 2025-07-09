import type { Node, Edge, AnimatedBranch } from "../types/emotionalGraph";
import { EMOTION_COLORS } from "@/constants/emotionalGraph.ts";

export const drawEdges = (ctx: CanvasRenderingContext2D, edges: Edge[]) => {
  ctx.save(); // 기존 상태 저장
  ctx.strokeStyle = "rgba(200, 200, 200, 0.3)"; // 옅은 회색으로 통일
  ctx.lineWidth = 1.5;

  edges.forEach(edge => {
    const alpha = Math.min(edge.opacity, edge.from.opacity, edge.to.opacity);
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.moveTo(edge.from.x, edge.from.y);
    ctx.lineTo(edge.to.x, edge.to.y);
    ctx.stroke();
  });

  ctx.restore(); // 이후 그리기를 위해 상태 복구
};

export const drawAnimatedBranch = (ctx: CanvasRenderingContext2D, branch: AnimatedBranch) => {
  const eased = 1 - Math.pow(1 - branch.progress, 2.5);

  const fromX = branch.from.x;
  const fromY = branch.from.y;
  const currentX = fromX + (branch.toPos.x - fromX) * eased;
  const currentY = fromY + (branch.toPos.y - fromY) * eased;

  ctx.globalAlpha = branch.opacity * 0.8;
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(currentX, currentY);
  ctx.strokeStyle = "rgba(200, 200, 200, 0.3)";

  ctx.lineWidth = 2;
  ctx.stroke();
};

export const drawNodes = (ctx: CanvasRenderingContext2D, nodes: Node[]) => {
  nodes.forEach(node => {
    ctx.globalAlpha = node.opacity;
    if (!isFinite(node.x) || !isFinite(node.y) || !isFinite(node.radius)) {
      console.warn("❌ NaN 노드 발견", node);
      return;
    }

    if (node.label === "나") {
      // 중심 노드: 단색 흰색
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    } else {
      // 감정 노드: colorA, colorB 없으면 랜덤으로 할당
      let colorA = node.colorA;
      let colorB = node.colorB;

      if (!colorA || !colorB) {
        const [a, b] = EMOTION_COLORS[Math.floor(Math.random() * EMOTION_COLORS.length)];
        colorA = a;
        colorB = b;
        // 한번 정해진 색은 유지되게 객체에 저장
        node.colorA = colorA;
        node.colorB = colorB;
      }

      const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius);
      gradient.addColorStop(0, colorA);
      gradient.addColorStop(1, colorB);

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // 텍스트 라벨
    ctx.fillStyle = "#000";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node.label, node.x, node.y);
  });
};
