import * as React from "react";
import Carousel from "./Carousel";
import { getEmotionTemplate } from "@/utils/emotionTemplate.tsx";
import CommaIcon from "./../../assets/img/comma.svg?react";
import { baseColors } from "@/constants/emotionColors";
import type { ColorKey } from "@/constants/emotionColors";

const PeopleCard: React.FC<{ data?: any[] }> = ({ data = [] }) => {
  // Add this console log to print the received data prop
  console.log("[PeopleCard] received data:", data);
  if (!data || data.length === 0) return null;

  const cardList = data.map((item, idx) => {
    // item: { activity, person }
    const { activity, person } = item;
    let activityText = "";
    if (typeof activity === "string") {
      activityText = activity;
    } else if (activity && typeof activity.activity === "string") {
      activityText = activity.activity;
    } else if (activity && typeof activity.comment === "string") {
      activityText = activity.comment;
    } else {
      activityText = JSON.stringify(activity);
    }

    // 디버깅용 콘솔
    console.log("PeopleCard item.activity:", activity);
    console.log("PeopleCard activityText:", activityText);
    console.log("PeopleCard person:", person);

    const { jsx, mainColorKey } = getEmotionTemplate({
      activity: activityText,
      peoples: [person], // 한 명만 배열로 전달
    }) || { jsx: null, mainColorKey: "yellow" };

    return (
      <div
        key={idx}
        className="bg-white rounded-2xl shadow p-5 text-center h-[200px] flex flex-col justify-center"
      >
        <CommaIcon
          style={{ color: baseColors[mainColorKey as ColorKey] }}
          className="w-6 h-6 mb-6 mx-auto"
        />
        <div className="text-gray-800 text-base leading-relaxed">{jsx}</div>
      </div>
    );
  });

  return <Carousel items={cardList} />;
};
export default PeopleCard;
