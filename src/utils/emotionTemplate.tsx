import React from "react";
import { classifyEmotion } from "./emotionClassifier";
import { mapEmotionToColor, baseColors } from "@/constants/emotionColors";

// hex → rgba 변환 함수
function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

// 감정명 하이라이트 span 생성 함수
function highlightEmotions(emotions: string[]) {
  return emotions.map((emo, idx) => {
    const colorKey = mapEmotionToColor(emo);
    const bgColor = hexToRgba(baseColors[colorKey], 0.25); // 형광펜 느낌
    return (
      <span
        key={emo + idx}
        style={{
          background: bgColor,
          borderRadius: "0.3em",
          padding: "0.1em 0.4em",
          marginRight: "0.2em",
          color: "#333",
          fontWeight: "bold",
        }}
      >
        {emo}
      </span>
    );
  });
}

// 대상 하이라이트 span 생성 함수
function highlightTargets(targets: { name: string; colorKey: string }[]) {
  return targets.map((t, idx) => (
    <span
      key={t.name + idx}
      style={{
        background: hexToRgba(baseColors[t.colorKey as keyof typeof baseColors], 0.25),
        borderRadius: "0.3em",
        padding: "0.1em 0.4em",
        marginRight: "0.2em",
        color: "#333",
        fontWeight: "bold",
      }}
    >
      {t.name}
    </span>
  ));
}

// 액티비티 하이라이트 span 생성 함수 (밑줄)
function highlightActivity(activity: string, colorKey: string) {
  const underlineColor = hexToRgba(baseColors[colorKey as keyof typeof baseColors], 0.25);
  return (
    <span
      style={{
        borderBottom: `2.5px solid ${underlineColor}`,
        paddingBottom: "0.03em",
        fontWeight: "500",
      }}
    >
      {activity}
    </span>
  );
}

