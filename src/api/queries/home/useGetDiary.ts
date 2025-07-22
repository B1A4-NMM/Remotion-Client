// api/queries/diary/useGetDiary.ts
import { useQuery } from "@tanstack/react-query";
import { getDiaryContent } from "../../services/diaryContent";
import { getDiaryContentResult } from "../../services/diaryContent";
export const useGetDiaryContent = (token: string, id: string) => {
  return useQuery({
    queryKey: ["diaryContent", id, token],
    queryFn: () => getDiaryContent(id),
    enabled: !!token && !!id && id !== "sample", // sample id일 때는 호출하지 않음
    staleTime: 1000 * 60 * 5,
  });
};
export const useGetDiaryContentResult = (token: string, id: string) => {
  return useQuery({
    queryKey: ["diaryContentResult", id, token], // 키를 변경하여 캐시 분리
    queryFn: () => getDiaryContentResult(id),
    enabled: !!token && !!id && id !== "sample", // sample id일 때는 호출하지 않음
    staleTime: 1000 * 30, // 30초로 단축
    refetchOnWindowFocus: true, // 윈도우 포커스 시 재요청
    refetchOnMount: true, // 컴포넌트 마운트 시 재요청
  });
};
