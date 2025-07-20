import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTodo } from '@/api/services/todo';

export const useAddTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ date, content }: { date: string; content: string }) => createTodo({ date, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};
