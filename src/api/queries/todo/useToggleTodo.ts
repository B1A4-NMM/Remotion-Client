import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTodo } from "@/api/services/todo"; // ✅ toggleTodo 대신 updateTodo 사용
import { useTodoStore } from "@/store/todoStore";

import type { Todo } from "@/store/todoStore";

export const useToggleTodo = () => {
  const queryClient = useQueryClient();
  const { setTodos } = useTodoStore.getState();

  return useMutation({
    // ✅ mutationFn은 toggleTodo 대신 updateTodo
    mutationFn: async (id: number) => {
      // 현재 todos에서 해당 todo 찾아서 isCompleted 반전
      const todo = useTodoStore.getState().todos.find((t) => t.id === id);
      if (!todo) throw new Error("Todo not found");

      return updateTodo(id, { isCompleted: !todo.isCompleted });
    },

    // Optimistic Update: 스토어 먼저 갱신
    onMutate: async (id: number) => {
      setTodos((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
        )
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