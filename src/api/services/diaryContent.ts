// api/services/diaryContent.ts
import axios from "axios";
import type { DiaryResponse } from "../../types/diary";

export const getDiaryContent = async (token: string, id: string): Promise<DiaryResponse> => {
  const BASE_URL = import.meta.env.VITE_SOCIAL_AUTH_URL;
  
  const response = await axios.get(`${BASE_URL}/diary/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  
  return response.data;
};
