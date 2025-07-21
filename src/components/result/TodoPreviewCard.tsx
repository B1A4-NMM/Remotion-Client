import { Plus, CheckSquare } from "lucide-react";
import { useCreateTodo } from "@/api/queries/todo/useCreateTodo";
import { useSelectedDate } from "@/hooks/useSelectedDate";
import { formatDate } from "@/utils/date";
import { toast } from "sonner";

interface TodoPreviewCardProps {
  todos: string[];
  title?: string;
  writtenDate?: string;
}

const TodoPreviewCard: React.FC<TodoPreviewCardProps> = ({
  todos,
  title = "앞으로 해야할 일들",
  writtenDate,
}) => {
  const { mutate: createTodo } = useCreateTodo();
  const { selectedDate } = useSelectedDate();

  const handleAddTodo = (todoText: string) => {
    // writtenDate의 다음날 계산
    const baseDate = writtenDate ? new Date(writtenDate) : new Date(selectedDate);
    const tomorrow = new Date(baseDate);
    tomorrow.setDate(tomorrow.getDate() + 1);

    createTodo(
      { content: todoText, date: formatDate(tomorrow) },
      {
        onSuccess: () => {
          toast.success(
            <div>
              <span>"{todoText}" 할일이 </span>
              <span className="font-bold text-blue-400">내일 할 일</span>
              <span>로 추가되었어요!</span>
            </div>
          );
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
