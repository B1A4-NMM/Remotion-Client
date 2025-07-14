// src/api/queries/home/useDeleteDiary.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDiary } from "../../services/deleteDiary";
import { toast } from "sonner";

export const useDeleteDiary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ token, diaryId }: { token: string; diaryId: string }) =>
      deleteDiary(token, diaryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todayDiary"] });
      queryClient.invalidateQueries({ queryKey: ["diaryContent"] });
      queryClient.invalidateQueries({ queryKey: ["diaryDate"] });
      queryClient.invalidateQueries({ queryKey: ["homeData"] });
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
