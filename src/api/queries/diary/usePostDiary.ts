import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import type { DiaryPayload, DiaryResponse } from "@/types/diary";
import { postDiary } from "./../../services/diary";

export const usePostDiary = (
  options?: UseMutationOptions<DiaryResponse, unknown, DiaryPayload>
  // 외부에서 훅을 사용할 때 옵션을 추가할 수 있도록 해주는 부분
  // DiaryResponse : 성공시 받을 응답 데이터 타입
  // Unknown : 실패시 에러 타입
  // DiaryPayload: 서버에 보낼 요청 데이터 타입
) => {
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

      // 옵션으로 전달된 onSuccess도 실행해줌 (있을 경우)
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
