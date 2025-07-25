import React from "react";
import Carousel from "./Carousel";
import { highlightActivity, highlightEmotions, highlightTargets } from "@/utils/highlighters";
import { baseColors, mapEmotionToColor } from "@/constants/emotionColors";
import type { ColorKey } from "@/constants/emotionColors";

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
  // 데이터 유효성 검사
  if (!data || data.length === 0) return null;

  // null/undefined 항목 필터링
  const validData = data.filter(item => item && item.activity);
  if (validData.length === 0) return null;

  // 가장 높은 intensity의 감정 색상을 계산하는 함수
  const getHighestIntensityColor = (item: ActivityAnalysisItem): ColorKey => {
    let maxIntensity = 0;
    let maxIntensityEmotion = "";

    // 모든 감정 데이터 수집
    const allEmotions: { emotion: string; intensity: number }[] = [];

    // 사람들과의 상호작용 감정
    if (item.peoples) {
      item.peoples.forEach(person => {
        if (person && person.interactions) {
          person.interactions.emotion?.forEach((emotion, index) => {
            const intensity = person.interactions.emotion_intensity?.[index] || 0;
            allEmotions.push({ emotion, intensity });
          });
        }
      });
    }

    // 자기 감정
    if (item.self_emotions) {
      item.self_emotions.emotion?.forEach((emotion, index) => {
        const intensity = item.self_emotions.emotion_intensity?.[index] || 0;
        allEmotions.push({ emotion, intensity });
      });
    }

    // 상태 감정
    if (item.state_emotions) {
      item.state_emotions.emotion?.forEach((emotion, index) => {
        const intensity = item.state_emotions.emotion_intensity?.[index] || 0;
        allEmotions.push({ emotion, intensity });
      });
    }

    // 가장 높은 intensity 찾기
    allEmotions.forEach(({ emotion, intensity }) => {
      if (intensity > maxIntensity) {
        maxIntensity = intensity;
        maxIntensityEmotion = emotion;
      }
    });

    return maxIntensityEmotion ? mapEmotionToColor(maxIntensityEmotion) : "blue";
  };

  const generateActivityCards = () => {
    const cards: React.ReactNode[] = [];
    const emotionOnlyActivities: { activity: string; emotions: string[]; intensities: number[] }[] =
      [];

    // 활동이 1개만 있는 경우 특별 처리
    if (validData.length === 1) {
      const item = validData[0];
      const { activity, peoples, self_emotions, state_emotions } = item;
      const highestColor = getHighestIntensityColor(item);

      if (peoples && peoples.length > 0) {
        // 여러 명의 사람이 있는 경우와 1명인 경우를 구분
        if (peoples.length >= 2) {
          // 여러 명인 경우 - 기존 다중 처리 로직 사용
          const validPeoples = peoples.filter(person => person !== null);

          // 전체 분위기 감정 추가 (먼저 정의)
          const stateEmotions = state_emotions?.emotion || [];
          const selfEmotions = self_emotions?.emotion || [];

          // 감정이 있는 사람과 없는 사람 분리
          const peopleWithEmotions = validPeoples.filter(
            person => person.interactions?.emotion && person.interactions.emotion.length > 0
          );
          const peopleWithoutEmotions = validPeoples.filter(
            person => !person.interactions?.emotion || person.interactions.emotion.length === 0
          );

          // 감정이 있는 사람들 처리
          const emotionLines = peopleWithEmotions.map((person, idx) => {
            const emotions = person.interactions?.emotion || [];
            const isLast = idx === peopleWithEmotions.length - 1;
            const hasSelfOrStateEmotions = selfEmotions.length > 0 || stateEmotions.length > 0;

            // 대상이 'none'이지만 감정이 있는 경우 '누군가'로 변경
            const displayName =
              person.name === "none" && emotions.length > 0 ? "누군가" : person.name;

            return (
              <span key={person.name}>
                {idx > 0 && <br />}
                {highlightTargets([{ name: displayName, colorKey: "blue" }])}
                에게 {highlightEmotions(emotions)}을{" "}
                {isLast ? (hasSelfOrStateEmotions ? "느꼈고," : "느꼈던") : "느꼈고,"}
              </span>
            );
          });

          // 감정이 없는 사람들 처리
          let noEmotionLine = null;
          if (peopleWithoutEmotions.length > 0) {
            const displayNames = peopleWithoutEmotions.map(person => person.name);
            noEmotionLine = (
              <span key="no-emotion-people">
                <br />
                {highlightTargets(displayNames.map(name => ({ name, colorKey: "blue" })))}와
                함께했고
              </span>
            );
          }

          // 모든 라인 결합
          const allLines = [...emotionLines];
          if (noEmotionLine) {
            allLines.push(noEmotionLine);
          }

          // 전체 분위기 감정 추가
          const additionalEmotions = [];
          if (selfEmotions.length > 0) {
            additionalEmotions.push(
              <span key="self-emotions">
                <br /> 스스로에게는 {highlightEmotions(selfEmotions)}을 느꼈어요.{" "}
                {stateEmotions.length > 0 ? "" : ""}
              </span>
            );
          }

          if (stateEmotions.length > 0) {
            additionalEmotions.push(
              <span key="state-emotions">
                {selfEmotions.length > 0 ? "" : ""}
                <br /> 전체적으로 {highlightEmotions(stateEmotions)}의 분위기를
              </span>
            );
          }

          if (additionalEmotions.length > 0) {
            allLines.push(...additionalEmotions);
            allLines.push(<span key="emotion-end"> 느낀 날이었네요.</span>);
          } else {
            // 감정이 없는 경우 "그런 하루였어요" 추가
            allLines.push(<span key="no-emotion-end"> 그런 하루였어요.</span>);
          }

          cards.push(
            <div
              className="bg-white rounded-2xl shadow pl-10 pr-5 pt-5 pb-5 text-left h-full flex flex-col justify-center"
              key={activity}
            >
              <div className="w-6 h-6 mb-6 mx-auto">
                <svg
                  width="20"
                  height="16"
                  viewBox="0 0 20 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  <path
                    d="M15.5859 15.1758C14.4141 15.1758 13.418 14.7656 12.5977 13.9453C11.7773 13.125 11.3672 12.1289 11.3672 10.957C11.3672 10.7617 11.3867 10.3125 11.4258 9.60938C11.4648 8.86719 11.6406 7.98828 11.9531 6.97266C12.3047 5.95703 12.8516 4.84375 13.5938 3.63281C14.375 2.38281 15.4883 1.17188 16.9336 0H19.6875C18.9062 0.78125 18.2422 1.5625 17.6953 2.34375C17.1875 3.125 16.7578 3.84766 16.4062 4.51172C16.0156 5.25391 15.7422 5.99609 15.5859 6.73828C16.7578 6.73828 17.7539 7.14844 18.5742 7.96875C19.3945 8.78906 19.8047 9.78516 19.8047 10.957C19.8047 12.1289 19.3945 13.125 18.5742 13.9453C17.7539 14.7656 16.7578 15.1758 15.5859 15.1758ZM4.21875 15.1758C3.04688 15.1758 2.05078 14.7656 1.23047 13.9453C0.410156 13.125 0 12.1289 0 10.957C0 10.7617 0.0195312 10.3125 0.0585938 9.60938C0.0976562 8.86719 0.273438 7.98828 0.585938 6.97266C0.898438 5.95703 1.42578 4.84375 2.16797 3.63281C2.94922 2.38281 4.0625 1.17188 5.50781 0H8.26172C7.48047 0.78125 6.81641 1.5625 6.26953 2.34375C5.76172 3.125 5.35156 3.84766 5.03906 4.51172C4.64844 5.25391 4.375 5.99609 4.21875 6.73828C5.39062 6.73828 6.36719 7.14844 7.14844 7.96875C7.96875 8.78906 8.37891 9.78516 8.37891 10.957C8.37891 12.1289 7.96875 13.125 7.14844 13.9453C6.36719 14.7656 5.39062 15.1758 4.21875 15.1758Z"
                    fill={baseColors[highestColor]}
                  />
                </svg>
              </div>
              <div className="text-gray-800 dark:text-gray-300 text-base leading-relaxed text-left">
                오늘 {highlightActivity(activity)}에서
                <br /> {allLines as React.ReactNode[]}
              </div>
            </div>
          );
        } else {
          // 1명인 경우 - 기존 로직 유지
          const person = peoples[0];
          const emotions = person.interactions.emotion || [];
          const selfEmotions = self_emotions.emotion || [];
          const stateEmotions = state_emotions.emotion || [];

          // 각 감정 데이터의 존재 여부 확인
          const hasPersonEmotions = emotions.length > 0;
          const hasSelfEmotions = selfEmotions.length > 0;
          const hasStateEmotions = stateEmotions.length > 0;

          // 대상이 'none'이지만 감정이 있는 경우 '누군가'로 변경
          const displayName = person.name === "none" && hasPersonEmotions ? "누군가" : person.name;

          cards.push(
            <div
              className="bg-white rounded-2xl shadow pl-8 pr-5 pt-5 pb-5 text-left h-full flex flex-col justify-center"
              key="single-activity-single-person"
            >
              <div className="w-6 h-6 mb-6 mx-auto">
                <svg
                  width="20"
                  height="16"
                  viewBox="0 0 20 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  <path
                    d="M15.5859 15.1758C14.4141 15.1758 13.418 14.7656 12.5977 13.9453C11.7773 13.125 11.3672 12.1289 11.3672 10.957C11.3672 10.7617 11.3867 10.3125 11.4258 9.60938C11.4648 8.86719 11.6406 7.98828 11.9531 6.97266C12.3047 5.95703 12.8516 4.84375 13.5938 3.63281C14.375 2.38281 15.4883 1.17188 16.9336 0H19.6875C18.9062 0.78125 18.2422 1.5625 17.6953 2.34375C17.1875 3.125 16.7578 3.84766 16.4062 4.51172C16.0156 5.25391 15.7422 5.99609 15.5859 6.73828C16.7578 6.73828 17.7539 7.14844 18.5742 7.96875C19.3945 8.78906 19.8047 9.78516 19.8047 10.957C19.8047 12.1289 19.3945 13.125 18.5742 13.9453C17.7539 14.7656 16.7578 15.1758 15.5859 15.1758ZM4.21875 15.1758C3.04688 15.1758 2.05078 14.7656 1.23047 13.9453C0.410156 13.125 0 12.1289 0 10.957C0 10.7617 0.0195312 10.3125 0.0585938 9.60938C0.0976562 8.86719 0.273438 7.98828 0.585938 6.97266C0.898438 5.95703 1.42578 4.84375 2.16797 3.63281C2.94922 2.38281 4.0625 1.17188 5.50781 0H8.26172C7.48047 0.78125 6.81641 1.5625 6.26953 2.34375C5.76172 3.125 5.35156 3.84766 5.03906 4.51172C4.64844 5.25391 4.375 5.99609 4.21875 6.73828C5.39062 6.73828 6.36719 7.14844 7.14844 7.96875C7.96875 8.78906 8.37891 9.78516 8.37891 10.957C8.37891 12.1289 7.96875 13.125 7.14844 13.9453C6.36719 14.7656 5.39062 15.1758 4.21875 15.1758Z"
                    fill={baseColors[highestColor]}
                  />
                </svg>
              </div>
              <div className="text-gray-800 text-base leading-relaxed">
                {highlightActivity(activity)}에서 <br />
                {highlightTargets([{ name: displayName, colorKey: "blue" }])}에게{" "}
                {hasPersonEmotions ? <>{highlightEmotions(emotions)}을 느꼈고,</> : <>함께했고</>}
                {hasSelfEmotions && (
                  <>
                    {" "}
                    <br />
                    나에게는 {highlightEmotions(selfEmotions)}을 느끼고
                  </>
                )}
                {hasStateEmotions && (
                  <>
                    {" "}
                    <br />
                    전체적으로 {highlightEmotions(stateEmotions)}의 분위기를 느꼈어요.
                  </>
                )}
                {!hasStateEmotions && (hasPersonEmotions || hasSelfEmotions) && <>느꼈어요.</>}
              </div>
            </div>
          );
        }
      } else {
        // 대상이 없는 경우도 처리
        const selfEmotions = self_emotions?.emotion || [];
        const stateEmotions = state_emotions?.emotion || [];
        const allEmotions = [...selfEmotions, ...stateEmotions];

        if (allEmotions.length > 0) {
          cards.push(
            <div
              className="bg-white rounded-2xl shadow pl-8 pr-5 pt-5 pb-5 text-left h-full flex flex-col justify-center"
              key="single-activity-no-target"
            >
              <div className="w-6 h-6 mb-6 mx-auto">
                <svg
                  width="20"
                  height="16"
                  viewBox="0 0 20 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  <path
                    d="M15.5859 15.1758C14.4141 15.1758 13.418 14.7656 12.5977 13.9453C11.7773 13.125 11.3672 12.1289 11.3672 10.957C11.3672 10.7617 11.3867 10.3125 11.4258 9.60938C11.4648 8.86719 11.6406 7.98828 11.9531 6.97266C12.3047 5.95703 12.8516 4.84375 13.5938 3.63281C14.375 2.38281 15.4883 1.17188 16.9336 0H19.6875C18.9062 0.78125 18.2422 1.5625 17.6953 2.34375C17.1875 3.125 16.7578 3.84766 16.4062 4.51172C16.0156 5.25391 15.7422 5.99609 15.5859 6.73828C16.7578 6.73828 17.7539 7.14844 18.5742 7.96875C19.3945 8.78906 19.8047 9.78516 19.8047 10.957C19.8047 12.1289 19.3945 13.125 18.5742 13.9453C17.7539 14.7656 16.7578 15.1758 15.5859 15.1758ZM4.21875 15.1758C3.04688 15.1758 2.05078 14.7656 1.23047 13.9453C0.410156 13.125 0 12.1289 0 10.957C0 10.7617 0.0195312 10.3125 0.0585938 9.60938C0.0976562 8.86719 0.273438 7.98828 0.585938 6.97266C0.898438 5.95703 1.42578 4.84375 2.16797 3.63281C2.94922 2.38281 4.0625 1.17188 5.50781 0H8.26172C7.48047 0.78125 6.81641 1.5625 6.26953 2.34375C5.76172 3.125 5.35156 3.84766 5.03906 4.51172C4.64844 5.25391 4.375 5.99609 4.21875 6.73828C5.39062 6.73828 6.36719 7.14844 7.14844 7.96875C7.96875 8.78906 8.37891 9.78516 8.37891 10.957C8.37891 12.1289 7.96875 13.125 7.14844 13.9453C6.36719 14.7656 5.39062 15.1758 4.21875 15.1758Z"
                    fill={baseColors[highestColor]}
                  />
                </svg>
              </div>
              <div className="text-gray-800 dark:text-gray-300 text-base leading-relaxed text-left">
                오늘 {highlightActivity(activity)}에서 <br /> {highlightEmotions(allEmotions)}을
                느꼈어요.
              </div>
            </div>
          );
        }
      }
      return cards; // Return the cards generated for the single activity case
    }

    // 활동별로 카드 생성
    for (const item of validData) {
      const { activity, peoples, self_emotions, state_emotions } = item;
      const highestColor = getHighestIntensityColor(item);

      if (peoples && peoples.length > 0) {
        // 대상이 있는 경우
        console.log(`🔍 Activity: ${activity}, People count: ${peoples.length}`);
        console.log(`🔍 Peoples:`, peoples);

        if (peoples.length >= 2) {
          console.log(`🔍 Processing as multiple people (${peoples.length} people)`);
          // 1-1. 2명 이상인 경우

          const validPeoples = peoples.filter(person => person !== null);

          // 전체 분위기 감정 추가 (먼저 정의)
          const stateEmotions = state_emotions?.emotion || [];
          const selfEmotions = self_emotions?.emotion || [];

          // 감정이 있는 사람과 없는 사람 분리
          const peopleWithEmotions = validPeoples.filter(
            person => person.interactions?.emotion && person.interactions.emotion.length > 0
          );
          const peopleWithoutEmotions = validPeoples.filter(
            person => !person.interactions?.emotion || person.interactions.emotion.length === 0
          );

          // 감정이 있는 사람들 처리
          const emotionLines = peopleWithEmotions.map((person, idx) => {
            const emotions = person.interactions?.emotion || [];
            const isLast = idx === peopleWithEmotions.length - 1;
            const hasSelfOrStateEmotions = selfEmotions.length > 0 || stateEmotions.length > 0;

            // 대상이 'none'이지만 감정이 있는 경우 '누군가'로 변경
            const displayName =
              person.name === "none" && emotions.length > 0 ? "누군가" : person.name;

            return (
              <span key={person.name}>
                {idx > 0 && <br />}
                {highlightTargets([{ name: displayName, colorKey: "blue" }])}
                에게 {highlightEmotions(emotions)}을{" "}
                {isLast ? (hasSelfOrStateEmotions ? "느꼈고," : "느꼈던") : "느꼈고,"}
              </span>
            );
          });

          // 감정이 없는 사람들 처리
          let noEmotionLine = null;
          if (peopleWithoutEmotions.length > 0) {
            const displayNames = peopleWithoutEmotions.map(person => person.name);
            noEmotionLine = (
              <span key="no-emotion-people">
                {highlightTargets(displayNames.map(name => ({ name, colorKey: "blue" })))}와
                함께했고
              </span>
            );
          }

          // 모든 라인 결합
          const allLines = [...emotionLines];
          if (noEmotionLine) {
            allLines.push(noEmotionLine);
          }

          // 전체 분위기 감정 추가
          const additionalEmotions = [];
          if (selfEmotions.length > 0) {
            additionalEmotions.push(
              <span key="self-emotions">
                <br />
                스스로는 {highlightEmotions(selfEmotions)}을{" "}
                {stateEmotions.length > 0 ? "느꼈어요. " : ""}
              </span>
            );
          }

          if (stateEmotions.length > 0) {
            additionalEmotions.push(
              <span key="state-emotions">
                {selfEmotions.length > 0 ? (
                  <>
                    <br />
                  </>
                ) : (
                  <>
                    <br />
                  </>
                )}
                전체적으로 {highlightEmotions(stateEmotions)}의 분위기를
              </span>
            );
          }

          if (additionalEmotions.length > 0) {
            allLines.push(...additionalEmotions);
            allLines.push(<span key="emotion-end"> 느꼈어요.</span>);
          } else {
            // 감정이 없는 경우 "그런 하루였어요" 추가
            allLines.push(<span key="no-emotion-end"> 그런 하루였어요.</span>);
          }

          cards.push(
            <div
              className="bg-white rounded-2xl shadow pl-10 pr-5 pt-5 pb-5 text-left h-full flex flex-col justify-center"
              key={activity}
            >
              <div className="w-6 h-6 mb-6 mx-auto">
                <svg
                  width="20"
                  height="16"
                  viewBox="0 0 20 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  <path
                    d="M15.5859 15.1758C14.4141 15.1758 13.418 14.7656 12.5977 13.9453C11.7773 13.125 11.3672 12.1289 11.3672 10.957C11.3672 10.7617 11.3867 10.3125 11.4258 9.60938C11.4648 8.86719 11.6406 7.98828 11.9531 6.97266C12.3047 5.95703 12.8516 4.84375 13.5938 3.63281C14.375 2.38281 15.4883 1.17188 16.9336 0H19.6875C18.9062 0.78125 18.2422 1.5625 17.6953 2.34375C17.1875 3.125 16.7578 3.84766 16.4062 4.51172C16.0156 5.25391 15.7422 5.99609 15.5859 6.73828C16.7578 6.73828 17.7539 7.14844 18.5742 7.96875C19.3945 8.78906 19.8047 9.78516 19.8047 10.957C19.8047 12.1289 19.3945 13.125 18.5742 13.9453C17.7539 14.7656 16.7578 15.1758 15.5859 15.1758ZM4.21875 15.1758C3.04688 15.1758 2.05078 14.7656 1.23047 13.9453C0.410156 13.125 0 12.1289 0 10.957C0 10.7617 0.0195312 10.3125 0.0585938 9.60938C0.0976562 8.86719 0.273438 7.98828 0.585938 6.97266C0.898438 5.95703 1.42578 4.84375 2.16797 3.63281C2.94922 2.38281 4.0625 1.17188 5.50781 0H8.26172C7.48047 0.78125 6.81641 1.5625 6.26953 2.34375C5.76172 3.125 5.35156 3.84766 5.03906 4.51172C4.64844 5.25391 4.375 5.99609 4.21875 6.73828C5.39062 6.73828 6.36719 7.14844 7.14844 7.96875C7.96875 8.78906 8.37891 9.78516 8.37891 10.957C8.37891 12.1289 7.96875 13.125 7.14844 13.9453C6.36719 14.7656 5.39062 15.1758 4.21875 15.1758Z"
                    fill={baseColors[highestColor]}
                  />
                </svg>
              </div>
              <div className="text-gray-800 dark:text-gray-300 text-base leading-relaxed text-left">
                오늘 {highlightActivity(activity)}에서
                <br /> {allLines as React.ReactNode[]}
              </div>
            </div>
          );
        } else {
          // 1-2. 1명인 경우
          const person = peoples[0];
          if (!person) return; // person이 null인 경우 건너뛰기

          const emotions = person.interactions?.emotion || [];
          const selfEmotions = self_emotions?.emotion || [];
          const stateEmotions = state_emotions?.emotion || [];

          // displayName 설정 (none인 경우 "누군가"로 변경)
          let displayName = person.name;
          if (person.name === "none" && emotions.length > 0) {
            displayName = "누군가";
          }

          cards.push(
            <div
              className="bg-white rounded-2xl shadow pl-7 pr-5 pt-5 pb-5 text-left h-full flex flex-col justify-center"
              key={activity}
            >
              <div className="w-6 h-6 mb-6 mx-auto">
                <svg
                  width="20"
                  height="16"
                  viewBox="0 0 20 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  <path
                    d="M15.5859 15.1758C14.4141 15.1758 13.418 14.7656 12.5977 13.9453C11.7773 13.125 11.3672 12.1289 11.3672 10.957C11.3672 10.7617 11.3867 10.3125 11.4258 9.60938C11.4648 8.86719 11.6406 7.98828 11.9531 6.97266C12.3047 5.95703 12.8516 4.84375 13.5938 3.63281C14.375 2.38281 15.4883 1.17188 16.9336 0H19.6875C18.9062 0.78125 18.2422 1.5625 17.6953 2.34375C17.1875 3.125 16.7578 3.84766 16.4062 4.51172C16.0156 5.25391 15.7422 5.99609 15.5859 6.73828C16.7578 6.73828 17.7539 7.14844 18.5742 7.96875C19.3945 8.78906 19.8047 9.78516 19.8047 10.957C19.8047 12.1289 19.3945 13.125 18.5742 13.9453C17.7539 14.7656 16.7578 15.1758 15.5859 15.1758ZM4.21875 15.1758C3.04688 15.1758 2.05078 14.7656 1.23047 13.9453C0.410156 13.125 0 12.1289 0 10.957C0 10.7617 0.0195312 10.3125 0.0585938 9.60938C0.0976562 8.86719 0.273438 7.98828 0.585938 6.97266C0.898438 5.95703 1.42578 4.84375 2.16797 3.63281C2.94922 2.38281 4.0625 1.17188 5.50781 0H8.26172C7.48047 0.78125 6.81641 1.5625 6.26953 2.34375C5.76172 3.125 5.35156 3.84766 5.03906 4.51172C4.64844 5.25391 4.375 5.99609 4.21875 6.73828C5.39062 6.73828 6.36719 7.14844 7.14844 7.96875C7.96875 8.78906 8.37891 9.78516 8.37891 10.957C8.37891 12.1289 7.96875 13.125 7.14844 13.9453C6.36719 14.7656 5.39062 15.1758 4.21875 15.1758Z"
                    fill={baseColors[highestColor]}
                  />
                </svg>
              </div>
              <div className="text-gray-800 dark:text-gray-300 text-base leading-relaxed text-left">
                오늘 {highlightActivity(activity)}에서는 <br />
                {highlightTargets([{ name: displayName, colorKey: "blue" }])}와{" "}
                {emotions.length > 0 ? (
                  <>{highlightEmotions(emotions)}을 느꼈어요.</>
                ) : (
                  <>함께했어요.</>
                )}
                {selfEmotions.length > 0 && (
                  <>
                    <br />
                    스스로는 {highlightEmotions(selfEmotions)}을
                  </>
                )}
                {stateEmotions.length > 0 && (
                  <>
                    {selfEmotions.length > 0 ? "," : ""}
                    <br /> 전체적으로 {highlightEmotions(stateEmotions)}의 분위기를{" "}
                  </>
                )}
                {(selfEmotions.length > 0 || stateEmotions.length > 0) && <>느꼈어요.</>}
                {emotions.length === 0 &&
                  selfEmotions.length === 0 &&
                  stateEmotions.length === 0 && <> 그런 하루였어요.</>}
              </div>
            </div>
          );
        }
      } else {
        // 1-3. 대상이 없는 경우 - 마지막에 묶어서 처리
        const selfEmotions = self_emotions?.emotion || [];
        const stateEmotions = state_emotions?.emotion || [];
        const allEmotions = [...selfEmotions, ...stateEmotions];

        if (allEmotions.length > 0) {
          const intensities = [
            ...(self_emotions?.emotion_intensity || []),
            ...(state_emotions?.emotion_intensity || []),
          ];

          emotionOnlyActivities.push({
            activity,
            emotions: allEmotions,
            intensities,
          });
        }
      }
    }

    // 대상 없는 활동들 처리
    if (emotionOnlyActivities.length > 0) {
      // 대상이 있는 활동이 있는지 확인
      const hasTargetActivities = validData.some(item => item.peoples && item.peoples.length > 0);

      if (emotionOnlyActivities.length === 1) {
        // 활동이 1개인 경우 - 개별 카드로 표시
        const { activity, emotions, intensities } = emotionOnlyActivities[0];

        // 가장 높은 intensity의 감정 색상 계산
        let maxIntensity = 0;
        let maxIntensityEmotion = "";

        emotions.forEach((emotion, index) => {
          const intensity = intensities[index] || 0;
          if (intensity > maxIntensity) {
            maxIntensity = intensity;
            maxIntensityEmotion = emotion;
          }
        });

        const highestColor = maxIntensityEmotion ? mapEmotionToColor(maxIntensityEmotion) : "blue";

        const combined = emotionOnlyActivities.map(({ activity: activityName, emotions }, idx) => {
          const emotionElements = highlightEmotions(emotions);
          return (
            <span key={activityName + idx} className="text-base">
              {highlightActivity(activityName)}에서 {emotionElements}
              {idx < emotionOnlyActivities.length - 1 ? ", " : ""}
              {idx < emotionOnlyActivities.length - 1 && <br />}
            </span>
          );
        });

        cards.push(
          <div
            className="bg-white rounded-2xl shadow pl-10 pr-5 pt-5 pb-5 text-center h-full flex flex-col justify-center"
            key={`no-target-${activity}`}
          >
            <div className="w-6 h-6 mb-6 mx-auto">
              <svg
                width="20"
                height="16"
                viewBox="0 0 20 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <path
                  d="M15.5859 15.1758C14.4141 15.1758 13.418 14.7656 12.5977 13.9453C11.7773 13.125 11.3672 12.1289 11.3672 10.957C11.3672 10.7617 11.3867 10.3125 11.4258 9.60938C11.4648 8.86719 11.6406 7.98828 11.9531 6.97266C12.3047 5.95703 12.8516 4.84375 13.5938 3.63281C14.375 2.38281 15.4883 1.17188 16.9336 0H19.6875C18.9062 0.78125 18.2422 1.5625 17.6953 2.34375C17.1875 3.125 16.7578 3.84766 16.4062 4.51172C16.0156 5.25391 15.7422 5.99609 15.5859 6.73828C16.7578 6.73828 17.7539 7.14844 18.5742 7.96875C19.3945 8.78906 19.8047 9.78516 19.8047 10.957C19.8047 12.1289 19.3945 13.125 18.5742 13.9453C17.7539 14.7656 16.7578 15.1758 15.5859 15.1758ZM4.21875 15.1758C3.04688 15.1758 2.05078 14.7656 1.23047 13.9453C0.410156 13.125 0 12.1289 0 10.957C0 10.7617 0.0195312 10.3125 0.0585938 9.60938C0.0976562 8.86719 0.273438 7.98828 0.585938 6.97266C0.898438 5.95703 1.42578 4.84375 2.16797 3.63281C2.94922 2.38281 4.0625 1.17188 5.50781 0H8.26172C7.48047 0.78125 6.81641 1.5625 6.26953 2.34375C5.76172 3.125 5.35156 3.84766 5.03906 4.51172C4.64844 5.25391 4.375 5.99609 4.21875 6.73828C5.39062 6.73828 6.36719 7.14844 7.14844 7.96875C7.96875 8.78906 8.37891 9.78516 8.37891 10.957C8.37891 12.1289 7.96875 13.125 7.14844 13.9453C6.36719 14.7656 5.39062 15.1758 4.21875 15.1758Z"
                  fill={baseColors[highestColor]}
                />
              </svg>
            </div>
            <div className="text-gray-800 text-base leading-relaxed text-left">
              오늘 {highlightActivity(activity)}에서 <br /> {highlightEmotions(emotions)}을
              느꼈어요.
            </div>
          </div>
        );
      } else if (hasTargetActivities && emotionOnlyActivities.length > 1) {
        // 대상이 있는 활동이 있고, 대상 없는 활동이 여러 개인 경우 - "그 이외에"로 묶어서 표시
        // 가장 높은 intensity의 감정 색상 계산
        let maxIntensity = 0;
        let maxIntensityEmotion = "";

        emotionOnlyActivities.forEach(({ emotions, intensities }) => {
          emotions.forEach((emotion, index) => {
            const intensity = intensities[index] || 0;
            if (intensity > maxIntensity) {
              maxIntensity = intensity;
              maxIntensityEmotion = emotion;
            }
          });
        });

        const highestColor = maxIntensityEmotion ? mapEmotionToColor(maxIntensityEmotion) : "blue";

        const combined = emotionOnlyActivities.map(({ activity: activityName, emotions }, idx) => {
          const emotionElements = highlightEmotions(emotions);
          return (
            <span key={activityName + idx} className="text-base">
              {highlightActivity(activityName)}에서 {emotionElements}
              {idx < emotionOnlyActivities.length - 1 ? ", " : ""}
              {idx < emotionOnlyActivities.length - 1 && <br />}
            </span>
          );
        });

        cards.push(
          <div
            className="bg-white rounded-2xl shadow pl-10 pr-7 pt-5 pb-5 text-left h-full flex flex-col justify-center"
            key="multiple-no-target"
          >
            <div className="w-6 h-6 mb-6 mx-auto">
              <svg
                width="20"
                height="16"
                viewBox="0 0 20 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <path
                  d="M15.5859 15.1758C14.4141 15.1758 13.418 14.7656 12.5977 13.9453C11.7773 13.125 11.3672 12.1289 11.3672 10.957C11.3672 10.7617 11.3867 10.3125 11.4258 9.60938C11.4648 8.86719 11.6406 7.98828 11.9531 6.97266C12.3047 5.95703 12.8516 4.84375 13.5938 3.63281C14.375 2.38281 15.4883 1.17188 16.9336 0H19.6875C18.9062 0.78125 18.2422 1.5625 17.6953 2.34375C17.1875 3.125 16.7578 3.84766 16.4062 4.51172C16.0156 5.25391 15.7422 5.99609 15.5859 6.73828C16.7578 6.73828 17.7539 7.14844 18.5742 7.96875C19.3945 8.78906 19.8047 9.78516 19.8047 10.957C19.8047 12.1289 19.3945 13.125 18.5742 13.9453C17.7539 14.7656 16.7578 15.1758 15.5859 15.1758ZM4.21875 15.1758C3.04688 15.1758 2.05078 14.7656 1.23047 13.9453C0.410156 13.125 0 12.1289 0 10.957C0 10.7617 0.0195312 10.3125 0.0585938 9.60938C0.0976562 8.86719 0.273438 7.98828 0.585938 6.97266C0.898438 5.95703 1.42578 4.84375 2.16797 3.63281C2.94922 2.38281 4.0625 1.17188 5.50781 0H8.26172C7.48047 0.78125 6.81641 1.5625 6.26953 2.34375C5.76172 3.125 5.35156 3.84766 5.03906 4.51172C4.64844 5.25391 4.375 5.99609 4.21875 6.73828C5.39062 6.73828 6.36719 7.14844 7.14844 7.96875C7.96875 8.78906 8.37891 9.78516 8.37891 10.957C8.37891 12.1289 7.96875 13.125 7.14844 13.9453C6.36719 14.7656 5.39062 15.1758 4.21875 15.1758Z"
                  fill={baseColors[highestColor]}
                />
              </svg>
            </div>
            <div className="text-gray-800 text-base leading-relaxed">
              그 이외에 {combined as React.ReactNode[]}을 느꼈어요.
            </div>
          </div>
        );
      } else {
        // 대상이 없는 활동만 있는 경우 - 각각 개별 카드로 표시
        emotionOnlyActivities.forEach(({ activity, emotions, intensities }) => {
          // 가장 높은 intensity의 감정 색상 계산
          let maxIntensity = 0;
          let maxIntensityEmotion = "";

          emotions.forEach((emotion, index) => {
            const intensity = intensities[index] || 0;
            if (intensity > maxIntensity) {
              maxIntensity = intensity;
              maxIntensityEmotion = emotion;
            }
          });

          const highestColor = maxIntensityEmotion
            ? mapEmotionToColor(maxIntensityEmotion)
            : "blue";

          cards.push(
            <div
              className="bg-white rounded-2xl shadow pl-10 pr-5 pt-5 pb-5 text-center h-full flex flex-col justify-center"
              key={`no-target-${activity}`}
            >
              <div className="w-6 h-6 mb-6 mx-auto">
                <svg
                  width="20"
                  height="16"
                  viewBox="0 0 20 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  <path
                    d="M15.5859 15.1758C14.4141 15.1758 13.418 14.7656 12.5977 13.9453C11.7773 13.125 11.3672 12.1289 11.3672 10.957C11.3672 10.7617 11.3867 10.3125 11.4258 9.60938C11.4648 8.86719 11.6406 7.98828 11.9531 6.97266C12.3047 5.95703 12.8516 4.84375 13.5938 3.63281C14.375 2.38281 15.4883 1.17188 16.9336 0H19.6875C18.9062 0.78125 18.2422 1.5625 17.6953 2.34375C17.1875 3.125 16.7578 3.84766 16.4062 4.51172C16.0156 5.25391 15.7422 5.99609 15.5859 6.73828C16.7578 6.73828 17.7539 7.14844 18.5742 7.96875C19.3945 8.78906 19.8047 9.78516 19.8047 10.957C19.8047 12.1289 19.3945 13.125 18.5742 13.9453C17.7539 14.7656 16.7578 15.1758 15.5859 15.1758ZM4.21875 15.1758C3.04688 15.1758 2.05078 14.7656 1.23047 13.9453C0.410156 13.125 0 12.1289 0 10.957C0 10.7617 0.0195312 10.3125 0.0585938 9.60938C0.0976562 8.86719 0.273438 7.98828 0.585938 6.97266C0.898438 5.95703 1.42578 4.84375 2.16797 3.63281C2.94922 2.38281 4.0625 1.17188 5.50781 0H8.26172C7.48047 0.78125 6.81641 1.5625 6.26953 2.34375C5.76172 3.125 5.35156 3.84766 5.03906 4.51172C4.64844 5.25391 4.375 5.99609 4.21875 6.73828C5.39062 6.73828 6.36719 7.14844 7.14844 7.96875C7.96875 8.78906 8.37891 9.78516 8.37891 10.957C8.37891 12.1289 7.96875 13.125 7.14844 13.9453C6.36719 14.7656 5.39062 15.1758 4.21875 15.1758Z"
                    fill={baseColors[highestColor]}
                  />
                </svg>
              </div>
              <div className="text-gray-800 dark:text-gray-300 text-base leading-relaxed text-left">
                오늘 {highlightActivity(activity)}에서 <br /> {highlightEmotions(emotions)}을
                느꼈어요.
              </div>
            </div>
          );
        });
      }
    }

    return cards;
  };

  const cardList = generateActivityCards();

  return (
    <div className="mb-6">
      <Carousel items={cardList} />
    </div>
  );
};

export default ActivityAnalysisCard;
