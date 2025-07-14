// src/components/result/EmotionSummary.tsx

import React from "react";
import { Canvas } from "@react-three/fiber";
import Blob from "../Blob/Blob";

interface EmotionSummaryProps {
  diaryContent: any;
}

const EmotionSummary: React.FC<EmotionSummaryProps> = ({ diaryContent }) => {
  const firstActivity = diaryContent?.activity_analysis?.[0];
  const selfEmo = firstActivity?.self_emotions?.self_emotion || [];
  const stateEmo = firstActivity?.state_emotions?.state_emotion || [];
  const mainEmotions = [...selfEmo, ...stateEmo].join(", ");
  const targets = firstActivity?.peoples?.join(", ");

  return (
    <div className="flex flex-col items-center text-center space-y-2 mb-4">
      <p className="text-sm text-gray-500">하루의 감정</p>
      <div>
        <Canvas camera={{ position: [0, 0, 10], fov: 30 }}>
          <Blob diaryContent={diaryContent}/>
        </Canvas>
      </div>
      
      {mainEmotions && (
        <p className="text-xl font-bold text-gray-900 line-clamp-2 leading-relaxed m-8">
          {mainEmotions}
        </p>
      )}
      
      {targets && (
        <p className="text-base text-gray-500 line-clamp-2 leading-relaxed m-7">
          {targets}
        </p>
      )}
    </div>
  );
};

export default EmotionSummary;
