// src/api/queries/relation/useGetRelationDetail.ts
import { useQuery } from "@tanstack/react-query";
import { getRelationDetail } from "@/api/services/relationDetail"
import type { RelationData } from "../types/relation";

export const useGetRelationDetail = (token: string, id: string) => {
  return useQuery<RelationData>({
    queryKey: ["relationDetail", id, token],
    queryFn: () => {
      return getRelationDetail(token, id);
    },
    enabled: !!token && !!id, // token과 id가 있을 때 호출
    staleTime: 1000 * 60 * 5,
  });
};
