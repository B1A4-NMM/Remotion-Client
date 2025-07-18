// src/api/queries/home/useDeleteDiary.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDiary } from "../../services/deleteDiary";
import { toast } from "sonner";

export const useDeleteDiary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ diaryId }: { diaryId: string }) => deleteDiary(diaryId),
    onSuccess: () => {
      // 실제 사용하는 쿼리 키들로 무효화
      queryClient.invalidateQueries({ queryKey: ["diaries"] });
      queryClient.invalidateQueries({ queryKey: ["homeData"] });
      queryClient.invalidateQueries({ queryKey: ["todayDiary"] });
      queryClient.invalidateQueries({ queryKey: ["diaryDate"] });
      queryClient.invalidateQueries({ queryKey: ["infiniteDiaries"] });
      toast.success("일기가 성공적으로 삭제되었습니다.", {
        description: "홈 화면으로 돌아갑니다.",
        duration: 3000,
      });
    },
    onError: (error: any) => {
      console.error("일기 삭제 실패:", error);
      toast.error("일기 삭제에 실패했습니다.", {
        description: "다시 시도해주세요.",
        duration: 3000,
      });
    },
  });
};
