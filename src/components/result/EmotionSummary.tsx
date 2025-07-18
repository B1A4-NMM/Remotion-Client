// src/components/result/EmotionSummary.tsx

import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Blob from "../Blob/Blob";
import SimpleBlob from "../Blob/Simple/SimpleBlob";
import LoadingBlob from "../Blob/Loading/LodingBlob";

interface EmotionSummaryProps {
  diaryContent: any;
  isLoading: boolean;
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

const EMOTION_LOADING_TEXTS = [
  "오늘 어떤 감정들을 느꼈는지 살펴보는 중이에요.",
  "빨간색은 부정적인 감정이 강하게 들었다는 의미에요.",
  "파란색은 부정적인 감정이 약하게 들었을 때 나타나요.",
  "초록색은 긍정적인 감정이 강하게 들었다는 의미에요.",
  "노란색은 오늘 하루를 좋은 기분으로 보냈다는 의미에요.",
];
const TARGET_LOADING_TEXTS = [
  "오늘은 어떤 사람들과 함께였을까요?",
  "감정의 흐름을 따라가고 있습니다...",
  "오늘의 특별한 순간을 포착 중..."
];

const EmotionSummary: React.FC<EmotionSummaryProps> = ({ diaryContent, isLoading=false }) => {
  const emotions = mapEmotionsWithIntensity(diaryContent);
  const targets = extractTargets(diaryContent);

  // 메인 감정들을 문자열로 변환 (표시용)
  const mainEmotions = emotions.map(item => item.emotion).join(", ");
  const targetNames = targets.join(", ");

  // 로딩 문구 인덱스
  const [emotionIdx, setEmotionIdx] = useState(0);
  const [targetIdx, setTargetIdx] = useState(0);
  useEffect(() => {
    if (!isLoading) return;
    const emotionTimer = setInterval(() => {
      setEmotionIdx(idx => (idx + 1) % EMOTION_LOADING_TEXTS.length);
    }, 3500);
    const targetTimer = setInterval(() => {
      setTargetIdx(idx => (idx + 1) % TARGET_LOADING_TEXTS.length);
    }, 3500);
    return () => {
      clearInterval(emotionTimer);
      clearInterval(targetTimer);
    };
  }, [isLoading]);

  return (
    <div className="flex flex-col items-center text-center space-y-2 mb-4 ">
      <p className="text-sm text-gray-500">하루의 감정</p>
      <div>
        {isLoading?(
        <Canvas camera={{ position: [0, 0, 8], fov: 30 }}>
          <LoadingBlob />
        </Canvas>
        ):(
          <Canvas camera={{ position: [0, 0, 10], fov: 30 }}>
            <Blob diaryContent={{ emotions }} />
          </Canvas>
        )}
      </div>

      {mainEmotions && !isLoading ?(
        <p className="text-xl font-bold text-gray-900 line-clamp-2 leading-relaxed m-8">
          {mainEmotions}
        </p>
      ):(
        <p className="text-xl font-bold text-gray-900 line-clamp-2 leading-relaxed m-8 animate-pulse animate-fade-in">
          {EMOTION_LOADING_TEXTS[emotionIdx]}
        </p>
      )}

      {targetNames && !isLoading? (
        <p className="text-base text-gray-500 line-clamp-2 leading-relaxed m-7">{targetNames}</p>
      ):(
        <p className="text-base text-gray-500 line-clamp-2 leading-relaxed m-7 animate-pulse animate-fade-in">{TARGET_LOADING_TEXTS[targetIdx]}</p>
      )}
    </div>
  );
};

export default EmotionSummary;
