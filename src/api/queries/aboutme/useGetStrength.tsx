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

export const useGetStrengthPeriod = (token: string, year: string, month:string) => {
  return useQuery({
    queryKey: ["strength", year, month, token],
    queryFn: () => {
      return getStrengthPeriod(token, year, month);
    },
    enabled: !!token ,
    staleTime: 1000 * 60 * 5,
  });
};
