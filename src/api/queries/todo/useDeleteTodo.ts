// Todo 항목 삭제 기능을 useMutation으로 제공하며, 삭제 성공 시 [\"todos\"] 쿼리를 무효화

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTodo } from "@/api/services/todo";

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};