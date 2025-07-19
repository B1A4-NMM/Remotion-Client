import React from "react";

// 감정 하이라이트 함수
export function highlightEmotions(emotions: string[]): React.ReactNode {
  if (emotions.length === 0) return null;

  return emotions.map((emotion, index) => (
    <span key={index} className="font-semibold text-blue-600">
      {emotion}
      {index < emotions.length - 1 && ", "}
    </span>
  ));
}

// 활동 하이라이트 함수
export function highlightActivity(activity: string, colorKey: string): React.ReactNode {
  const colorMap: { [key: string]: string } = {
    yellow: "text-yellow-600",
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
  };

  const colorClass = colorMap[colorKey] || "text-gray-600";

  return <span className={`font-semibold ${colorClass}`}>{activity}</span>;
}

// 대상 하이라이트 함수
export function highlightTargets(targets: { name: string; colorKey: string }[]): React.ReactNode {
  if (targets.length === 0) return null;

  return targets.map((target, index) => (
    <span key={index} className="font-semibold text-purple-600">
      {target.name}
      {index < targets.length - 1 && ", "}
    </span>
  ));
}
