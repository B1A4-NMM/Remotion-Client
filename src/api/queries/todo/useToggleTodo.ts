import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleTodo } from "@/api/services/todo";
import { useTodoStore } from "@/store/todoStore";

import type { Todo } from "@/store/todoStore";

export const useToggleTodo = () => {
  const queryClient = useQueryClient();
  const { setTodos } = useTodoStore.getState();

  return useMutation({
    mutationFn: async (id: number) => {
      return toggleTodo(id);
    },

    // Optimistic Update: 스토어 먼저 갱신
    onMutate: async (id: number) => {
      setTodos(prev =>
        prev.map(t => (t.id === id ? { ...t, isComplete: !t.isComplete } : t))
      );
    },

    onSuccess: (updated: Todo) => {
      setTodos((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );

      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },

    onError: (error) => {
      console.error("Todo toggle 실패:", error);
      // rollback 필요하면 여기서 처리
    },
  });
};