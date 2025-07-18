// hooks/usePatchRoutine.ts
import { useMutation } from "@tanstack/react-query";
import { patchRoutineById } from "@/api/services/routine";

export const usePatchRoutineById = () => {
  return useMutation({
    mutationFn: patchRoutineById,
    //전역 캐시 처리나 알림 정도만 하는게 적절
    onError: () => {
        alert("루틴 업데이트 실패");
    },
  });
};
