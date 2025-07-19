import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTodoDate } from "@/api/services/todo";

export const useUpdateTodoDate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, date }: { id: number; date: string }) =>
      updateTodoDate(id, date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["monthlyStatus"] });
    },
  });
};