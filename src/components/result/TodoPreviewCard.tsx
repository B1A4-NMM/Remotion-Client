import { Plus, CheckSquare } from "lucide-react";
import { useCreateTodo } from "@/api/queries/todo/useCreateTodo";
import { useSelectedDate } from "@/hooks/useSelectedDate";
import { toast } from "sonner";

interface TodoPreviewCardProps {
  todos: string[];
  title?: string;
}

const TodoPreviewCard: React.FC<TodoPreviewCardProps> = ({
  todos,
  title = "앞으로 해야할 일들",
}) => {
  const { mutate: createTodo } = useCreateTodo();
  const { selectedDate } = useSelectedDate();

  const handleAddTodo = (todoText: string) => {
    createTodo(
      { content: todoText, date: selectedDate.toISOString().slice(0, 10) },
      {
        onSuccess: () => {
          toast.success(`"${todoText}" 할일이 추가되었습니다!`);
        },
        onError: () => {
          toast.error("할일 추가에 실패했습니다.");
        },
      }
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-md px-4 py-5">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <ul className="flex flex-col divide-y divide-blue-500/40">
        {todos.map((todo, index) => (
          <li key={index} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2 text-gray-800">
              <CheckSquare className="w-5 h-5 text-gray-500" />
              <span className="text-base">{todo}</span>
            </div>
            <button
              type="button"
              onClick={() => handleAddTodo(todo)}
              className="hover:bg-gray-100 p-1 rounded transition-colors"
            >
              <Plus className="w-4 h-4 text-gray-500" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoPreviewCard;
