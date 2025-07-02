// api/queries/home/useGetHome.ts
import { useQuery } from "@tanstack/react-query";
import { getTodayDiary } from "../../services/home";

export const useGetTodayDiary = (token: string) => {
  return useQuery({
    queryKey: ["todayDiary", token],
    queryFn: () => getTodayDiary(token),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
    // onSuccess, onError 제거
  });
};
