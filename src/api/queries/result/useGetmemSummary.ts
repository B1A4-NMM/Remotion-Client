// api/queries/diary/useGetMemberSummary.ts
import { useQuery } from "@tanstack/react-query";
import { getMemberSummary } from "../../services/memberSummary";

export const useGetMemberSummary = (token: string, days: number = 3) => {
  return useQuery({
    queryKey: ["memberSummary", token, days],
    queryFn: () => getMemberSummary(token, days),
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    retry: 2
  });
};
