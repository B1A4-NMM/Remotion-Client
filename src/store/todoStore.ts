import { create } from "zustand";

export type Todo = {
    id: number;
    title: string;
    isCompleted: boolean;
    date: string;
    isRepeat: boolean;
    repeatRule: string | null;
    repeatEndDate: string | null;
};

type TodoStore = {
    todos: Todo[];
    setTodos: (updater: Todo[] | ((prev: Todo[]) => Todo[])) => void;
    deleteTodo: (id: number) => void;
    showDone: boolean;
    toggleShowDone: () => void;
};

export const useTodoStore = create<TodoStore>((set, get) => ({
    todos: [
        {
            id: 1,
            title: "캘린더 기능 구현",
            isCompleted: false,
            date: "",
            isRepeat: false,
            repeatRule: null,
            repeatEndDate: null,
        },
        {
            id: 2,
            title: "팀원들과 소통 개선",
            isCompleted: false,
            date: "",
            isRepeat: false,
            repeatRule: null,
            repeatEndDate: null,
        },
        {
            id: 3,
            title: "의견 차이 관리 방법 연구",
            isCompleted: false,
            date: "",
            isRepeat: false,
            repeatRule: null,
            repeatEndDate: null,
        },
    ],

    setTodos: (updater) => {
        const next = typeof updater === "function" ? (updater as (prev: Todo[]) => Todo[])(get().todos) : updater;
        set({ todos: next });
    },

    deleteTodo: (id) => {
        set((state) => ({ todos: state.todos.filter((todo) => todo.id !== id) }));
    },

    showDone: false,
    toggleShowDone: () =>
        set((state) => ({ showDone: !state.showDone })),
}));
