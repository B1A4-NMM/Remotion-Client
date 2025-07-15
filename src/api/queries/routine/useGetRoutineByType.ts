// src/api/queries/routine/useRoutineByType.ts
import { useQuery } from "@tanstack/react-query";
import { getRoutineByType } from "@/api/services/routine";
import type { RoutineType } from "@/types/routine";

// 루틴 조회 쿼리
export const useGetRoutineByType = (type: RoutineType) => {
  return useQuery({
    queryKey: ["routine", type],
    queryFn: () => getRoutineByType(type),
    staleTime: 1000 * 60 * 3, // 3분 캐시
  });
};
