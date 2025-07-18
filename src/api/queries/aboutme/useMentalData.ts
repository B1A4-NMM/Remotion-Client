import { useQuery } from "@tanstack/react-query";
import { getMentalData } from "./../../services/mentalService";

// MentalType 타입은 공통으로 정의되어 있다고 가정
type MentalType = "스트레스" | "불안" | "우울" | "활력" | "안정" | "유대";

// 응답 데이터 타입 정의
interface MentalDataResponse {
  activities: {
    activityId: number;
    activityContent: string;
    emotion: string;
    totalIntensity: number;
    count: number;
    percentage: number;
  }[];
  people: {
    targetId: number;
    targetName: string;
    emotion: string;
    totalIntensity: number;
    count: number;
  }[];
  date: {
    date: string;
    emotionGroup: string;
    intensity: number;
    count: number;
  }[];
}

// 커스텀 훅
export const useMentalData = (emotion: MentalType, period: string | number) => {
  return useQuery<MentalDataResponse>({
    queryKey: ["mental", emotion, period],
    queryFn: () => getMentalData(emotion, period),
  });
};
