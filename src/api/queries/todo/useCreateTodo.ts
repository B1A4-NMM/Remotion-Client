// Todo 생성 요청을 수행하고 성공 시 [\"todos\"] 쿼리를 무효화해 리스트를 갱신하는 useMutation 훅

// ✅ useMutation과 useQueryClient는 React Query 훅
// ✅ createTodo는 서버에 POST 요청 보내는 함수
// ✅ useTodoStore는 Zustand 전역 스토어 훅
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTodo } from "@/api/services/todo";
import { useTodoStore } from "@/store/todoStore"; // Zustand 스토어

export const useCreateTodo = () => {
  const queryClient = useQueryClient(); // 쿼리 무효화
  const setTodos = useTodoStore(state => state.setTodos); // Zustand 스토어에서 todos 배열을 업데이트하는 함수

  return useMutation({
    mutationFn: createTodo, // 실제로 실행할 API 요청 함수

    // Optimistic update: 로컬 스토어에 먼저 추가 → 사용자 UX 좋음
    onMutate: async newTodo => {
      const tempId = Date.now().toString();
      const optimisticTodo = { ...newTodo, id: tempId, isCompleted: false };
      setTodos(prev => [...prev, optimisticTodo]);
      return { tempId };
    },

    // 서버 성공 시: 쿼리 무효화로 서버 데이터 싱크 맞춤
    onSuccess: (created, _newTodo, context) => {
      if (context?.tempId) {
        setTodos(prev => prev.map(t => (t.id === context.tempId ? created : t)));
      }
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },

    // 실패 시: 필요하다면 rollback 처리도 가능
    onError: (error, newTodo, context) => {
      console.error("Todo 생성 실패:", error);
      // 상황에 따라 setTodos로 롤백할 수 있음
    },
  });
};
