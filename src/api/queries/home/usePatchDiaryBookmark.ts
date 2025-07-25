// src/api/queries/home/usePatchDiaryBookmark.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchDiaryBookmark } from "../../services/diary";
import { toast } from "sonner";

export const usePatchDiaryBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ diaryId }: { diaryId: number }) => {
      return patchDiaryBookmark(diaryId);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ["diaries"] });
      toast.success("북마크 상태가 변경되었습니다.", {
        duration: 2000,
      });
    },
    onError: (error: any) => {
      console.error("🔍 북마크 변경 실패:", error);
      console.error("  - 에러 타입:", typeof error);
      console.error("  - 에러 메시지:", error?.message);
      console.error("  - 에러 응답:", error?.response);
      toast.error("북마크 변경에 실패했습니다.", {
        duration: 2000,
      });
    },
  });
};
