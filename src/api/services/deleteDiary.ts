// api/services/diary/deleteDiary.ts
import axios from "axios";

export const deleteDiary = async (token: string, diaryId: string): Promise<void> => {
  const BASE_URL = import.meta.env.VITE_SOCIAL_AUTH_URL;

  await axios.delete(`${BASE_URL}/diary/${diaryId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
