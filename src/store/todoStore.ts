import { create } from "zustand"; // 상태관리

export type Todo = {
    id: number;
    content: string;
    isComplete: boolean;
    date: string;
    // isRepeat: boolean;
    // repeatRule: string | null;
    // repeatEndDate: string | null;
    // createdAt: string;
    // updatedAt: string;
};

type TodoStore = {
    todos: Todo[];
    setTodos: (updater: Todo[] | ((prev: Todo[]) => Todo[])) => void;
    deleteTodo: (id: number) => void;
    showDone: boolean;
    toggleShowDone: () => void;
};

export const useTodoStore = create<TodoStore>((set, get) => ({
    todos: [],

    setTodos: (updater) => {
        const next = 
        typeof updater === "function" 
            ? (updater as (prev: Todo[]) => Todo[])(get().todos) 
            : updater;
        set({ todos: next });
    },

    deleteTodo: (id: number) => {
        set((state) => ({ 
            todos: state.todos.filter((todo) => todo.id !== id),
        }));
    },

    showDone: false,
    toggleShowDone: () =>
        set((state) => ({ showDone: !state.showDone })),
}));
