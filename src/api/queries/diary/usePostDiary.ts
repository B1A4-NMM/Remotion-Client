import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import type { DiaryPayload, DiaryResponse } from "@/types/diary";
import { postDiary } from "./../../services/diary";
import { useNavigate } from "react-router-dom";

export const usePostDiary = (
  options?: UseMutationOptions<DiaryResponse, unknown, DiaryPayload>
) => {
  const navigate = useNavigate();

  return useMutation<DiaryResponse, unknown, DiaryPayload>({
    mutationFn: async variables => {
      console.log("📤 postDiary 호출됨 with payload:", variables);
      const response = await postDiary(variables);
      console.log("📥 postDiary 응답 받음:", response);
      return response;
    },
    onSuccess: (data, variables, context) => {
      console.log("✅ 일기 업로드 성공:", data);
      console.log("📦 요청 데이터:", variables);
      console.log("🧠 context 정보:", context);

      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      console.error("❌ 일기 업로드 실패:", error);
      console.log("📦 실패한 요청 데이터:", variables);
      console.log("🧠 context 정보:", context);

      options?.onError?.(error, variables, context);
    },
    ...options,
  });
};
