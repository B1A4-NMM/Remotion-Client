import type { Node, Edge } from "@/types/emotionalGraph";
import { PHYSICS_CONSTANTS } from "@/constants/emotionalGraph";

export const updatePhysics = (nodes: Node[], edges: Edge[], dt: number) => {
  const { repulsionConstant, springConstant, gravityConstant, damping, minNodeDistance } =
    PHYSICS_CONSTANTS;
  const forces = nodes.map(() => ({ x: 0, y: 0 }));

  // Repulsive forces between nodes
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let dx = nodes[i].x - nodes[j].x;
      let dy = nodes[i].y - nodes[j].y;
      let distSq = dx * dx + dy * dy;
      if (distSq < minNodeDistance * minNodeDistance) {
        distSq = minNodeDistance * minNodeDistance;
      }
      const force = repulsionConstant / distSq;
      const d = Math.sqrt(distSq);
      const fx = (dx / d) * force;
      const fy = (dy / d) * force;
      forces[i].x += fx;
      forces[i].y += fy;
      forces[j].x -= fx;
      forces[j].y -= fy;
    }
  }

  // Spring forces for edges
  edges.forEach(edge => {
    const dx = edge.to.x - edge.from.x;
    const dy = edge.to.y - edge.from.y;
    const distance = Math.hypot(dx, dy);
    const force = springConstant * (distance - edge.restLength);
    const d = distance === 0 ? 1 : distance;
    const fx = (dx / d) * force;
    const fy = (dy / d) * force;
    const indexA = nodes.indexOf(edge.from);
    const indexB = nodes.indexOf(edge.to);
    if (indexA !== -1 && indexB !== -1) {
      forces[indexA].x += fx;
      forces[indexA].y += fy;
      forces[indexB].x -= fx;
      forces[indexB].y -= fy;
    }
  });

  // Gravity toward final position
  nodes.forEach((node, i) => {
    const dx = node.finalX - node.x;
    const dy = node.finalY - node.y;
    forces[i].x += dx * gravityConstant * node.mass;
    forces[i].y += dy * gravityConstant * node.mass;
  });

  // Update velocities and positions
  nodes.forEach((node, i) => {
    if (node.isStatic) return; // 고정된 노드는 움직이지 않음
    const ax = forces[i].x / node.mass;
    const ay = forces[i].y / node.mass;
    node.vx = (node.vx + ax * dt) * damping;
    node.vy = (node.vy + ay * dt) * damping;
    node.x += node.vx * dt;
    node.y += node.vy * dt;
  });
};
