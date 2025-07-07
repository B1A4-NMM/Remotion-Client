import React from "react";
import GaugeChart from "./DoughnutChart";
import DoughnutChart from "./DoughnutChart";
type DoughnutData = {
  title: string;
  value: number;
  color: string;
};
const activityData = [
  { title: "일", value: 120, color: "#F87171" }, // 빨강
  { title: "운동", value: 80, color: "#60A5FA" }, // 파랑
  { title: "인간관계", value: 50, color: "#34D399" }, // 초록
  { title: "과제", value: 30, color: "#FBBF24" }, // 노랑
];

const ActivitySection = () => {
  return (
    <>
      <h1 className="text-white text-xl text-left tracking-tight drop-shadow-md">Activity</h1>
      <div className="flex justify-center items-center w-full h-full">
        <DoughnutChart data={activityData} />
      </div>
    </>
  );
};

export default ActivitySection;
