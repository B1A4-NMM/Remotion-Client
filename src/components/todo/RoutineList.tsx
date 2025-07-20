import { useQuery } from '@tanstack/react-query';
import { getRoutineByType } from '@/api/services/routine';
import { Routine } from '@/types/routine';
import { useAddTodo } from '@/api/queries/todo/useAddTodo';
import { useTodos } from '@/api/queries/todo/useTodos';
import { useSelectedDate } from '@/hooks/useSelectedDate';
import { formatDate } from '@/utils/date';

export default function RoutineList() {
  const { selectedDate } = useSelectedDate();

  const depressionQuery = useQuery<Routine[], Error>({
    queryKey: ['routines', 'depression'],
    queryFn: () => getRoutineByType('depression'),
  });

  const anxietyQuery = useQuery<Routine[], Error>({
    queryKey: ['routines', 'anxiety'],
    queryFn: () => getRoutineByType('anxiety'),
  });

  const stressQuery = useQuery<Routine[], Error>({
    queryKey: ['routines', 'stress'],
    queryFn: () => getRoutineByType('stress'),
  });

  const { data: todos } = useTodos(formatDate(selectedDate));
  const { mutate: addTodo } = useAddTodo();

  const handleAddTodo = (content: string) => {
    addTodo({ date: formatDate(selectedDate), content });
  };

  if (depressionQuery.isLoading || anxietyQuery.isLoading || stressQuery.isLoading)
    return <div>Loading...</div>;
  if (depressionQuery.error || anxietyQuery.error || stressQuery.error)
    return <div>Error: {(depressionQuery.error || anxietyQuery.error || stressQuery.error)?.message}</div>;

  const routines = [
    ...(depressionQuery.data || []),
    ...(anxietyQuery.data || []),
    ...(stressQuery.data || []),
  ];

  const todoContents = new Set(todos?.map((todo) => todo.content));

  return (
    <div className="flex flex-col gap-3 mt-3">
      {routines.map((routine) => {
        const isAdded = todoContents.has(routine.content);
        return (
          <div
            key={routine.id}
            className={`cursor-pointer ${isAdded ? 'text-black' : 'text-gray-500'}`}
            onClick={() => !isAdded && handleAddTodo(routine.content)}
          >
            {routine.content}
          </div>
        );
      })}
    </div>
  );
}
