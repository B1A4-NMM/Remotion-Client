// src/api/queries/relation/useGetRelationDetail.ts
import { useQuery } from "@tanstack/react-query";
import { getRelationDetail } from "@/api/services/relationDetail";
import type { DiaryResponse } from "../../types";

export const useGetRelationDetail = (id: string) => {
  return useQuery<DiaryResponse>({
    queryKey: ["relationDetail", id],
    queryFn: () => {
      return getRelationDetail(id);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};
