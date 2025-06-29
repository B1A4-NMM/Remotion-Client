import { useMutation } from "@tanstack/react-query";
import { postDiary } from "./../../services/diary";

export const usePostDiary = () => {
  return useMutation({
    mutationFn: postDiary,
  });
};
