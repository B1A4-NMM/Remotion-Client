// TodoList.tsx
import { useTodoStore } from "@/store/todoStore";
import TodoItem from "./TodoItem";

export default function TodoList() {
    const todos = useTodoStore((state) => state.todos);
    const showDone = useTodoStore((state) => state.showDone);
    const toggleShowDone = useTodoStore((state) => state.toggleShowDone);

    const activeTodos = todos.filter((todo) => !todo.done);
    const doneTodos = todos.filter((todo) => todo.done);

    return (
        <div className="overflow-y-auto flex-grow">
        {/* 미완료 */}
        <ul className="space-y-2">
          {activeTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
  
        {/* 완료 숨김/표시 토글 */}
        {doneTodos.length > 0 && (
          <button
            onClick={toggleShowDone}
            className="text-sm text-gray-400 mt-4"
          >
            {showDone ? `Hide ${doneTodos.length} done` : `Show ${doneTodos.length} done`}
          </button>
        )}
  
        {/* 완료 리스트 */}
        {showDone && (
          <ul className="space-y-2">
            {doneTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        )}
      </div>
  );
}
