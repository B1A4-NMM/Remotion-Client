import { Checkbox } from "@/components/ui/checkbox";
// import { useToggleTodo } from "@/api/queries/todo/useToggleTodo";
import { useUpdateTodo } from "@/api/queries/todo/useUpdateTodo";
import { useDeleteTodo } from "@/api/queries/todo/useDeleteTodo";
import { useTodoStore } from "@/store/todoStore";
import { useState } from "react";

export default function TodoItem({ todo }) {
  // const toggleTodo = useTodoStore((state) => state.toggleTodo);
  // const { mutate } = useToggleTodo();
  const { mutate: updateTodo } = useUpdateTodo();
  const { mutate: deleteTodo } = useDeleteTodo();
  const setTodos = useTodoStore(state => state.setTodos);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(todo.title);
  const [isComposing, setIsComposing] = useState(false);

  const commitEdit = () => {
    const trimmed = value.trim();
    setEditing(false);
    if (!trimmed) {
      deleteTodo(todo.id);
      return;
    }

    if (trimmed === todo.title) return;

    setTodos(prev =>
      prev.map(t => (t.id === todo.id ? { ...t, title: trimmed } : t))
    );
    updateTodo({ id: todo.id, data: { title: trimmed } });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault();
      commitEdit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setValue(todo.title);
      setEditing(false);
    }
  };

  return (
    <li className="flex items-center gap-3">
        {/* ✅ shadcn Checkbox 사용 & isCompleted 상태 연동 */}
        <Checkbox
            checked={todo.isCompleted}
            onCheckedChange={(checked) => {
              const complete = Boolean(checked);
              setTodos(prev => prev.map(t =>
                t.id === todo.id ? { ...t, isCompleted: complete } : t
              ));
              updateTodo({ id: todo.id, data: { isCompleted: complete } });
            }}

            className={`flex-shrink-0 border border-white
                ${todo.isCompleted
                ? "bg-white text-black"
                : "bg-transparent text-white hover:border-blue-400 focus:ring-blue-400"
            }`}
        />

        {/* ✅ 완료 시 텍스트 회색 처리 */}
        {/* <span className={todo.isCompleted ? "text-gray-400" : ""}> */}
        {/* ✅ 완료 시 텍스트 회색 처리 및 클릭 시 인라인 편집 */}
        {editing ? (
          <input
            value={value}
            onChange={e => setValue(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            className="w-full bg-transparent outline-none placeholder:text-gray-400"
            autoFocus
          />
        ) : (
          <span
            className={todo.isCompleted ? "text-gray-400" : ""}
            onClick={() => setEditing(true)}
          >
            {todo.title}
          </span>
        )}
    </li>
  );
}
