import axios from "axios";
import { Routine, RoutineType } from "@/types/routine";

const BASE_URL = import.meta.env.VITE_SOCIAL_AUTH_URL;

export const getTriggerRoutine = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("토큰 없음");

  const response = await axios.get(`${BASE_URL}/routine/trigger`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("trigger", response);
  return response.data;
};

export const getRoutineByType = async (type: RoutineType): Promise<Routine[]> => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get(`${BASE_URL}/routine/${type}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const postRoutineByType = async (type: RoutineType, content: string): Promise<Routine> => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.post(
    `${BASE_URL}/routine/${type}`,
    { content },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const deleteRoutineById =async (id :number): Promise<void> => {
  const token = localStorage.getItem("accessToken");
  await axios.delete(`${BASE_URL}/routine/${id}`,{
    headers: { Authorization: `Bearer ${token}` },
  });
}
