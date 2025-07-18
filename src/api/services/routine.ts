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

<<<<<<< HEAD
export const postRoutineByType = async (type: RoutineType, title: string): Promise<Routine> => {
  const response = await api.post(`/routine/${type}`, { title });
=======
export const postRoutineByType = async (type: RoutineType, content: string): Promise<Routine> => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.post(
    `${BASE_URL}/routine/${type}`,
    { content },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
>>>>>>> 04e38e86f0b0846d58ce0b34af0bfb01dec34f50
  return response.data;
};

export const deleteRoutineById =async (id :number): Promise<void> => {
  const token = localStorage.getItem("accessToken");
  await axios.delete(`${BASE_URL}/routine/${id}`,{
    headers: { Authorization: `Bearer ${token}` },
  });
}
