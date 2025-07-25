import { useTodoStore } from "@/store/todoStore";
import { useEffect } from "react";
import TodoItem from "./TodoItem";
import TodoInputRow from "./TodoInputRow";
import { useTodos } from "@/api/queries/todo/useTodos";
import { useSelectedDate } from "@/hooks/useSelectedDate";
import { formatDate } from "@/utils/date";

export default function TodoList() {
  const todos = useTodoStore(state => state.todos);
  const showDone = useTodoStore(state => state.showDone);
  const toggleShowDone = useTodoStore(state => state.toggleShowDone);

  const { selectedDate } = useSelectedDate();
  const { data: fetchedTodos } = useTodos(formatDate(selectedDate));
  const setTodos = useTodoStore(state => state.setTodos);

  useEffect(() => {
    if (!fetchedTodos) return;

    if (Array.isArray(fetchedTodos)) {
      setTodos(fetchedTodos);
    } else {
      console.error("fetchedTodos is not an array", fetchedTodos);
    }
  }, [fetchedTodos, setTodos]);

  const activeTodos = Array.isArray(todos)
    ? todos.filter(todo => !todo.isComplete).sort((a, b) => a.id - b.id)
    : [];
  const doneTodos = Array.isArray(todos)
    ? todos.filter(todo => todo.isComplete).sort((a, b) => a.id - b.id)
    : [];
  return (
    <div className="overflow-y-auto flex-grow">
      {/* 미완료 + 인라인 New todo */}
      <ul className="space-y-2">
        {activeTodos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
        <TodoInputRow />
      </ul>

      {/* 완료 숨김/표시 토글 */}
      {doneTodos.length > 0 && (
        <button onClick={toggleShowDone} className="text-sm text-gray-400 mt-4">
          {showDone ? `Hide ${doneTodos.length} done` : `Show ${doneTodos.length} done`}
        </button>
      )}

      {/* 완료 리스트 */}
      {showDone && (
        <ul className="space-y-2">
          {doneTodos.map(todo => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      )}
    </div>
  );
}
