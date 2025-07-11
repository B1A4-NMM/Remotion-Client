import React from "react";
import TodoHeader from "./TodoHeader";
import TodoList from "./TodoList";

export default function TodoSection() {
    return (
        <section className="flex flex-col w-full h-full p-4">
            <TodoHeader className="flex-none" />
            <div className="flex-grow overflow-y-auto">
                <TodoList />
            </div>
        </section>
    );
}
