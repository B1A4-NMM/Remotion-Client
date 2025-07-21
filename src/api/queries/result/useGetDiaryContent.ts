// api/queries/diary/useGetDiaryContent.ts
import { useQuery } from "@tanstack/react-query";
import { getDiaryContent } from "../../services/diaryContent";
import type { DiaryResponse } from "../../../types";

export const useGetDiaryContent = (token: string, id: string) => {
  return useQuery<DiaryResponse>({
    queryKey: ["diaryContent", id, token],
    queryFn: () => {
      return getDiaryContent(token, id);
    },
    enabled: !!token && !!id, // token과 id가 있을 때 호출
    staleTime: 1000 * 60 * 5,
  });
};
