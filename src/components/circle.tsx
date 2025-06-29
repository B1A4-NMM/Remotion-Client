// Circle.tsx

import { motion } from "framer-motion";
import React from "react";

type CircleProps = {
  id: number;
  name: string;
  x: number;
  y: number;
  size: number;
  colors: string[]; // 최소 2개
  isHovered: boolean;
  isCenter: boolean;
};

export const Circle: React.FC<CircleProps> = ({
  id,
  name,
  x,
  y,
  size,
  colors,
  isHovered,
  isCenter,
}) => {
  // gradient 배경
  const gradient = `radial-gradient(circle, ${colors[0]} 0%, ${colors[1]} 80%)`;

  return (
    <motion.div
      key={id}
      className="circle absolute flex items-center justify-center font-bold text-sm"
      style={{
        left: `calc(50% + ${x}px - ${size / 2}px)`,
        top: `calc(50% + ${y}px - ${size / 2}px)`,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${colors[0]} 0%, ${colors[1]} 80%)`,
        border: isCenter ? "1px solid #ededed" : "none",
        zIndex: isHovered ? 10 : 1,
        boxShadow: `
      0 0 12px 4px ${colors[0]}33,
      0 0 20px 6px ${colors[1]}22
    `,
        filter: `
          blur(0.1px)
          drop-shadow(0 0 4px ${colors[0]}55)
          drop-shadow(0 0 6px ${colors[1]}33)
        `,
      }}
      layout
    >
      <span
        style={{
          color: "black",
          textShadow: "0 1px 4px rgba(0,0,0,0.1)",
          zIndex: 11,
        }}
      >
        {name}
      </span>
    </motion.div>
  );
};
