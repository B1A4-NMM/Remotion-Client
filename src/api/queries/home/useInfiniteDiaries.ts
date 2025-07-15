import { useInfiniteQuery } from "@tanstack/react-query";
import { getInfiniteDiaries } from "../../services/diary";

// 커서 기반 일기 무한 스크롤 API 호출 함수
// const fetchDiaries = async ({ pageParam = 0 }: { pageParam?: number }) => {
//   const res = await fetch(`/api/diaries?cursor=${pageParam}`);
//   if (!res.ok) throw new Error("Failed to fetch diaries");
//   return res.json();
// };

export function useInfiniteDiaries() {
  return useInfiniteQuery({
    queryKey: ["diaries"],
    queryFn: ({ pageParam = 0 }) => getInfiniteDiaries(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage: any) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
  });
}
