import { useQuery } from "@tanstack/react-query";
import { getStrength, getStrengthPeriod } from "../../services/strength"; // 경로는 상황에 따라 조정

export const useGetStrength = () => {
  return useQuery({
    queryKey: ["strength"],
    queryFn: getStrength,
    enabled: typeof window !== "undefined" && !!localStorage.getItem("accessToken"),
    staleTime: 1000 * 60 * 5, // optional: 데이터 캐싱 5분
  });
};

export const useGetStrengthPeriod = (year: string, month: string) => {
  return useQuery({
    queryKey: ["strength", year, month],
    queryFn: () => {
      return getStrengthPeriod(year, month);
    },
    enabled: !!year && !!month,
    staleTime: 1000 * 60 * 5,
  });
};
