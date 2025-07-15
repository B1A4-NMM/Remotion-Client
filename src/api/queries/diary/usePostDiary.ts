import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { postDiary } from "./../../services/diary";
import { useNavigate } from "react-router-dom";

export const usePostDiary = (options?: UseMutationOptions<any, unknown, FormData>) => {
  const navigate = useNavigate();

  return useMutation<any, unknown, FormData>({
    ...options, // ✅ 외부 옵션 먼저 병합

    mutationFn: async variables => {
      console.log("postDiary 호출됨", variables);
      const response = await postDiary(variables);

      return response;
    },

    onSuccess: (data, variables, context) => {
      const diaryId = data?.id;

      if (!diaryId) {
        console.error(" diaryId 없음:", data);
        return;
      }

      navigate(`/result/${diaryId}?view=analysis`);

      try {
        options?.onSuccess?.(data, variables, context);
      } catch (err) {
        console.error(" 외부 onSuccess 에러:", err);
      }
    },

    onError: (error, variables, context) => {
      console.error(" 일기 업로드 실패:", error);

      options?.onError?.(error, variables, context);
    },
  });
};
