// 특정 Todo 항목을 수정하고, 성공 후 [\"todos\"] 쿼리를 다시 불러오도록 하는 훅
// id와 변경할 필드를 받아 updateTodo 서비스를 호출

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTodo, type Todo } from "@/api/services/todo";

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Todo, "id">> }) =>
      updateTodo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};