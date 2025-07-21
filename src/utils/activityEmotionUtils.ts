// utils/activityEmotionUtils.ts

import { mapEmotionToColor } from "@/constants/emotionColors";

// VirtualizedBlobCard용: diaryContent.emotions 처리
export function getBlobEmotionsFromSimpleEmotions(content: any): Emotion[] {
  if (!content?.emotions || !Array.isArray(content.emotions)) {
    return [{ color: "gray", intensity: 1 }];
  }

  const validEmotions = content.emotions.filter((emotion: any) => 
    emotion && emotion.emotion && emotion.emotion !== '무난'
  );

  if (validEmotions.length === 0) {
    return [{ color: "gray", intensity: 1 }];
  }

  // 색상별 intensity 합산
  const colorMap = new Map<ColorKey, number>();
  validEmotions.forEach(({ emotion, intensity }: any) => {
    const color = mapEmotionToColor(emotion);
    colorMap.set(color, (colorMap.get(color) || 0) + (intensity || 5));
  });

  // 여러 색상일 때 gray 제외
  if (colorMap.size > 1) {
    colorMap.delete("gray");
  }

  const totalIntensity = [...colorMap.values()].reduce((sum, val) => sum + val, 0);
  if (totalIntensity === 0) {
    return [{ color: "gray", intensity: 1 }];
  }

  // 정규화 및 정확한 총합 1.000 보장
  const results = [...colorMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([color, total]) => ({
      color,
      intensity: total / totalIntensity
    }));

  // 총합을 정확히 1.000으로 맞추기
  const normalizedResults = normalizeIntensities(results);
  return normalizedResults;
}

// EmotionSummary용: activity_analysis 처리  
export function getBlobEmotionsFromActivityAnalysis(content: any): Emotion[] {
  const activityAnalysis = content?.analysis?.activity_analysis;
  if (!activityAnalysis || !Array.isArray(activityAnalysis)) {
    return [{ color: "gray", intensity: 1 }];
  }

  const emotionMap = new Map<string, number>();

  activityAnalysis.forEach((activity: any) => {
    // People interactions 처리
    if (activity.peoples && Array.isArray(activity.peoples)) {
      activity.peoples.forEach((person: any) => {
        const interactions = person.interactions;
        if (interactions?.emotion && interactions?.emotion_intensity) {
          interactions.emotion.forEach((emotion: string, index: number) => {
            if (emotion && emotion !== "string") {
              const intensity = interactions.emotion_intensity[index] || 0;
              emotionMap.set(emotion, (emotionMap.get(emotion) || 0) + intensity);
            }
          });
        }
      });
    }

    // Self emotions 처리
    if (activity.self_emotions?.emotion && activity.self_emotions?.emotion_intensity) {
      activity.self_emotions.emotion.forEach((emotion: string, index: number) => {
        if (emotion && emotion !== "string") {
          const intensity = activity.self_emotions.emotion_intensity[index] || 0;
          emotionMap.set(emotion, (emotionMap.get(emotion) || 0) + intensity);
        }
      });
    }

    // State emotions 처리
    if (activity.state_emotions?.emotion && activity.state_emotions?.emotion_intensity) {
      activity.state_emotions.emotion.forEach((emotion: string, index: number) => {
        if (emotion && emotion !== "string") {
          const intensity = activity.state_emotions.emotion_intensity[index] || 0;
          emotionMap.set(emotion, (emotionMap.get(emotion) || 0) + intensity);
        }
      });
    }
  });

  if (emotionMap.size === 0) {
    return [{ color: "gray", intensity: 1 }];
  }

  // 색상별로 변환
  const colorMap = new Map<ColorKey, number>();
  Array.from(emotionMap.entries()).forEach(([emotion, intensity]) => {
    const color = mapEmotionToColor(emotion);
    colorMap.set(color, (colorMap.get(color) || 0) + intensity);
  });

  if (colorMap.size > 1) {
    colorMap.delete("gray");
  }

  const totalIntensity = [...colorMap.values()].reduce((sum, val) => sum + val, 0);
  if (totalIntensity === 0) {
    return [{ color: "gray", intensity: 1 }];
  }

  const results = [...colorMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([color, total]) => ({
      color,
      intensity: total / totalIntensity
    }));

  return normalizeIntensities(results);
}

// 공통 유틸리티: intensity 총합을 정확히 1.000으로 만들기
function normalizeIntensities(results: {color: ColorKey, intensity: number}[]): Emotion[] {
  if (results.length === 0) return [{ color: "gray", intensity: 1 }];

  // 소수점 3자리로 반올림
  const rounded = results.map(item => ({
    color: item.color,
    intensity: Math.round(item.intensity * 1000) / 1000
  }));

  // 총합 계산
  const sum = rounded.reduce((acc, item) => acc + item.intensity, 0);
  
  // 오차가 있으면 가장 큰 값에 조정
  const diff = 1.000 - sum;
  if (Math.abs(diff) > 0.001) {
    rounded[0].intensity = Math.round((rounded[0].intensity + diff) * 1000) / 1000;
  }

  return rounded;
}
