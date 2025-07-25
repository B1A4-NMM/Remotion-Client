import { useInfiniteQuery } from "@tanstack/react-query";
import { getBookmarkDiaries } from "../../services/diary";

export const useGetBookmarkDiaries = (page?: number) => {

  return useInfiniteQuery({
    queryKey: ["bookmarkDiaries", page],
    queryFn: ({ pageParam = 0 }) => {
      return getBookmarkDiaries(pageParam);
    },
    getNextPageParam: lastPage => {
      // hasMore가 true이고 nextCursor가 있으면 다음 페이지로
      if (lastPage.item?.hasMore && lastPage.item?.nextCursor) {
        return lastPage.item.nextCursor;
      }
      return undefined;
    },
    initialPageParam: 0,
    enabled: page !== undefined, // page가 undefined가 아닐 때만 쿼리 활성화
  });
};
