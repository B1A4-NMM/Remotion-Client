import { useMutation } from "@tanstack/react-query";
import { postDiary } from "./../../services/diary";

export const usePostDiary = () => {
  return useMutation({
    mutationFn: postDiary,
    onSuccess: data => {
      console.log("일기 업로드 성공", data);
    },
    onError: error => {
      console.error(" 일기 업로드 실패", error);
    },
  });
};
