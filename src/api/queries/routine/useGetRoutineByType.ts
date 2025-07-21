// src/api/queries/routine/useRoutineByType.ts
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { getRoutineByType } from "@/api/services/routine";
import type { Routine, RoutineType, RoutineItem } from "@/types/routine";
// 루틴 조회 쿼리
export const useGetRoutineByType = (
  type: RoutineType,
  options?: Partial<UseQueryOptions<RoutineItem[], Error, RoutineItem[], readonly unknown[]>>
) => {
  return useQuery<RoutineItem[], Error, RoutineItem[], readonly unknown[]>({
    queryKey: ["routine", type],
    queryFn: async () => {
      const data: Routine[] = await getRoutineByType(type);
      //Routine =>RoutineItem 변환
      return data.map(item => ({
        id: item.routineId,
        content: item.content,
        routineType: item.routineType,
      }));
    },
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 3, // 3분 캐시
    ...options,
  });
};
