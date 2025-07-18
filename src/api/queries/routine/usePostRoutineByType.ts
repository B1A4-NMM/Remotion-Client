// src/api/queries/routine/usePostRoutineByType.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postRoutineByType } from "@/api/services/routine";
import type { RoutineType } from "@/types/routine";

export const usePostRoutineByType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, content }: { type: RoutineType; content: string }) =>
      postRoutineByType(type, content),

    onSuccess: (_, variables) => {
      // 추가 성공 후 해당 type의 루틴 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["routine", variables.type] });
    },

    onError: (error) => {
      console.error("루틴 추가 실패:", error);
    },
  });
};
