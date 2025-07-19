import React from "react";
import TodoHeader from "./TodoHeader";
import TodoList from "./TodoList";

export default function TodoSection() {
    return (
        <section className="flex flex-col w-full h-full p-4 gap-4">
            <div>
                <TodoHeader initialTab="할 일" />
                <TodoList />
            </div>
            <div>
                <TodoHeader initialTab="루틴" />
            </div>
        </section>
    );
}