// 템플릿 문구 함수들
const TEMPLATES = {
  "1": (
    targets: { name: string; colorKey: string }[],
    activity: string,
    emotions: string[],
    mainColorKey: string
  ) => (
    <div className="text-base leading-relaxed text-gray-800">
      {highlightTargets(targets)}과 함께한 {highlightActivity(activity, mainColorKey)} 에서,{" "}
      {highlightEmotions(emotions)}이 또렷하게 피어났고, 그 순간이 오랫동안 마음에 남았어요.
    </div>
  ),
  "2": (
    targets: { name: string; colorKey: string }[],
    activity: string,
    emotions: string[],
    mainColorKey: string
  ) => (
    <div className="text-base leading-relaxed text-gray-800">
      {highlightTargets(targets)}
      과의 {highlightActivity(activity, mainColorKey)} 에, {highlightEmotions(emotions)}이 살며시
      피어났어요. 그 따뜻한 기분이 아직도 맴돌아요.
    </div>
  ),
  "3": (
    targets: { name: string; colorKey: string }[],
    activity: string,
    emotions: string[],
    mainColorKey: string
  ) => (
    <div className="text-base leading-relaxed text-gray-800">
      {highlightTargets(targets)}
      과의 {highlightActivity(activity, mainColorKey)} 중, {highlightEmotions(emotions)}이
      교차했지만, 결국 따뜻함이 더 크게 다가왔어요.
    </div>
  ),
  "4": (
    targets: { name: string; colorKey: string }[],
    activity: string,
    emotions: string[],
    mainColorKey: string
  ) => (
    <div className="text-base leading-relaxed text-gray-800">
      {highlightTargets(targets)}과 함께한 {highlightActivity(activity, mainColorKey)}에서,{" "}
      {highlightEmotions(emotions)}이 마음을 무겁게 했어요. 아쉬움이 오래 남은 하루였어요.
    </div>
  ),
  "5": (
    targets: { name: string; colorKey: string }[],
    activity: string,
    emotions: string[],
    mainColorKey: string
  ) => (
    <div className="text-base leading-relaxed text-gray-800">
      {highlightTargets(targets)}을 떠올리며 했던 {highlightActivity(activity, mainColorKey)}, 강한{" "}
      {highlightEmotions(emotions)}이 하루 내내 마음을 흔들었어요.
    </div>
  ),
  "6": (
    targets: { name: string; colorKey: string }[],
    activity: string,
    emotions: string[],
    mainColorKey: string
  ) => (
    <div className="text-base leading-relaxed text-gray-800">
      {highlightTargets(targets)}과 함께한 {highlightActivity(activity, mainColorKey)}에서,{" "}
      {highlightEmotions(emotions)}이 차례로 떠올랐어요. 쉽게 흘려보낼 수 없는 하루였어요.
    </div>
  ),
  "7": (
    targets: { name: string; colorKey: string }[],
    activity: string,
    emotions: string[],
    mainColorKey: string
  ) => (
    <div className="text-base leading-relaxed text-gray-800">
      {highlightTargets(targets)}
      과의 {highlightActivity(activity, mainColorKey)} 중, {highlightEmotions(emotions)}이 살며시
      지나갔어요. 마음에 잔잔히 머물다 사라진 하루였어요.
    </div>
  ),
  "8_1_pos": (
    targets: { name: string; colorKey: string }[],
    activity: string,
    emotions: string[],
    mainColorKey: string
  ) => (
    <div className="text-base leading-relaxed text-gray-800">
      {highlightTargets(targets)}
      과의 {highlightActivity(activity, mainColorKey)}에서, 느낀 {highlightEmotions(emotions)}이
      은은하게 퍼져, 하루를 부드럽게 감쌌어요.
    </div>
  ),
  "8_1_neg": (
    targets: { name: string; colorKey: string }[],
    activity: string,
    emotions: string[],
    mainColorKey: string
  ) => (
    <div className="text-base leading-relaxed text-gray-800">
      {highlightTargets(targets)}과 함께한 {highlightActivity(activity, mainColorKey)} 속,{" "}
      {highlightEmotions(emotions)}이 가볍진 않았지만, 조용히 마음에 남았어요.
    </div>
  ),
  "8_2_pos": (
    targets: { name: string; colorKey: string }[],
    activity: string,
    emotions: string[],
    mainColorKey: string
  ) => (
    <div className="text-base leading-relaxed text-gray-800">
      {highlightTargets(targets)}
      과의 {highlightActivity(activity, mainColorKey)}에서, {highlightEmotions(emotions)}이 조용히
      퍼졌어요. 마음이 편안하게 물들었어요.
    </div>
  ),
  "8_2_neg": (
    targets: { name: string; colorKey: string }[],
    activity: string,
    emotions: string[],
    mainColorKey: string
  ) => (
    <div className="text-base leading-relaxed text-gray-800">
      {highlightTargets(targets)}
      과의 {highlightActivity(activity, mainColorKey)}에서, {highlightEmotions(emotions)}이 은근히
      스며들었고, 하루를 살짝 무겁게 눌렀어요.
    </div>
  ),
  "8_2_mix": (
    targets: { name: string; colorKey: string }[],
    activity: string,
    emotions: string[],
    mainColorKey: string
  ) => (
    <div className="text-base leading-relaxed text-gray-800">
      {highlightTargets(targets)}과 함께한 {highlightActivity(activity, mainColorKey)}에서,{" "}
      {highlightEmotions(emotions)}이 엇갈리듯 떠올랐어요. 하루가 조금은 복잡하게 느껴졌어요.
    </div>
  ),
  "9": (
    targets: { name: string; colorKey: string }[],
    activity: string,
    emotions: string[],
    mainColorKey: string
  ) => (
    <div className="text-base leading-relaxed text-gray-800">
      {highlightTargets(targets)}과 함께한 {highlightActivity(activity, mainColorKey)} 속,{" "}
      <b className="text-blue-500">긍정감정</b>과 <b className="text-rose-500">부정감정</b>이 함께
      밀려와, 감정이 소용돌이친 하루였어요.
    </div>
  ),
  no_emotion: (
    targets: { name: string; colorKey: string }[],
    activity: string,
    emotions: string[],
    mainColorKey: string
  ) => (
    <div className="text-base leading-relaxed text-gray-800">
      {highlightTargets(targets)}과의 {highlightActivity(activity, mainColorKey)}, 감정은 명확히
      떠오르지 않지만, 그 순간이 당신에게 어떤 의미였을지 궁금해져요.
    </div>
  ),
};

