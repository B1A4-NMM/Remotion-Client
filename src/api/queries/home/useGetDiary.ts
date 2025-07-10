// api/queries/diary/useGetDiary.ts
import { useQuery } from "@tanstack/react-query";
import { getDiaryContent } from "../../services/diaryContent";
import { getDiaryContentResult } from "../../services/diaryContent";
export const useGetDiaryContent = (token: string, id: string) => {
  return useQuery({
    queryKey: ["diaryContent", id, token],
    queryFn: () => getDiaryContent(token, id),
    enabled: !!token && !!id && id !== "sample", // sample id일 때는 호출하지 않음
    staleTime: 1000 * 60 * 5,
  });
};
export const useGetDiaryContentResult = (token: string, id: string) => {
  return useQuery({
    queryKey: ["diaryContent", id, token],
    queryFn: () => getDiaryContentResult(token, id),
    enabled: !!token && !!id && id !== "sample", // sample id일 때는 호출하지 않음
    staleTime: 1000 * 60 * 5,
  });
};
