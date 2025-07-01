// Axios 인스턴스를 생성해(baseURL: import.meta.env.VITE_API_URL) 
// Todo 목록 조회, 생성, 수정, 삭제 기능을 제공하는 서비스 모듈

import axios from "axios";

export interface Todo {
  id: string;
  title: string;
  done: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getTodos = async (from: string, to: string) => {
  const response = await api.get<Todo[]>("/todo", {
    params: { from, to },
  });
  return response.data;
};

export const createTodo = async ({ title }: { title: string }) => {
  const response = await api.post<Todo>("/todo", { title });
  return response.data;
};

export const updateTodo = async (
  id: string,
  data: Partial<Omit<Todo, "id">>
) => {
  const response = await api.patch<Todo>(`/todo/${id}`, data);
  return response.data;
};

export const deleteTodo = async (id: string) => {
  const response = await api.delete(`/todo/${id}`);
  return response.data;
};