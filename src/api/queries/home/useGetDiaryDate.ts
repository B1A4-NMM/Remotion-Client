// api/queries/diary/useGetDiaryDate.ts
import { useQuery } from "@tanstack/react-query";
import { getDiaryDate } from "../../services/diaryDate";

export const useGetDiaryDate = (token: string, date: string) => {
  return useQuery({
    queryKey: ["diaryDate", date, token],
    queryFn: () => getDiaryDate(token, date),
    enabled: !!token && !!date, 
    staleTime: 1000 * 60 * 5,
  });
};
