import * as React from "react";
import Carousel from "./Carousel";
import { getEmotionTemplate } from "@/utils/emotionTemplate.tsx";
import { baseColors } from "@/constants/emotionColors";
import type { ColorKey } from "@/constants/emotionColors";

interface EmotionData {
  emotionType: string;
  intensity: number;
}

interface Person {
  name: string;
  feel: EmotionData[];
  count: number;
}

interface AnalysisData {
  peoples: Person[];
  selfEmotion: EmotionData[];
  stateEmotion: EmotionData[];
}

const PeopleCard: React.FC<{ data?: AnalysisData }> = ({ data }) => {
  if (!data || !data.peoples || data.peoples.length === 0) return null;

  const cardList = data.peoples.map((person, idx) => {
    // 각 사람의 첫 번째 감정을 사용 (안전한 접근)
    const firstEmotion = person.feel && person.feel.length > 0 ? person.feel[0] : null;
    const emotionText = firstEmotion ? firstEmotion.emotionType : "감정";

    // 색상 키는 감정 강도에 따라 결정
    const colorKey = firstEmotion && firstEmotion.intensity > 5 ? "red" : "yellow";

    // selfEmotion과 stateEmotion도 함께 사용
    const selfEmotions = data.selfEmotion || [];
    const stateEmotions = data.stateEmotion || [];

    const { jsx, mainColorKey } = getEmotionTemplate({
      activity: "오늘의 활동", // 활동 정보는 별도로 제공되지 않으므로 기본값 사용
      peoples: [
        {
          name: person.name,
          emotion: emotionText,
          intensity: firstEmotion ? firstEmotion.intensity : 5,
          colorKey: colorKey,
        },
      ],
    }) || { jsx: null, mainColorKey: "yellow" };

    return (
      <div
        key={idx}
        className="bg-white rounded-2xl shadow p-5 text-center h-[200px] flex flex-col justify-center"
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
              fill={baseColors[mainColorKey as ColorKey]}
            />
          </svg>
        </div>
        <div className="text-gray-800 text-base leading-relaxed">{jsx}</div>

        {/* 추가 감정 정보 표시 */}
        {(selfEmotions.length > 0 || stateEmotions.length > 0) && (
          <div className="mt-2 text-sm text-gray-600">
            {selfEmotions.length > 0 && (
              <div>내 감정: {selfEmotions.map(e => e.emotionType).join(", ")}</div>
            )}
            {stateEmotions.length > 0 && (
              <div>상태: {stateEmotions.map(e => e.emotionType).join(", ")}</div>
            )}
          </div>
        )}
      </div>
    );
  });

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 px-4">오늘 감정이 향한 사람들</h2>
      <Carousel items={cardList} />
    </div>
  );
};
export default PeopleCard;
