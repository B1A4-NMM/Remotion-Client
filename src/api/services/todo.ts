// Axios 인스턴스를 생성해(baseURL: import.meta.env.VITE_API_URL) 
// Todo 목록 조회, 생성, 수정, 삭제 기능을 제공하는 서비스 모듈

import axios from "axios";
// import type { Todo } from "@/store/todoStore";

export interface ApiTodo {
    id: string;
    title: string;
    isCompleted: boolean;
    createdAt?: string;
    updatedAt?: string;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// 모든 요청에 Authorization 헤더 자동 추가
api.interceptors.request.use((config) => {
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
    const response = await api.get<ApiTodo[]>("/api/todos", {
        params: { from, to },
    });
    return response.data;
};

// ✅ 생성
export const createTodo = async ({ title }: { title: string }) => {
    const response = await api.post<ApiTodo>("/api/todos", { title });
    return response.data;
};

// ✅ 상태 toggle (권장!)
export const toggleTodo = async (id: string) => {
    const response = await api.patch<ApiTodo>(`/api/todos/${id}/toggle`);
    return response.data;
};

// ✅ 수정 (필드 업데이트)
export const updateTodo = async (
    id: string,
    data: Partial<Omit<ApiTodo, "id">>
) => {
    const response = await api.patch<ApiTodo>(`/api/todos/${id}`, data);
    return response.data;
};

// ✅ 삭제
export const deleteTodo = async (id: string) => {
    const response = await api.delete(`/api/todos/${id}`);
    return response.data;
};