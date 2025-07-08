// 서버에서 Todo 목록을 가져오는 getTodos 함수를 React Query의 useQuery로 감싼 훅
// from과 to 파라미터를 받아 [\"todos\", from, to] 키로 캐싱

import { useQuery } from "@tanstack/react-query";
import { getTodos } from "@/api/services/todo";
import { useTodoStore } from "@/store/todoStore";

export const useTodos = (from?: string, to?: string) => {
  const now = new Date();
  const defaultFrom =
    from ?? new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const defaultTo =
    to ?? new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);

  return useQuery({
    queryKey: ["todos", defaultFrom, defaultTo],
    queryFn: () => getTodos(defaultFrom, defaultTo),
    onSuccess: (data) => {
      const { setTodos } = useTodoStore.getState();
      setTodos(data);
    },
  });
};
