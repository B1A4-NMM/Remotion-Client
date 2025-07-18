import api from "../axios";
import { Routine, RoutineType } from "@/types/routine";

export const getTriggerRoutine = async () => {
  const response = await api.get("/routine/trigger");
  console.log("trigger", response);
  return response.data;
};

export const getRoutineByType = async (type: RoutineType): Promise<Routine[]> => {
  const response = await api.get(`/routine/${type}`);
  return response.data;
};

export const postRoutineByType = async (type: RoutineType, title: string): Promise<Routine> => {
  const response = await api.post(`/routine/${type}`, { title });
  return response.data;
};
