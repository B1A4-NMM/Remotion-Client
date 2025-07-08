import React from "react";
import DoughnutChart from "./DoughnutChart";

type MentalType = "stress" | "anxiety" | "depression";

type DoughnutData = {
  title: string;
  value: number;
  color: string;
};

const activityDataMap: Record<MentalType, DoughnutData[]> = {
  stress: [
    { title: "데이트", value: 30, color: "#5b9bd5" },
    { title: "밀린 과제", value: 20, color: "#70ad47" },
    { title: "방치우기", value: 50, color: "#ffc000" },
    { title: "살 빼기", value: 50, color: "#ff610e" },
  ],
  anxiety: [
    { title: "임구철", value: 25, color: "#5b9bd5" },
    { title: "정진영", value: 25, color: "#70ad47" },
    { title: "이하린", value: 50, color: "#ffc000" },
  ],
  depression: [
    { title: "산책", value: 40, color: "#5b9bd5" },
    { title: "일기쓰기", value: 20, color: "#70ad47" },
    { title: "손채민", value: 40, color: "#ffc000" },
  ],
};

interface ActivitySectionProps {
  type: MentalType;
}

const ActivitySection = ({ type }: ActivitySectionProps) => {
  const activityData = activityDataMap[type];

  return (
    <section className="w-full">
      <h1 className="text-white text-xl text-left tracking-tight drop-shadow-md mb-2">Activity</h1>

      <div className="flex justify-center items-center w-full h-full">
        <DoughnutChart data={activityData} innerCutoutPercentage={40} summaryTitle="TOTAL:" />
      </div>
    </section>
  );
};

export default ActivitySection;
