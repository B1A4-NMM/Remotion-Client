import { Checkbox } from "@/components/ui/checkbox";
import { useToggleTodo } from "@/api/queries/todo/useToggleTodo";
import { useUpdateTodoContent } from "@/api/queries/todo/useUpdateTodoContent";
import { useUpdateTodoDate } from "@/api/queries/todo/useUpdateTodoDate";
import { useDeleteTodo } from "@/api/queries/todo/useDeleteTodo";
import { useTodoStore } from "@/store/todoStore";
import type { Todo } from "@/store/todoStore";
import { useState } from "react";
import BottomPopup from "@/components/BottomPopup";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import MonthlyCalendar from "@/components/diary/MontlyCalendar";
import { formatDate, parseDateStringToDate } from "@/utils/date";

interface TodoItemProps {
  todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
  const { mutate: toggleTodo } = useToggleTodo();
  const { mutate: updateTodoContent } = useUpdateTodoContent();
  const { mutate: updateTodoDate } = useUpdateTodoDate();
  const { mutate: deleteTodo } = useDeleteTodo();
  const setTodos = useTodoStore(state => state.setTodos);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(todo.content);
  const [isComposing, setIsComposing] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const commitEdit = () => {
    const trimmed = value.trim();
    setEditing(false);
    if (!trimmed) {
      deleteTodo(todo.id);
      return;
    }

    setTodos(prev => prev.map(t => (t.id === todo.id ? { ...t, content: trimmed } : t)));
    updateTodoContent({ id: todo.id, data: { content: trimmed } });
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

  const handleDateSelect = (dateStr: string) => {
    const date = parseDateStringToDate(dateStr);
    const newDate = formatDate(date);
    setTodos(prev => prev.filter(t => t.id !== todo.id));
    updateTodoDate({ id: todo.id, date: newDate });
    setDatePickerOpen(false);
    setSheetOpen(false);
  };

  return (
    <li className="flex items-center gap-3">
      <Checkbox
        checked={todo.isComplete}
        onCheckedChange={() => {
          toggleTodo(todo.id);
        }}
      />
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
        <span className={todo.isComplete ? "text-gray-400" : ""} onClick={() => setEditing(true)}>
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
          <Button
            onClick={handleDelete}
            className="w-full bg-[#F36B6B] hover:bg-[#e96060] text-white"
          >
            삭제하기
          </Button>

          <Button
            onClick={() => {
              setSheetOpen(false);
              setDatePickerOpen(true);
            }}
            className="w-full"
          >
            날짜 변경하기
          </Button>
        </div>
      </BottomPopup>
      <BottomPopup
        isOpen={datePickerOpen}
        onClose={() => setDatePickerOpen(false)}
        heightOption={{ wrapChildren: true }}
      >
      <MonthlyCalendar
        disableOverlay
        selectedDate={todo.date}
        onDateSelect={handleDateSelect}
        />
      </BottomPopup>
    </li>
  );
}
