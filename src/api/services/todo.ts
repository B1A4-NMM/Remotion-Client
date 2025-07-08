// Axios 인스턴스를 생성해(baseURL: import.meta.env.VITE_API_URL)
// Todo 목록 조회, 생성, 수정, 삭제 기능을 제공하는 서비스 모듈

import axios from "axios";

const BASE_URL = import.meta.env.VITE_SOCIAL_AUTH_URL;

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

const api = axios.create({
  baseURL: BASE_URL,
});

// 모든 요청에 Authorization 헤더 자동 추가
api.interceptors.request.use(config => {
  const token = localStorage.getItem("accessToken") ?? "";
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

// ✅ 목록: from/to 유지
export const getTodos = async (from: string, to: string) => {
  console.log("📤 getTodos called with:", { from, to });

  const response = await api.get<ApiTodo[]>(`${BASE_URL}/todos`, {
    params: { from, to },
  });

  console.log("📥 getTodos response.data:", response.data);

  return response.data.todos;
};

// ✅ 생성
export const createTodo = async ({ title }: { title: string }) => {
  try {
  console.log("✨ createTodo called with:", { title });

  const response = await api.post<ApiTodo>(`${BASE_URL}/todos`, { title });

  console.log("✨ createTodo response.data:", response.data);

  return response.data;
}
  catch (error) {
    console.error("❌ createTodo error:", error);
    throw error;
  }
};

// ✅ 수정 (필드 업데이트)
export const updateTodo = async (id: number, data: Partial<Omit<ApiTodo, "id">>) => {
  try {
  console.log("🐛 updateTodo called with:", { id, data });

  const response = await api.patch<ApiTodo>(`${BASE_URL}/todos/${id}`, data);

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

  const response = await api.delete(`${BASE_URL}/todos/${id}`);

  console.log("🗑️ deleteTodo response.data:", response.data);
  return response.data;
};
