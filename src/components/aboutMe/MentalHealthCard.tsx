import { useState } from "react";
import MentalChart from "../aboutMe/Mental/MentalChart";
import { Button } from "../ui/button";
import ActivitySection from "./Mental/ActivitySection";
import PeopleSection from "./Mental/PeopleSection";
import { useMentalData } from "./../../api/queries/aboutme/useMentalData";

// 타입 정의
type MentalType = "스트레스" | "불안" | "우울";
interface MentalCardProps {
  isActive: boolean;
}

// 버튼 색상 맵
const colorMap: Record<MentalType, string> = {
  스트레스: "#00bcd4", // 청록
  불안: "#8e24aa", // 보라
  우울: "#ef6c00", // 주황
};

const MentalHealthCard = ({ isActive }: MentalCardProps) => {
  const [currentType, setCurrentType] = useState<MentalType>("스트레스");
  const period = 365; // 최근 1년
  const barCount = 12; // 12개월 표시
  const { data } = useMentalData(currentType, period);

  const buttons: { type: MentalType; label: string }[] = [
    { type: "스트레스", label: "스트레스" },
    { type: "불안", label: "불안" },
    { type: "우울", label: "우울" },
  ];

  return (
    <div className="flex flex-col items-start gap-6 w-full pt-4 px-6">
      <h1 className="text-white text-2xl font-bold pt-6">Mental Health Report</h1>

      {/* 타입 전환 버튼 */}
      <div className="flex gap-4">
        {buttons.map(({ type, label }) => {
          const isSelected = currentType === type;
          const baseColor = colorMap[type];

          return (
            <Button
              key={type}
              onClick={() => setCurrentType(type)}
              className="px-4 font-semibold rounded-md transition-all duration-200 hover:opacity-90"
              style={{
                backgroundColor: isSelected ? baseColor : "transparent",
                color: isSelected ? "white" : baseColor,
                border: `1.5px solid ${baseColor}`,
              }}
            >
              {label}
            </Button>
          );
        })}
      </div>

      {/* 차트 및 상세 섹션 */}
      <MentalChart type={currentType} data={data?.date ?? []} limit={barCount} />
      <ActivitySection type={currentType} data={data?.activities ?? []} period={period} barCount={barCount} />
      <PeopleSection type={currentType} data={data?.people ?? []} period={period} barCount={barCount} />
    </div>
  );
};

export default MentalHealthCard;
