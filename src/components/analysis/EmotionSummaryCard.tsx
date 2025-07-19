import { useNavigate } from "react-router-dom";
import { useMentalData } from "@/api/queries/aboutme/useMentalData";
import LoadingAnimation from "../Loading";
import MentalChart from "../aboutMe/Mental/MentalChart";

type MentalType = "스트레스" | "불안" | "우울" | "활력" | "안정" | "유대";
type GroupType = "부정" | "긍정";
interface EmotionSummaryCardProps {
  type: MentalType | GroupType;
  period: number;
  barCount: number;
}

const groupMap: Record<GroupType, MentalType[]> = {
  부정: ["스트레스", "우울", "불안"],
  긍정: ["활력", "안정", "유대"],
};

const EmotionSummaryCard = ({ type, period, barCount }: EmotionSummaryCardProps) => {
  const navigate = useNavigate();

  // 그룹형 처리
  if (type === "부정" || type === "긍정") {
    const queries = groupMap[type].map((emotion: MentalType) => useMentalData(emotion, period));
    const isLoading = queries.some((q) => q.isLoading);
    const data = queries.flatMap((q) => q.data?.date || []);
    return (
      <div
        onClick={() => navigate(`/analysis/${type}`)}
        className="min-w-[160px]p-4 cursor-pointer"
      >
        {isLoading ? (
          <LoadingAnimation />
        ) : (
          <MentalChart type={type} data={data} limit={barCount}/>
        )}
      </div>
    );
  }

  // 단일 감정 처리
  const { data, isLoading } = useMentalData(type as MentalType, period);
  return (
    <div
      onClick={() => navigate(`/analysis/${type}`)}
      className="min-w-[160px] p-4 cursor-pointer"
    >
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <MentalChart type={type as MentalType} data={data?.date || []} limit={barCount} />
      )}
    </div>
  );
};

export default EmotionSummaryCard;
