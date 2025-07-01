// Todo 생성 요청을 수행하고 성공 시 [\"todos\"] 쿼리를 무효화해 리스트를 갱신하는 useMutation 훅

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTodo } from "@/api/services/todo";

export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};