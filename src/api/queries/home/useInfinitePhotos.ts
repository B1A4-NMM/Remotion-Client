import { useInfiniteQuery } from "@tanstack/react-query";
import { getInfinitephotos } from "../../services/diary";

export const useInfinitePhotos = () => {
  return useInfiniteQuery({
    queryKey: ["infinitePhotos"],
    queryFn: ({ pageParam = 0 }) => getInfinitephotos(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage: any) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
  });
};