// src/components/result/EmotionSummary.tsx

import React, { useMemo, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import Blob from "../Blob/Blob";
import { getBlobEmotionsFromActivityAnalysis } from "../../utils/activityEmotionUtils";

interface EmotionSummaryProps {
  diaryContent: any;
}

const EmotionSummary: React.FC<EmotionSummaryProps> = ({ diaryContent }) => {
  const emotions = useMemo(() => getBlobEmotionsFromActivityAnalysis(diaryContent), [diaryContent]);
  
  // 대상들을 하나의 배열로 합치는 함수
  const extractTargets = useCallback((content: any) => {
    const activityAnalysis = content?.analysis?.activity_analysis;
    if (!activityAnalysis || activityAnalysis.length === 0) return [];

    const targetSet = new Set<string>();

    activityAnalysis.forEach((activity: any) => {
      if (activity.peoples && Array.isArray(activity.peoples)) {
        activity.peoples.forEach((person: any) => {
          if (person.name && person.name !== "string") {
            targetSet.add(person.name.trim());
          }
        });
      }
    });

    return Array.from(targetSet);
  }, []);

  const targets = extractTargets(diaryContent);
  const scale = useMemo(() => 1.2, []);

  const mainEmotions = emotions.map(emotion => emotion.color).join(", ");
  const targetNames = targets.join(", ");

  return (
    <div className="flex flex-col items-center text-center space-y-[16px] mb-4">
      <p className="text-sm text-gray-500">하루의 감정</p>
      <div className="w-[130px] h-[130px]">
        <Canvas 
          camera={{ position: [0, 0, 10], fov: 30 }}
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            preserveDrawingBuffer: true,
          }}
          style={{ background: 'transparent' }}
          dpr={Math.min(window.devicePixelRatio, 2)}
        >
          <ambientLight intensity={0.6} />
          <pointLight position={[8, 8, 8]} intensity={0.4} />
          <Blob emotions={emotions} />
        </Canvas>
      </div>

      {mainEmotions && (
        <p className="text-xl font-bold text-gray-900 line-clamp-2 leading-relaxed m-8">
          {mainEmotions}
        </p>
      )}

      {targetNames && (
        <p className="text-lg text-gray-500 line-clamp-2 leading-relaxed m-7">{targetNames}</p>
      )}
    </div>
  );
};

export default EmotionSummary;
