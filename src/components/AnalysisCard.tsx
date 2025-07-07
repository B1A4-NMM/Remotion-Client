// components/AnalysisCard.tsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import EmotionCircle from "./EmotionCircle"; // 너가 만든 컴포넌트

type Emotion = {
  color: string;
  intensity: number;
};

interface AnalysisCardProps {
  emotions: Emotion[];
  baseColors: Record<string, string>;
  label: string;
  route: string;
  multi?: boolean; // relation은 true, aboutMe는 false
}

const AnalysisCard = ({ emotions, baseColors, label, route, multi }: AnalysisCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="w-full max-w-sm p-6 rounded-xl border border-gray-300 bg-transparent cursor-pointer"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(route)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
    >
      <div className="flex justify-center items-center mb-4">
        {/* 단일 원 또는 겹쳐진 원 */}
        {multi ? (
          <div className="flex gap-[-10px] -ml-4">
            <EmotionCircle emotions={emotions} baseColors={baseColors} size={60} />
            <EmotionCircle emotions={emotions} baseColors={baseColors} size={60} />
            <EmotionCircle emotions={emotions} baseColors={baseColors} size={60} />
          </div>
        ) : (
          <EmotionCircle emotions={emotions} baseColors={baseColors} size={80} />
        )}
      </div>
      <p className="text-center text-white text-lg font-medium">{label}</p>
    </motion.div>
  );
};

export default AnalysisCard;
