import { useState } from "react";
import MentalChart from "../aboutMe/Mental/MentalChart";
import { Button } from "../ui/button";
import ActivitySection from "./Mental/ActivitySection";
import PeopleSection from "./Mental/PeopleSection";

// 타입 정의
type MentalType = "stress" | "anxiety" | "depression";
interface MentalCardProps {
  isActive: boolean;
}

// 버튼 색상 맵
const colorMap: Record<MentalType, string> = {
  stress: "#00bcd4", // 청록
  anxiety: "#8e24aa", // 보라
  depression: "#ef6c00", // 주황
};

const MentalHealthCard = ({ isActive }: MentalCardProps) => {
  const [currentType, setCurrentType] = useState<MentalType>("stress");

  const buttons = [
    { type: "stress", label: "Stress" },
    { type: "anxiety", label: "Anxiety" },
    { type: "depression", label: "Depression" },
  ];

  return (
    <div className="flex flex-col items-start gap-6 w-full pt-4 px-6">
      <h1 className="text-white text-2xl font-bold pt-6">Mental Health</h1>

      {/* 타입 전환 버튼 */}
      <div className="flex gap-4">
        {buttons.map(({ type, label }) => {
          const isActive = currentType === type;
          const baseColor = colorMap[type];

          return (
            <Button
              key={type}
              onClick={() => setCurrentType(type)}
              className="px-4 font-semibold rounded-md transition-all duration-200 hover:opacity-90"
              style={{
                backgroundColor: isActive ? baseColor : "transparent",
                color: isActive ? "white" : baseColor,
                border: `1.5px solid ${baseColor}`, // ✅ 여기서 border 굵기 + 색상 지정
              }}
            >
              {label}
            </Button>
          );
        })}
      </div>

      {/* 차트 및 상세 섹션 */}
      <MentalChart type={currentType} />
      <ActivitySection type={currentType} />
      <PeopleSection type={currentType} />
    </div>
  );
};

export default MentalHealthCard;
