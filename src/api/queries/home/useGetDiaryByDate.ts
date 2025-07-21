import { useQuery } from "@tanstack/react-query";
import { getDiaryByDate } from "../../services/diary";

export const useGetDiaryByDate = (date: string | null) => {
  return useQuery({
    queryKey: ["diaryByDate", date],
    queryFn: () => getDiaryByDate(date!),
    enabled: !!date, // date가 있을 때만 쿼리 활성화
  });
};
