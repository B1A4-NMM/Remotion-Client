// 서버에서 Todo 목록을 가져오는 getTodos 함수를 React Query의 useQuery로 감싼 훅
// date 파라미터를 받아 ["todos", date] 키로 캐싱

import { useQuery } from "@tanstack/react-query";
import { getTodosByDate } from "@/api/services/todo";
import { useTodoStore } from "@/store/todoStore";

export const useTodos = (date: string) => {
  return useQuery({
    queryKey: ["todos", date],
    queryFn: () => getTodosByDate(date),
    onSuccess: data => {
      const { setTodos } = useTodoStore.getState();
      setTodos(data);
    },
  });
};
