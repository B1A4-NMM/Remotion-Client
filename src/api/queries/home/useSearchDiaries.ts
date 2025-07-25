import { useQuery } from "@tanstack/react-query";
import { searchDiaries } from "../../services/diary";

export const useSearchDiaries = (q: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["searchDiaries", q],
    queryFn: () => searchDiaries(q),
    enabled: enabled && !!q,
    staleTime: 30 * 60 * 1000, // 5분
  });
};
