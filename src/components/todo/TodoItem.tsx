import { Checkbox } from "@/components/ui/checkbox";
import { useTodoStore } from "@/store/todoStore";

export default function TodoItem({ todo }) {
  const toggleTodo = useTodoStore((state) => state.toggleTodo);

  return (
    <li className="flex items-center gap-3">
        {/* ✅ shadcn Checkbox 사용 & done 상태 연동 */}
        <Checkbox
            checked={todo.done}
            onCheckedChange={() => toggleTodo(todo.id)}
            className={`flex-shrink-0 border
                ${todo.done 
                ? "border-gray-400 bg-white text-black"
                : "border-white text-white hover:border-blue-400 focus:ring-blue-400"
            }`}
        />

        {/* ✅ 완료 시 텍스트 회색 처리 */}
        <span className={todo.done ? "text-gray-400" : ""}>
            {todo.text}
        </span>
    </li>
  );
}
