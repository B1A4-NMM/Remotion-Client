import { useState } from "react";
import MentalChart from "../aboutMe/Mental/MentalChart";
import { Button } from "../ui/button";
import ActivitySection from "./Mental/ActivitySection";
import PeopleSection from "./Mental/PeopleSection";
export const peopleData = [
  {
    title: "스트레스를 유발한 사람들",
    skills: [
      {
        label: "임구철 - 지속적인 야근과 질책으로 스트레스를 유발함",
        level: 90,
      },
      {
        label: "정진영 - 업무 분담의 불균형으로 갈등이 생김",
        level: 70,
      },
      {
        label: "이하린 - 사소한 일로 자주 다투며 감정 소모가 큼",
        level: 60,
      },
      {
        label: "손채민 - 과도한 기대와 간섭으로 부담을 느낌",
        level: 75,
      },
    ],
  },
];

const MentalHealthCard = () => {
  const [currentType, setCurrentType] = useState<"stress" | "anxiety" | "depression">("stress");

  const buttons = [
    { type: "stress", label: "Stress" },
    { type: "anxiety", label: "Anxiety" },
    { type: "depression", label: "Depression" },
  ];

  return (
    <div className="flex flex-col items-start gap-6 w-full pt-4 px-6">
      <h1 className="text-white text-2xl font-bold pt-6">Mental Health</h1>

      <div className="flex gap-4">
        {buttons.map(({ type, label }) => (
          <Button
            key={type}
            onClick={() => setCurrentType(type)}
            variant={currentType === type ? "default" : "outline"}
            className="px-4"
          >
            {label}
          </Button>
        ))}
      </div>

      <MentalChart type={currentType} />
      <ActivitySection />
      <PeopleSection />
    </div>
  );
};

export default MentalHealthCard;
