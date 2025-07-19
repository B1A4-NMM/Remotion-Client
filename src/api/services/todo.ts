// Todo 목록 조회, 생성, 수정, 삭제 기능을 제공하는 서비스 모듈

import api from "../axios";

export interface ApiTodo {
  id: number;
  content: string;
  isComplete: boolean;
  date: string;
  // isRepeat: boolean;
  // repeatRule: string | null;
  // repeatEndDate: string | null;
  // createdAt: string;
  // updatedAt: string;
}

// ✅ 목록: year, month
export const getMonthlyStatus = async (year: string, month: string) => {
  if (import.meta.env.DEV) {
    console.log("📤 getMonthlyStatus called with:", { year, month });
  }
  const response = await api.get<Array<{
    date: string;
    todoTotalCount: number;
    completedCount: number;
    isAllCompleted: boolean;
  }>>("/todos/calendar", {
    params: { year, month },
  });

  if (import.meta.env.DEV) {
    console.log("📥 getMonthlyStatus response.data:", response.data);
  }
  return response.data;
};

export const getTodosByDate = async (date: string) => {
  if (import.meta.env.DEV) {
    console.log("📤 getTodosByDate called with:", { date });
  }
  const response = await api.get<ApiTodo[]>("/todos/calendar/date", {
    params: { date },
  });

  if (import.meta.env.DEV) {
    console.log("📥 getTodosByDate response.data:", response.data);
  }
  return response.data;
};

// ✅ 생성
export const createTodo = async ({ content, date }: { content: string; date: string }) => {
  try {
    if (import.meta.env.DEV) {
      console.log("✨ createTodo called with:", { content, date });
    }

    const response = await api.post<ApiTodo>("/todos/calendar", { content, date });

    if (import.meta.env.DEV) {
      console.log("✨ createTodo response.data:", response.data);
    }

    return response.data;
  } catch (error) {
    console.error("❌ createTodo error:", error);
    throw error;
  }
};

// ✅ 수정 (필드 업데이트)
export const updateTodo = async (id: number, data: Partial<Omit<ApiTodo, "id">>) => {
  try {
    if (import.meta.env.DEV) {
      console.log("🐛 updateTodo called with:", { id, data });
    }
    const response = await api.patch<ApiTodo>(`/todos/calendar/${id}`, data);

    if (import.meta.env.DEV) {
      console.log("🐛 updateTodo response.data:", response.data);
    }

    return response.data;
  } catch (error) {
    console.error("❌ updateTodo error:", error);
    throw error;
  }
};

// ✅ 삭제
export const deleteTodo = async (id: number) => {
  if (import.meta.env.DEV) {
    console.log("🗑️ deleteTodo called with:", { id });
  }
  const response = await api.delete(`/todos/calendar/${id}`);

  if (import.meta.env.DEV) {
    console.log("🗑️ deleteTodo response.data:", response.data);
  }

  return response.data;
};
