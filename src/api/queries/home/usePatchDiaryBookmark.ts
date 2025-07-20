// src/api/queries/home/usePatchDiaryBookmark.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchDiaryBookmark } from "../../services/diary";
import { toast } from "sonner";

export const usePatchDiaryBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ diaryId, isBookmarked }: { diaryId: number; isBookmarked: boolean }) =>
      patchDiaryBookmark(diaryId, isBookmarked),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diaries"] });
      toast.success("북마크 상태가 변경되었습니다.", {
        duration: 2000,
      });
    },
    onError: (error: any) => {
      console.error("북마크 변경 실패:", error);
      toast.error("북마크 변경에 실패했습니다.", {
        duration: 2000,
      });
    },
  });
};
