import { useState } from "react";
import { useTodoStore } from "@/store/todoStore";

export default function TodoInput() {
  const [text, setText] = useState("");
  const addTodo = useTodoStore((state) => state.addTodo);

  const handleAdd = () => {
    if (text.trim()) {
      addTodo(text.trim());
      setText("");
    }
  };

  return (
    <div className="flex gap-2 mt-4">
      <input
        type="text"
        placeholder="New todo"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border px-2 py-1 rounded w-full"
      />
      <button
        onClick={handleAdd}
        className="px-4 py-1 bg-blue-500 text-white rounded"
      >
        추가
      </button>
    </div>
  );
}
