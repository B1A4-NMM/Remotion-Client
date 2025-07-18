// components/Todos.tsx
import React from 'react';
import { Card} from '../ui/card';
import { Button } from '../ui/button';
import { CirclePlus, Target } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateTodo } from '@/api/queries/todo/useCreateTodo';
import { useSelectedDate } from '@/hooks/useSelectedDate';

interface TodosProps {
  todos: string[]; // Result.tsx에서 전달받은 투두 리스트 :  결과로 받은 todo
}

const Todos: React.FC<TodosProps> = ({ todos }) => {

  const { mutate } = useCreateTodo();
  const { selectedDate } = useSelectedDate();

  // todos가 빈 배열이면 아무것도 렌더링하지 않음
  if (!todos || todos.length === 0) {
    return null;
  }
  const handleTodoAdd = (todoItem: string) => {
    mutate(
      { content: todoItem, date: selectedDate.toISOString().slice(0, 10) },
      {
        onSuccess: () => {
          toast.success(`"${todoItem}" 추가 완료!`, {
            description: "할일 목록에 성공적으로 추가되었습니다.",
            duration: 1000,
          });
        },
      }
    );
  };

  return (
    <div className="wrapper space-y-2">
      <div className="mb-4 flex items-center gap-2">
        <Target className="h-5 w-5 text-white" />
        <h3 className="text-lg font-semibold text-white">
          내일의 할일 
        </h3>
        <p className="text-sm text-white/70">
          일기에서 추출된 할일
        </p>
      </div>
      
      {todos.map((todoItem, index) => (
        <Card key={index} className="bg-gray-100 border-gray-300 p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-800">{todoItem}</span>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full w-8 h-8 p-0"
              onClick={() => handleTodoAdd(todoItem)}
            >
              <CirclePlus className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Todos;
