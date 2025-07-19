// 활동 기반 감정 카드 템플릿 생성기
import React from "react";
import { highlightActivity, highlightEmotions, highlightTargets } from "./highlighters";

// 타입 정의
interface EmotionData {
  type: string;
  intensity: number;
}

interface Person {
  name: string;
  emotion: string;
  intensity: number;
  colorKey: string;
}

interface ActivityGroup {
  activity: string;
  persons: Person[];
  selfEmotions?: EmotionData[];
  stateEmotions?: EmotionData[];
}

// 마지막 카드용 타입 (대상 없는 활동 모음)
interface EmotionOnlyActivity {
  activity: string;
  emotions: EmotionData[];
}

function generateActivityTemplates(
  groupedActivities: ActivityGroup[],
  emotionOnlyActivities: EmotionOnlyActivity[]
): React.ReactNode[] {
  const cards: React.ReactNode[] = [];

  // 1. 활동별 카드 생성
  for (const group of groupedActivities) {
    const { activity, persons, selfEmotions = [], stateEmotions = [] } = group;

    if (persons.length >= 2) {
      // 🎯 대상이 2명 이상일 경우 → 각각 감정 표현
      const lines = persons.map((p, i) => (
        <>
          {i > 0 && " 그리고 "}
          {highlightTargets([{ name: p.name, colorKey: p.colorKey }])}에게{" "}
          {highlightEmotions([p.emotion])}을 느꼈고
        </>
      ));

      cards.push(
        <div className="text-base leading-relaxed text-gray-800" key={activity}>
          오늘 {highlightActivity(activity, persons[0].colorKey)}에서, {lines} 그런 하루였어요.
        </div>
      );
    } else if (persons.length === 1) {
      // 🎯 대상이 1명일 경우 + self, state 감정
      const p = persons[0];
      cards.push(
        <div className="text-base leading-relaxed text-gray-800" key={activity}>
          이 {highlightActivity(activity, p.colorKey)}에서는{" "}
          {highlightTargets([{ name: p.name, colorKey: p.colorKey }])}에게{" "}
          {highlightEmotions([p.emotion])}을 느꼈고,
          {highlightEmotions(selfEmotions.map(e => e.type))},{" "}
          {highlightEmotions(stateEmotions.map(e => e.type))} 감정도 스쳤어요.
        </div>
      );
    }
  }

  // 2. 대상 없는 활동들 한 카드로 묶기
  if (emotionOnlyActivities.length > 0) {
    const combined = emotionOnlyActivities.map(({ activity, emotions }, idx) => (
      <div key={activity + idx}>
        {highlightActivity(activity, "yellow")}에서{" "}
        {highlightEmotions(emotions.map(e => `${e.type}(${e.intensity})`))}
      </div>
    ));

    cards.push(
      <div className="text-base leading-relaxed text-gray-800" key="no-target">
        오늘은 아래 활동들 속에서 감정들이 스쳐갔어요:
        <div className="pl-2 mt-1 space-y-1">{combined}</div>
      </div>
    );
  }

  // 3. 활동이 1개만 있는 경우 - 여기선 별도 핸들링 가능 (상황에 따라 확장)
  // 추후 if (groupedActivities.length === 1) {} 등의 분기 추가 가능

  return cards;
}

export { generateActivityTemplates };

// PeopleCard용 템플릿 함수
interface GetEmotionTemplateParams {
  activity: string;
  peoples: Person[];
}

export function getEmotionTemplate({ activity, peoples }: GetEmotionTemplateParams): {
  jsx: React.ReactNode;
  mainColorKey: string;
} {
  if (!peoples || peoples.length === 0) {
    return {
      jsx: <span>활동 정보가 없습니다.</span>,
      mainColorKey: "yellow",
    };
  }

  const person = peoples[0]; // 첫 번째 사람 사용
  const colorKey = person.colorKey || "yellow";

  const jsx = (
    <span>
      {highlightActivity(activity, colorKey)}에서{" "}
      {highlightTargets([{ name: person.name, colorKey: person.colorKey }])}에게{" "}
      {highlightEmotions([person.emotion])}을 느꼈어요.
    </span>
  );

  return {
    jsx,
    mainColorKey: colorKey,
  };
}
