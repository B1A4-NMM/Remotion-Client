// 특정 Todo 삭제 기능을 useMutation으로 제공하며, 삭제 성공 시 [\"todos\"] 쿼리를 무효화

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTodo } from "@/api/services/todo";
import { useTodoStore } from "@/store/todoStore";

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  const deleteTodoInStore = useTodoStore((state) => state.deleteTodo);

  return useMutation({
    mutationFn: deleteTodo,
    
    onMutate: async (id: number) => {
        // Optimistic Update
        deleteTodoInStore(id);
    },
  
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  
    onError: (err) => {
        console.error("Todo 삭제 실패:", err);
        // 롤백 필요시 여기에!
    },
  });
};