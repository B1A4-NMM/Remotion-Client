import { Checkbox } from "@/components/ui/checkbox";
import { useToggleTodo } from "@/api/queries/todo/useToggleTodo";
import { useUpdateTodo } from "@/api/queries/todo/useUpdateTodo";
import { useDeleteTodo } from "@/api/queries/todo/useDeleteTodo";
import { useTodoStore } from "@/store/todoStore";
import type { Todo } from "@/store/todoStore";
import { useState } from "react";
import BottomPopup from "@/components/routine/BottomPopup";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, MoreVertical } from "lucide-react";

interface TodoItemProps {
  todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
  const { mutate: toggleTodo } = useToggleTodo();
  const { mutate: updateTodo } = useUpdateTodo();
  const { mutate: deleteTodo } = useDeleteTodo();
  const setTodos = useTodoStore(state => state.setTodos);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(todo.content);
  const [isComposing, setIsComposing] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const commitEdit = () => {
    const trimmed = value.trim();
    setEditing(false);
    if (!trimmed) {
      deleteTodo(todo.id);
      return;
    }

    if (trimmed === todo.content) return;

    setTodos(prev =>
      prev.map(t => (t.id === todo.id ? { ...t, content: trimmed } : t))
    );
    updateTodo({ id: todo.id, data: { content: trimmed } });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault();
      commitEdit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setValue(todo.content);
      setEditing(false);
    }
  };

  const handleDelete = () => {
    setTodos(prev => prev.filter(t => t.id !== todo.id));
    deleteTodo(todo.id);
    setSheetOpen(false);
  };

  return (
    <li className="flex items-center gap-3">
        {/* ✅ isComplete 상태 연동 */}
        <Checkbox
            checked={todo.isComplete}
            onCheckedChange={() => {
              toggleTodo(todo.id);
            }}
        />

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
            className={todo.isComplete ? "text-gray-400" : ""}
            onClick={() => setEditing(true)}
          >
            {todo.content}
          </span>
        )}
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="ml-auto p-1 text-gray-500 hover:text-gray-700"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
        <BottomPopup
          isOpen={sheetOpen}
          onClose={() => setSheetOpen(false)}
          heightOption={{ wrapChildren: true }}
        >
          <div className="flex flex-col gap-3 w-full">
            <Button onClick={handleDelete} className="w-full">
              삭제하기
            </Button>
            <Button className="w-full">날짜 변경하기</Button>
            <Button className="w-full">반복 설정하기</Button>
          </div>
        </BottomPopup>
    </li>
  );
}
