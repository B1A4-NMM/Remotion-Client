import React from "react";
import { useNavigate } from "react-router-dom";
import { useMentalData, useNegativeData, usePositiveData } from "@/api/queries/aboutme/useMentalData";
import LoadingAnimation from "../Loading";
import MentalChart from "../aboutMe/Mental/MentalChart";

type MentalType = "스트레스" | "불안" | "우울" | "활력" | "안정" | "유대";
type GroupType = "부정" | "긍정";

interface EmotionSummaryCardProps {
  type: MentalType | GroupType;
  period: number;
  barCount?: number;
}

const extractDateData = (data: any, type: GroupType) => {
  if (!data) return [];
  
  if (type === "부정") {
    return [
      ...(data.stressDate || []),
      ...(data.depressionDate || []),
      ...(data.anxietyDate || [])
    ];
  } else if (type === "긍정") {
    return [
      ...(data.vitalityDate || []),
      ...(data.stabilityDate || []),
      ...(data.bondDate || [])
    ];
  }
  return [];
};

const EmotionSummaryCard = ({ type, period, barCount }: EmotionSummaryCardProps) => {
  const navigate = useNavigate();

  // 그룹형 처리
  if (type === "부정" || type === "긍정") {
    // 개별 감정별로 각각 호출하지 말고, 그룹 API 한 번만 호출
    const query = type === "부정" 
      ? useNegativeData(period)
      : usePositiveData(period);

    const isLoading = query.isLoading;
    const data = extractDateData(query.data, type);

    console.log("API 응답:", query.data);
    console.log("추출된 데이터:", data);

    return (
      <div
        onClick={() => navigate(`/analysis/${type}`)}
        className="min-w-[160px] p-4 cursor-pointer"
      >
        {isLoading ? (
          <LoadingAnimation />
        ) : (
          <MentalChart type={type} data={data} limit={barCount}/>
        )}
      </div>
    );
  }

};

// 그룹 감정 카드 컴포넌트
const GroupEmotionCard = ({
  type,
  period,
  barCount,
}: {
  type: GroupType;
  period: number;
  barCount?: number;
}) => {
  const navigate = useNavigate();

  // 개별 Hook 호출
  const stressData = useMentalData("스트레스", period);
  const anxietyData = useMentalData("불안", period);
  const depressionData = useMentalData("우울", period);
  const vitalityData = useMentalData("활력", period);
  const stabilityData = useMentalData("안정", period);
  const bondingData = useMentalData("유대", period);

  // 그룹에 따른 데이터 선택
  const relevantQueries =
    type === "부정"
      ? [stressData, anxietyData, depressionData]
      : [vitalityData, stabilityData, bondingData];

  const isLoading = relevantQueries.some(q => q.isLoading);
  const data = relevantQueries.flatMap(q => q.data?.date || []);

  return (
    <div onClick={() => navigate(`/analysis/${type}`)} className="min-w-[160px] p-4 cursor-pointer">
      {isLoading ? <LoadingAnimation /> : <MentalChart type={type} data={data} limit={barCount} />}
    </div>
  );
};

const EmotionSummaryCard = ({ type, period, barCount }: EmotionSummaryCardProps) => {
  // 그룹형 처리
  if (type === "부정" || type === "긍정") {
    return <GroupEmotionCard type={type} period={period} barCount={barCount} />;
  }

  // 단일 감정 처리
  return <SingleEmotionCard type={type as MentalType} period={period} barCount={barCount} />;
};

export default EmotionSummaryCard;