type EmotionData = {
  type: string;
  intensity: number;
};

type Person = {
  name: string;
  interactions?: {
    emotion: string[];
    emotion_intensity?: number[];
  };
};

type EmotionTemplateParams = {
  activity: string;
  peoples: Person[];
};

function getEmotionTemplate({ activity, peoples }: EmotionTemplateParams) {
  const allEmotions: EmotionData[] = [];
  const targets: { name: string; colorKey: string }[] = [];

  for (const p of peoples) {
    let maxIdx = 0;
    let maxIntensity = -Infinity;
    const { emotion, emotion_intensity } = p.interactions ?? {};
    if (emotion && Array.isArray(emotion)) {
      emotion.forEach((emo, idx) => {
        allEmotions.push({
          type: emo,
          intensity: emotion_intensity?.[idx] ?? 0,
        });
        if (
          emotion_intensity &&
          emotion_intensity[idx] !== undefined &&
          emotion_intensity[idx] > maxIntensity
        ) {
          maxIntensity = emotion_intensity[idx];
          maxIdx = idx;
        }
      });
    }
    if (p.name && emotion && emotion.length > 0) {
      const mainEmotion = emotion[maxIdx];
      const colorKey = mapEmotionToColor(mainEmotion);
      targets.push({ name: p.name, colorKey });
    } else if (p.name) {
      targets.push({ name: p.name, colorKey: "yellow" }); // fallback
    }
  }

  // 감정이 하나도 없으면 no_emotion 템플릿 사용
  if (allEmotions.length === 0) {
    const Template = TEMPLATES["no_emotion"];
    const mainColorKey = targets[0]?.colorKey || "yellow";
    return {
      jsx: Template ? Template(targets, activity, [], mainColorKey) : null,
      mainColorKey,
    };
  }

  const positives = allEmotions.filter(e => classifyEmotion(e.type) === "positive");
  const negatives = allEmotions.filter(e => classifyEmotion(e.type) === "negative");

  const avgIntensity = allEmotions.reduce((sum, e) => sum + e.intensity, 0) / allEmotions.length;
  const maxIntensity = Math.max(...allEmotions.map(e => e.intensity));

  let caseKey: string = "0";

  if (positives.length === 1 && positives[0].intensity >= 7 && negatives.length === 0)
    caseKey = "1";
  else if (positives.length >= 2 && avgIntensity >= 6 && negatives.length === 0) caseKey = "2";
  else if (positives.length > negatives.length && negatives.length > 0) caseKey = "3";
  else if (negatives.length > positives.length && positives.length > 0) caseKey = "4";
  else if (negatives.length === 1 && negatives[0].intensity >= 7 && positives.length === 0)
    caseKey = "5";
  else if (negatives.length >= 2 && avgIntensity >= 6 && positives.length === 0) caseKey = "6";
  else if (allEmotions.every(e => e.intensity <= 3)) caseKey = "7";
  else if (
    allEmotions.length === 1 &&
    allEmotions[0].intensity >= 4 &&
    allEmotions[0].intensity <= 6
  ) {
    caseKey = classifyEmotion(allEmotions[0].type) === "positive" ? "8_1_pos" : "8_1_neg";
  } else if (allEmotions.length > 1 && avgIntensity >= 4 && avgIntensity <= 6) {
    if (positives.length === allEmotions.length) caseKey = "8_2_pos";
    else if (negatives.length === allEmotions.length) caseKey = "8_2_neg";
    else caseKey = "8_2_mix";
  } else if (positives.some(e => e.intensity >= 7) && negatives.some(e => e.intensity >= 7)) {
    caseKey = "9";
  } else {
    caseKey = "7";
  }

  const emotionsArr = allEmotions.map(e => e.type);
  const Template = TEMPLATES[caseKey as keyof typeof TEMPLATES];
  const mainColorKey = targets[0]?.colorKey || "yellow";
  return {
    jsx: Template ? Template(targets, activity, emotionsArr, mainColorKey) : null,
    mainColorKey,
  };
}

export { getEmotionTemplate };
