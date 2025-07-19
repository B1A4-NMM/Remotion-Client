import React from "react";
import TodoItem from "./TodoItem";
import { useAddTodo } from "@/api/queries/todo/useAddTodo";
import { useTodoStore } from "@/store/todoStore";
import { useDepressionRoutines } from "@/api/queries/routine/useDepressionRoutines";

interface RoutineItemProps {
  routine: { id: number; content: string };
}

function RoutineItem({ routine }: RoutineItemProps) {
  const { mutate: addTodo } = useAddTodo();
  const setTodos = useTodoStore(state => state.setTodos);
  const [isAdded, setIsAdded] = React.useState(false);

  const handleAddRoutineAsTodo = () => {
    if (!isAdded) {
      const newTodo = {
        id: Date.now(), // 임시 ID
        content: routine.content,
        isComplete: false,
        date: new Date().toISOString().split('T')[0],
      };
      setTodos(prev => [...prev, newTodo]);
      addTodo({ content: routine.content, date: new Date().toISOString().split('T')[0] });
      setIsAdded(true);
    }
  };

  return (
    <li
      className={`flex items-center gap-3 ${isAdded ? '' : 'text-gray-400'}`}
      onClick={handleAddRoutineAsTodo}
    >
      <span className="flex-grow">{routine.content}</span>
    </li>
  );
}

export default function RoutineList() {
  const { data: routines, isLoading, isError } = useDepressionRoutines();

  if (isLoading) return <div>루틴 불러오는 중...</div>;
  if (isError) return <div>루틴을 불러오는데 실패했습니다.</div>;

  if (!routines || routines.length === 0) return <div>등록된 루틴이 없습니다.</div>;

  return (
    <div className="overflow-y-auto flex-grow">
      <ul className="space-y-2">
        {routines.map(routine => (
          <RoutineItem key={routine.id} routine={routine} />
        ))}
      </ul>
    </div>
  );
}
