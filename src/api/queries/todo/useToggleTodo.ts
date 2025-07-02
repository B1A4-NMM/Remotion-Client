import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleTodo } from "@/api/services/todo";
import { useTodoStore } from "@/store/todoStore";

import type { Todo } from "@/store/todoStore";

export const useToggleTodo = () => {
    const queryClient = useQueryClient();
    const setTodos = useTodoStore((state) => state.setTodos);

    return useMutation({
        mutationFn: toggleTodo,

        // Optimistic Update: 스토어 먼저 갱신
        onMutate: async (id: string) => {
            setTodos((prev) =>
                prev.map((t) =>
                    t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
                )            
            );
        },

        // 서버 성공: 스토어 & React Query 쿼리 invalidate
        onSuccess: (updated: Todo) => {
            setTodos((prev) => 
                    prev.map((t) => (t.id === updated.id ? updated : t))
            );

            // ✅ ["todos"] 쿼리 invalidate → 같은 쿼리 쓰는 모든 곳 최신화!
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },

        onError: (error) => {
            console.error("Todo toggle 실패:", error);
            // 필요하다면 롤백 로직 추가
        },
    });
};