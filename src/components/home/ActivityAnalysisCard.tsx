import React from "react";
import Carousel from "./Carousel";
import { highlightActivity, highlightEmotions, highlightTargets } from "@/utils/highlighters";

interface ActivityAnalysisPerson {
  name: string;
  name_intimacy: string;
  interactions: {
    emotion: string[];
    emotion_intensity: number[];
  };
}

interface ActivityAnalysisItem {
  activity: string;
  peoples: ActivityAnalysisPerson[];
  problem: Array<{
    situation: string;
    approach: string;
    outcome: string;
    conflict_response_code: string;
  }>;
  self_emotions: {
    emotion: string[];
    emotion_intensity: number[];
  };
  state_emotions: {
    emotion: string[];
    emotion_intensity: number[];
  };
  strength: string;
}

const ActivityAnalysisCard: React.FC<{ data?: ActivityAnalysisItem[] }> = ({ data = [] }) => {
  if (!data || data.length === 0) return null;

  const generateActivityCards = () => {
    const cards: React.ReactNode[] = [];
    const emotionOnlyActivities: { activity: string; emotions: string[]; intensities: number[] }[] =
      [];

    // 활동이 1개만 있는 경우 특별 처리
    if (data.length === 1) {
      const item = data[0];
      const { activity, peoples, self_emotions, state_emotions } = item;

      if (peoples && peoples.length > 0) {
        const person = peoples[0];
        const emotions = person.interactions.emotion;
        const selfEmotions = self_emotions.emotion;
        const stateEmotions = state_emotions.emotion;

        return [
          <div
            className="bg-white rounded-2xl shadow p-5 text-center h-[200px] flex flex-col justify-center"
            key="single-activity"
          >
            <div className="text-gray-800 text-base leading-relaxed">
              오늘 {highlightActivity(activity, "green")}에서 <br />
              {highlightTargets([{ name: person.name, colorKey: "blue" }])}에게{" "}
              {highlightEmotions(emotions)}을 느꼈고,
              <br />
              {selfEmotions.length > 0 && (
                <>
                  나 자신에게서도 {highlightEmotions(selfEmotions)}이 떠올랐고,
                  <br />
                </>
              )}
              {stateEmotions.length > 0 && (
                <>주변 분위기에서는 {highlightEmotions(stateEmotions)}이 느껴졌어요.</>
              )}
            </div>
          </div>,
        ];
      }
    }

    // 활동별로 카드 생성
    for (const item of data) {
      const { activity, peoples, self_emotions, state_emotions } = item;

      if (peoples && peoples.length > 0) {
        // 대상이 있는 경우
        if (peoples.length >= 2) {
          // 1-1. 2명 이상인 경우
          const peopleLines = peoples.map((person, idx) => {
            const emotions = person.interactions.emotion;

            return (
              <span key={person.name}>
                {idx > 0 && " 그리고 "}
                {highlightTargets([{ name: person.name, colorKey: "blue" }])}에게{" "}
                {highlightEmotions(emotions)}을 느꼈고
              </span>
            );
          });

          cards.push(
            <div
              className="bg-white rounded-2xl shadow p-5 text-center h-[200px] flex flex-col justify-center"
              key={activity}
            >
              <div className="text-gray-800 text-base leading-relaxed">
                이 {highlightActivity(activity, "green")}에서 오늘{" "}
                {highlightActivity(activity, "green")}에서, {peopleLines} 그런 하루였어요.
              </div>
            </div>
          );
        } else {
          // 1-2. 1명인 경우
          const person = peoples[0];
          const emotions = person.interactions.emotion;
          const selfEmotions = self_emotions.emotion;
          const stateEmotions = state_emotions.emotion;

          cards.push(
            <div
              className="bg-white rounded-2xl shadow p-5 text-center h-[200px] flex flex-col justify-center"
              key={activity}
            >
              <div className="text-gray-800 text-base leading-relaxed">
                이 {highlightActivity(activity, "green")}에는{" "}
                {highlightTargets([{ name: person.name, colorKey: "blue" }])}에게{" "}
                {highlightEmotions(emotions)}을 느꼈고 활동에서 {highlightEmotions(selfEmotions)},{" "}
                {highlightEmotions(stateEmotions)}을 느꼈어요.
              </div>
            </div>
          );
        }
      } else {
        // 1-3. 대상이 없는 경우 - 마지막에 묶어서 처리
        const allEmotions = [...self_emotions.emotion, ...state_emotions.emotion];

        if (allEmotions.length > 0) {
          const intensities = [
            ...self_emotions.emotion_intensity,
            ...state_emotions.emotion_intensity,
          ];

          emotionOnlyActivities.push({
            activity,
            emotions: allEmotions,
            intensities,
          });
        }
      }
    }

    // 대상 없는 활동들 마지막 카드로 묶기
    if (emotionOnlyActivities.length > 0) {
      const combined = emotionOnlyActivities.map(({ activity, emotions, intensities }, idx) => (
        <div key={activity + idx} className="text-sm">
          {highlightActivity(activity, "yellow")}에서{" "}
          {highlightEmotions(
            emotions.map((emotion, emotionIdx) => `${emotion}(${intensities[emotionIdx] || 5})`)
          )}
        </div>
      ));

      cards.push(
        <div
          className="bg-white rounded-2xl shadow p-5 text-center h-[200px] flex flex-col justify-center"
          key="no-target"
        >
          <div className="text-gray-800 text-base leading-relaxed">
            그 이외에 {combined}를 느꼈어요.
          </div>
        </div>
      );
    }

    return cards;
  };

  const cardList = generateActivityCards();

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 px-4">오늘의 활동 분석</h2>
      <Carousel items={cardList} />
    </div>
  );
};

export default ActivityAnalysisCard;
