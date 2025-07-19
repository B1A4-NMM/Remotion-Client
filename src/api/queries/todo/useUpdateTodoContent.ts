import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTodoContent, type ApiTodo } from "@/api/services/todo";

export const useUpdateTodoContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<ApiTodo, "id">> }) =>
      updateTodoContent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};