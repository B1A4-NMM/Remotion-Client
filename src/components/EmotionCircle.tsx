// components/EmotionCircle.tsx
import React from "react";
import "../styles/moodCircle.css";
import { motion, AnimatePresence, delay } from "framer-motion";

type Emotion = {
  color: string;
  intensity: number;
};

type ColorKey = "green" | "red" | "yellow" | "blue" | "gray" | "gray1" | "gray2";

type EmotionCircleProps = {
  emotions: Emotion[];
  baseColors: Record<ColorKey, string>;
  size?: number; // optional: 원 크기 조절
};
const getMoodCircleScale = () => {
  const maxDrag = 100;
  const minScale = 0.8;
  const maxScale = 1; // 아래로 드래그할 때 최대 크기

  if (scrollY <= 0) {
    // 위로 드래그: 크기 감소 (1 → 0.5)
    return Math.max(minScale, 1 + scrollY / maxDrag);
  } else {
    // 아래로 드래그: 크기 증가 (1 → 1.2)
    return Math.min(maxScale, 1 + scrollY / maxDrag);
  }
};

const EmotionCircle = ({ emotions, baseColors, size = 192 }: EmotionCircleProps) => {
  const generateGradient = (): string => {
    if (emotions.length === 0) return "#333";
    if (emotions.length === 1) return baseColors[emotions[0].color as ColorKey];

    const intensities = emotions.map(e => e.intensity);
    const maxIntensity = Math.max(...intensities);
    const normalizedIntensities = intensities.map(i => i / maxIntensity);

    const totalWeight = normalizedIntensities.reduce((sum, weight) => sum + weight, 0);
    let cumulative = 0;

    const colors = emotions.map((emotion, index) => {
      cumulative += normalizedIntensities[index];
      const position = (cumulative / totalWeight) * 100;
      return `${baseColors[emotion.color as ColorKey]} ${position.toFixed(1)}%`;
    });

    return `radial-gradient(ellipse at center, ${colors.join(", ")})`;
  };

  return (
    <motion.div
      className="mood-container flex justify-center mb-6"
      animate={{
        scale: getMoodCircleScale(),
        opacity: Math.max(0.5, getMoodCircleScale()),
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div
        className="mood-circle rounded-full"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          background: generateGradient(),
          boxShadow: `0 0 40px ${emotions[0]?.color || "#4ecdc4"}40`,
        }}
      />
    </motion.div>
  );
};

export default EmotionCircle;
