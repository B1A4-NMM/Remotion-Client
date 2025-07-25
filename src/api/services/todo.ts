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
  }
  const response = await api.get<
    Array<{
      date: string;
      todoTotalCount: number;
      completedCount: number;
      isAllCompleted: boolean;
    }>
  >("/todos/calendar", {
    params: { year, month },
  });

  // if (import.meta.env.DEV) {
  // }
  return response.data;
};

// ✅ 목록: year, month, date
export const getTodosByDate = async (date: string) => {
  // if (import.meta.env.DEV) {
  // }
  const response = await api.get<ApiTodo[]>("/todos/calendar/date", {
    params: { date },
  });

  // if (import.meta.env.DEV) {
  // }
  return response.data;
};

// ✅ 생성
export const createTodo = async ({
  content,
  date,
}: {
  content: string;
  date: string;
}) => {
  try {
    // if (import.meta.env.DEV) {
    // }

    const response = await api.post<ApiTodo>("/todos/calendar", {
      content,
      date,
    });

    // if (import.meta.env.DEV) {
    // }

    return response.data;
  } catch (error) {
    console.error("❌ createTodo error:", error);
    throw error;
  }
};

// ✅ 수정 (내용 변경)
export const updateTodoContent = async (
  id: number,
  data: Partial<Omit<ApiTodo, "id">>,
) => {
  try {
    // if (import.meta.env.DEV) {
    // }
    const response = await api.patch<ApiTodo>(`/todos/calendar/content/${id}`, data);

    // if (import.meta.env.DEV) {
    // }

    return response.data;
  } catch (error) {
    console.error("❌ updateTodo error:", error);
    throw error;
  }
};

// ✅ 수정 (날짜 변경)
export const updateTodoDate = async (id: number, date: string) => {
  try {
    // if (import.meta.env.DEV) {
    // }
    const response = await api.patch<ApiTodo>(`/todos/calendar/date/${id}`, {
      date,
    });

    // if (import.meta.env.DEV) {
    // }

    return response.data;
  } catch (error) {
    console.error("❌ updateTodoDate error:", error);
    throw error;
  }
};

// ✅ 토글 (isComplete)
export const toggleTodo = async (id: number) => {
  try {
    // if (import.meta.env.DEV) {
    // }
    const response = await api.patch<ApiTodo>(`/todos/calendar/${id}`);

    // if (import.meta.env.DEV) {
    // }

    return response.data;
  } catch (error) {
    console.error("❌ toggleTodo error:", error);
    throw error;
  }
};

// ✅ 삭제
export const deleteTodo = async (id: number) => {
  try {
    // if (import.meta.env.DEV) {
    // }
    const response = await api.delete(`/todos/calendar/${id}`);

    // if (import.meta.env.DEV) {
    // }

    return response.data;
  } catch (error) {
    console.error("❌ deleteTodo error:", error);
    throw error;
  }
};
