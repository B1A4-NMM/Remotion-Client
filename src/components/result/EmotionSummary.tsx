// src/components/result/EmotionSummary.tsx

import React from "react";
import MoodCircle from "./MoodCircle";

interface EmotionSummaryProps {
  diaryContent: any;
}

const EmotionSummary: React.FC<EmotionSummaryProps> = ({ diaryContent }) => {
  // 예시: 감정과 대상 파싱
  const firstActivity = diaryContent?.activity_analysis?.[0];
  const selfEmo = firstActivity?.self_emotions?.self_emotion || [];
  const stateEmo = firstActivity?.state_emotions?.state_emotion || [];
  const mainEmotions = [...selfEmo, ...stateEmo].join(", ");
  const targets = firstActivity?.peoples?.join(", ");

  return (
    <div className="flex flex-col items-center text-center space-y-3 mb-4">
      <p className="text-sm text-gray-500">하루의 감정</p>
      <MoodCircle diaryContent={diaryContent} />
      {mainEmotions && (
        <p className="text-lg font-bold text-gray-900">{mainEmotions}</p>
      )}
      {targets && (
        <p className="text-sm text-gray-500">{targets}</p>
      )}
    </div>
  );
};

export default EmotionSummary;
