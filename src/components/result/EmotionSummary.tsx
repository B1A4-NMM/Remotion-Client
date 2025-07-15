// src/components/result/EmotionSummary.tsx

import React from "react";
import { Canvas } from "@react-three/fiber";
import Blob from "../Blob/Blob";

interface EmotionSummaryProps {
  diaryContent: any;
}

// 감정과 강도를 매핑하는 함수 (중복 감정 합산)
const mapEmotionsWithIntensity = (diaryContent: any) => {
  const activityAnalysis = diaryContent?.analysis?.activity_analysis;
  if (!activityAnalysis || activityAnalysis.length === 0) return [];

  // Map을 사용하여 감정별로 강도 합산
  const emotionMap = new Map<string, number>();

  activityAnalysis.forEach(activity => {
    // 1. People의 interactions 감정 처리
    if (activity.peoples && Array.isArray(activity.peoples)) {
      activity.peoples.forEach((person: any) => {
        const interactions = person.interactions;
        if (interactions && interactions.emotion && interactions.emotion_intensity) {
          interactions.emotion.forEach((emotion: string, index: number) => {
            if (emotion && emotion !== "string") {
              // 기본값 제외
              const intensity = interactions.emotion_intensity[index] || 0;
              emotionMap.set(emotion, (emotionMap.get(emotion) || 0) + intensity);
            }
          });
        }
      });
    }

    // 2. Self emotions 처리
    if (activity.self_emotions) {
      const selfEmotions = activity.self_emotions;
      if (selfEmotions.emotion && selfEmotions.emotion_intensity) {
        selfEmotions.emotion.forEach((emotion: string, index: number) => {
          if (emotion && emotion !== "string") {
            // 기본값 제외
            const intensity = selfEmotions.emotion_intensity[index] || 0;
            emotionMap.set(emotion, (emotionMap.get(emotion) || 0) + intensity);
          }
        });
      }
    }

    // 3. State emotions 처리
    if (activity.state_emotions) {
      const stateEmotions = activity.state_emotions;
      if (stateEmotions.emotion && stateEmotions.emotion_intensity) {
        stateEmotions.emotion.forEach((emotion: string, index: number) => {
          if (emotion && emotion !== "string") {
            // 기본값 제외
            const intensity = stateEmotions.emotion_intensity[index] || 0;
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

  // Set을 사용하여 중복 자동 제거
  const targetSet = new Set<string>();

  console.log("activityAnalysis", activityAnalysis);

  // peoples 배열에서 이름 추출
  activityAnalysis.forEach(activity => {
    if (activity.peoples && Array.isArray(activity.peoples)) {
      activity.peoples.forEach((person: any) => {
        if (person.name && person.name !== "string") {
          // 기본값 제외
          targetSet.add(person.name.trim()); // 공백 제거 후 추가
        }
      });
    }
  });

  // Set을 배열로 변환
  return Array.from(targetSet);
};

const EmotionSummary: React.FC<EmotionSummaryProps> = ({ diaryContent }) => {
  const emotions = mapEmotionsWithIntensity(diaryContent);
  const targets = extractTargets(diaryContent);

  // 메인 감정들을 문자열로 변환 (표시용)
  const mainEmotions = emotions.map(item => item.emotion).join(", ");
  const targetNames = targets.join(", ");

  return (
    <div className="flex flex-col items-center text-center space-y-2 mb-4 ">
      <p className="text-sm text-gray-500">하루의 감정</p>
      <div>
        <Canvas camera={{ position: [0, 0, 10], fov: 30 }}>
          <Blob diaryContent={{ emotions }} />
        </Canvas>
      </div>

      {mainEmotions && (
        <p className="text-xl font-bold text-gray-900 line-clamp-2 leading-relaxed m-8">
          {mainEmotions}
        </p>
      )}

      {targetNames && (
        <p className="text-base text-gray-500 line-clamp-2 leading-relaxed m-7">{targetNames}</p>
      )}
    </div>
  );
};

export default EmotionSummary;
