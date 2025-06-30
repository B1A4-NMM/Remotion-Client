import React from "react";
import TodoHeader from "./TodoHeader";
import TodoList from "./TodoList";
import TodoInput from "./TodoInput";

export default function TodoSection() {
    return (
        <section className="flex flex-col w-full h-full p-4">
            <TodoHeader />
            <TodoList />
            <TodoInput />
        </section>
    );
}
