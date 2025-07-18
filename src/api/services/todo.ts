// Todo 목록 조회, 생성, 수정, 삭제 기능을 제공하는 서비스 모듈

import api from "../axios";

export interface ApiTodo {
  id: number;
  title: string;
  isCompleted: boolean;
  date: string | null;
  isRepeat: boolean;
  repeatRule: string | null;
  repeatEndDate: string | null;
  createdAt: string;
  updatedAt: string;
}

// ✅ 목록: from/to 유지
export const getTodos = async (from: string, to: string) => {
  console.log("📤 getTodos called with:", { from, to });

  const response = await api.get<{ todos: ApiTodo[] }>("/todos", {
    params: { from, to },
  });

  console.log("📥 getTodos response.data:", response.data);

  return response.data.todos;
};

// ✅ 생성
export const createTodo = async ({ title }: { title: string }) => {
  try {
    console.log("✨ createTodo called with:", { title });

    const response = await api.post<ApiTodo>("/todos", { title });

    console.log("✨ createTodo response.data:", response.data);

    return response.data;
  } catch (error) {
    console.error("❌ createTodo error:", error);
    throw error;
  }
};

// ✅ 수정 (필드 업데이트)
export const updateTodo = async (id: number, data: Partial<Omit<ApiTodo, "id">>) => {
  try {
    console.log("🐛 updateTodo called with:", { id, data });

    const response = await api.patch<ApiTodo>(`/todos/${id}`, data);

    console.log("🐛 updateTodo response.data:", response.data);

    return response.data;
  } catch (error) {
    console.error("❌ updateTodo error:", error);
    throw error;
  }
};

// ✅ 삭제
export const deleteTodo = async (id: number) => {
  console.log("🗑️ deleteTodo called with:", { id });

  const response = await api.delete(`/todos/${id}`);

  console.log("🗑️ deleteTodo response.data:", response.data);
  return response.data;
};
