import React from "react";
import { mapEmotionToColor } from "@/constants/emotionColors";

// 감정 하이라이트 함수
export function highlightEmotions(emotions: string[]): React.ReactNode {
  if (emotions.length === 0) return null;

  return emotions.map((emotion, index) => {
    const colorKey = mapEmotionToColor(emotion);
    const { bgClass, textClass } = getEmotionBoxColors(colorKey);

    return (
      <span
        key={index}
        className={`inline-block px-2 py-1 rounded-md text-base  font-semibold mr-1 mb-1 ${bgClass} ${textClass}`}
      >
        {emotion}
      </span>
    );
  });
}

// 활동 하이라이트 함수 (회색 박스)
export function highlightActivity(activity: string): React.ReactNode {
  return (
    <span
      className="inline-block px-2 py-1 rounded-md text-base font-semibold mr-1 mb-1 bg-gray-100"
      style={{ color: "#000" }}
    >
      {activity}
    </span>
  );
}

// 인물 하이라이트 함수 (가장 높은 감정 강도에 따라 밑줄 색상)
export function highlightTargets(
  targets: { name: string; colorKey: string; emotions?: string[]; intensities?: number[] }[]
): React.ReactNode {
  if (targets.length === 0) return null;

  return targets.map((target, index) => {
    // 가장 높은 intensity의 감정 색상 찾기
    let highestIntensityColor = "blue"; // 기본값

    if (target.emotions && target.intensities && target.emotions.length > 0) {
      let maxIntensity = 0;
      let maxIntensityEmotion = "";

      target.emotions.forEach((emotion, emotionIndex) => {
        const intensity = target.intensities?.[emotionIndex] || 0;
        if (intensity > maxIntensity) {
          maxIntensity = intensity;
          maxIntensityEmotion = emotion;
        }
      });

      if (maxIntensityEmotion) {
        highestIntensityColor = mapEmotionToColor(maxIntensityEmotion);
      }
    }

    const underlineColor = getUnderlineColor(highestIntensityColor);

    return (
      <span key={index} className={`inline-block mr-1 mb-1 font-semibold ${underlineColor}`}>
        {target.name}
        {index < targets.length - 1 && ", "}
      </span>
    );
  });
}

// 밑줄 색상 매핑 함수
function getUnderlineColor(colorKey: string): string {
  const colorMap: { [key: string]: string } = {
    yellow: "decoration-yellow-500",
    red: "decoration-red-500",
    blue: "decoration-blue-500",
    green: "decoration-green-500",
    gray: "decoration-gray-500",
    gray1: "decoration-gray-400",
    gray2: "decoration-gray-300",
  };

  return colorMap[colorKey] || "decoration-gray-500";
}

// 감정 박스 색상 매핑 함수
function getEmotionBoxColors(colorKey: string): { bgClass: string; textClass: string } {
  const colorMap: { [key: string]: { bgClass: string; textClass: string } } = {
    yellow: { bgClass: "bg-yellow-100", textClass: "text-yellow-800" },
    red: { bgClass: "bg-red-100", textClass: "text-red-800" },
    blue: { bgClass: "bg-blue-100", textClass: "text-blue-800" },
    green: { bgClass: "bg-green-100", textClass: "text-green-800" },
    gray: { bgClass: "bg-gray-100", textClass: "text-gray-800" },
    gray1: { bgClass: "bg-gray-100", textClass: "text-gray-700" },
    gray2: { bgClass: "bg-gray-100", textClass: "text-gray-600" },
  };

  return colorMap[colorKey] || { bgClass: "bg-gray-100", textClass: "text-gray-800" };
}
