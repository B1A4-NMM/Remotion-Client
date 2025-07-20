// api/queries/diary/useGetDiaryDate.ts
import { useQuery } from "@tanstack/react-query";
import { getDiaryDate } from "../../services/diaryDate";

export const useGetDiaryDate = (date: string) => {
  return useQuery({
    queryKey: ["diaryDate", date],
    queryFn: () => getDiaryDate(date),
    enabled: !!date,
    refetchOnWindowFocus: false,
  });
};
