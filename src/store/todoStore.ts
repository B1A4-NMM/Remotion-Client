import { create } from "zustand";

export type Todo = {
    id: number;
    text: string;
    done: boolean;
};

type TodoStore = {
    todos: Todo[];
    addTodo: (text: string) => void;
    toggleTodo: (id: number) => void;
    deleteTodo: (id: number) => void;
    showDone: boolean;
    toggleShowDone: () => void;
};

export const useTodoStore = create<TodoStore>((set) => ({
    todos: [
        { id: 1, text: "캘린더 테스트", done: false },
        { id: 2, text: "할 일 입력", done: false },
    ],

    addTodo: (text) =>
        set((state) => ({
            todos: [...state.todos, { id: Date.now(), text, done: false }],
        })),

    toggleTodo: (id) =>
        set((state) => ({
            todos: state.todos.map((todo) =>
                todo.id === id ? { ...todo, done: !todo.done } : todo
        ),
        })),

    deleteTodo: (id) =>
        set((state) => ({
            todos: state.todos.filter((todo) => todo.id !== id),
        })),
    
    showDone: false,
    toggleShowDone: () => 
        set((state) => ({ showDone: !state.showDone })),
}));
