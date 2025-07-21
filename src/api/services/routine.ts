import api from "../axios";
import axios from "axios";
import { Routine, RoutineType } from "@/types/routine";

const BASE_URL = import.meta.env.VITE_SOCIAL_AUTH_URL;

export const getTriggerRoutine = async () => {
  const response = await api.get("/routine/trigger");
  // console.log("trigger", response);
  return response.data;
};

export const getRoutineByType = async (type: RoutineType): Promise<Routine[]> => {
  const response = await api.get(`/routine/${type}`);
  return response.data;
};

export const postRoutineByType = async (type: RoutineType, content: string): Promise<Routine> => {
  const response = await api.post(`/routine/${type}`, { content });
  return response.data;
};

export const deleteRoutineById = async (id: number): Promise<void> => {
  const token = localStorage.getItem("accessToken");
  await axios.delete(`${BASE_URL}/routine/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const patchRoutineById = async (id: number): Promise<void> => {
  const response = await api.patch(`/routine/${id}`);
  return response.data;
};
