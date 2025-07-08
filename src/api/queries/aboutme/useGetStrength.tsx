import { useQuery } from "@tanstack/react-query";
import { getStrength } from "../../services/strength"; // 경로는 상황에 따라 조정

export const useGetStrength = () => {
  return useQuery({
    queryKey: ["strength"],
    queryFn: getStrength,
    enabled: typeof window !== "undefined" && !!localStorage.getItem("accessToken"),
    staleTime: 1000 * 60 * 5, // optional: 데이터 캐싱 5분
  });
};
