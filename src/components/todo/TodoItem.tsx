import { useTodoStore } from "@/store/todoStore";

export default function TodoItem({ todo }) {
  const toggleTodo = useTodoStore((state) => state.toggleTodo);

  return (
    <li className="flex items-center gap-3">
      <button
        onClick={() => toggleTodo(todo.id)}
        className={`w-5 h-5 rounded-full border flex-shrink-0 ${
          todo.done ? "bg-gray-500" : ""
        }`}
      />
      <span className={todo.done ? "line-through text-gray-400" : ""}>
        {todo.text}
      </span>
    </li>
  );
}
