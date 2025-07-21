import { useNavigate } from "react-router-dom";
import {
  useMentalData,
  useNegativeData,
  usePositiveData,
} from "@/api/queries/aboutme/useMentalData";
import EmotionSummaryCardSkeleton from "./EmotionSummaryCardSkeleton";
import MentalChart from "../aboutMe/Mental/MentalChart";

type MentalType = "스트레스" | "불안" | "우울" | "활력" | "안정" | "유대";
type GroupType = "부정" | "긍정";
interface EmotionSummaryCardProps {
  type: MentalType | GroupType;
  period: number;
  barCount: number;
}

const extractDateData = (data: any, type: GroupType) => {
  if (!data) return [];

  if (type === "부정") {
    return [
      ...(data.stressDate || []),
      ...(data.depressionDate || []),
      ...(data.anxietyDate || []),
    ];
  } else if (type === "긍정") {
    return [...(data.vitalityDate || []), ...(data.stabilityDate || []), ...(data.bondDate || [])];
  }
  return [];
};

const EmotionSummaryCard = ({ type, period, barCount }: EmotionSummaryCardProps) => {
  const navigate = useNavigate();

  // 그룹형 처리
  if (type === "부정" || type === "긍정") {
    // 개별 감정별로 각각 호출하지 말고, 그룹 API 한 번만 호출
    const query = type === "부정" ? useNegativeData(period) : usePositiveData(period);

    const isLoading = query.isLoading;
    const data = extractDateData(query.data, type);

    return (
      <div
        onClick={() => navigate(`/analysis/${type}`)}
        className="min-w-[160px] p-4 cursor-pointer"
      >
        {isLoading ? (
          <EmotionSummaryCardSkeleton />
        ) : (
          <MentalChart type={type} data={data} limit={barCount} />
        )}
      </div>
    );
  }
};

export default EmotionSummaryCard;
