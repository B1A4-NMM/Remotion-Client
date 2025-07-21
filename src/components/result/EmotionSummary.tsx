// src/components/result/EmotionSummary.tsx

import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import Blob from "../Blob/Blob";
import { mapEmotionToColor, ColorKey } from "../../constants/emotionColors";

interface EmotionSummaryProps {
  diaryContent: any;
}

interface Emotion {
  color: ColorKey;
  intensity: number;
}

// 감정과 강도를 매핑하는 함수 (중복 감정 합산)
const mapEmotionsWithIntensity = (diaryContent: any) => {
  const activityAnalysis = diaryContent?.analysis?.activity_analysis;
  if (!activityAnalysis || activityAnalysis.length === 0) return [];

  // Map을 사용하여 감정별로 강도 합산
  const emotionMap = new Map<string, number>();

  activityAnalysis.forEach((activity: any) => {
    console.log("Activity:", activity.activity);
    // 1. People의 interactions 감정 처리
    if (activity.peoples && Array.isArray(activity.peoples)) {
      activity.peoples.forEach((person: any) => {
        console.log("Person:", person.name, "Interactions:", person.interactions);
        const interactions = person.interactions;
        if (interactions && interactions.emotion && interactions.emotion_intensity) {
          console.log("Interactions emotions:", interactions.emotion);
          interactions.emotion.forEach((emotion: string, index: number) => {
            if (emotion && emotion !== "string") {
              const intensity = interactions.emotion_intensity[index] || 0;
              console.log("Adding interaction emotion:", emotion, "intensity:", intensity);
              emotionMap.set(emotion, (emotionMap.get(emotion) || 0) + intensity);
            }
          });
        }
      });
    }

    // 2. Self emotions 처리
    console.log("Self emotions:", activity.self_emotions);
    if (activity.self_emotions) {
      const selfEmotions = activity.self_emotions;
      if (selfEmotions.emotion && selfEmotions.emotion_intensity) {
        console.log("Self emotions array:", selfEmotions.emotion);
        selfEmotions.emotion.forEach((emotion: string, index: number) => {
          if (emotion && emotion !== "string") {
            const intensity = selfEmotions.emotion_intensity[index] || 0;
            console.log("Adding self emotion:", emotion, "intensity:", intensity);
            emotionMap.set(emotion, (emotionMap.get(emotion) || 0) + intensity);
          }
        });
      }
    }

    // 3. State emotions 처리
    console.log("State emotions:", activity.state_emotions);
    if (activity.state_emotions) {
      const stateEmotions = activity.state_emotions;
      if (stateEmotions.emotion && stateEmotions.emotion_intensity) {
        console.log("State emotions array:", stateEmotions.emotion);
        stateEmotions.emotion.forEach((emotion: string, index: number) => {
          if (emotion && emotion !== "string") {
            const intensity = stateEmotions.emotion_intensity[index] || 0;
            console.log("Adding state emotion:", emotion, "intensity:", intensity);
            emotionMap.set(emotion, (emotionMap.get(emotion) || 0) + intensity);
          }
        });
      }
    }
  });

  // Map을 배열로 변환
  return Array.from(emotionMap.entries()).map(([emotion, intensity]) => ({
    emotion,
    intensity,
  }));
};

// 대상들을 하나의 배열로 합치는 함수 (중복 인물 제거)
const extractTargets = (diaryContent: any) => {
  const activityAnalysis = diaryContent?.analysis?.activity_analysis;
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
};

const EmotionSummary: React.FC<EmotionSummaryProps> = ({ diaryContent }) => {
  const rawEmotions = mapEmotionsWithIntensity(diaryContent);
  console.log("Raw emotions:", rawEmotions);
  const targets = extractTargets(diaryContent);

  // ✅ 색상과 강도 계산
  const processedEmotions = useMemo((): Emotion[] => {
    if (rawEmotions.length === 0) {
      return [{ color: "gray", intensity: 1 }];
    }

    // 색상별로 강도 합산
    const colorMap = new Map<ColorKey, number>();
    rawEmotions.forEach(({ emotion, intensity }) => {
      const color = mapEmotionToColor(emotion);
      colorMap.set(color, (colorMap.get(color) || 0) + intensity);
    });

    // 여러 색상일 때 gray 제거
    if (colorMap.size > 1) {
      colorMap.delete("gray");
    }

    const totalIntensity = [...colorMap.values()].reduce((sum, val) => sum + val, 0);
    if (totalIntensity === 0) {
      return [{ color: "gray", intensity: 1 }];
    }

    // 강도순으로 정렬하고 상위 3개만 선택
    const sortedResults = [...colorMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([color, total]) => ({
        color,
        intensity: total / totalIntensity,
      }));

    // ✅ 총합을 정확히 1.000으로 맞추기
    const rounded = sortedResults.map(item => ({
      color: item.color,
      intensity: Math.round(item.intensity * 1000) / 1000,
    }));

    const sum = rounded.reduce((acc, item) => acc + item.intensity, 0);
    const diff = 1.0 - sum;
    if (Math.abs(diff) > 0.001 && rounded.length > 0) {
      rounded[0].intensity = Math.round((rounded[0].intensity + diff) * 1000) / 1000;
    }

    return rounded;
  }, [rawEmotions]);

  // 메인 감정들을 문자열로 변환 (표시용)
  const mainEmotions = rawEmotions
    .sort((a, b) => b.intensity - a.intensity)
    .slice(0, 3)
    .map(item => item.emotion)
    .join(", ");

  console.log("Main emotions:", mainEmotions);

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
          style={{ background: "transparent" }}
          dpr={Math.min(window.devicePixelRatio, 2)}
        >
          <ambientLight intensity={0.6} />
          <pointLight position={[8, 8, 8]} intensity={0.4} />
          {/* ✅ 처리된 emotions 배열을 직접 전달 */}
          <Blob emotions={processedEmotions} />
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
