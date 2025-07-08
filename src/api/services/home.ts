//home.ts
import axios from "axios";
import type {TodayDiaryResponse} from '../../types/diary'

export const getTodayDiary = async (token: string): Promise<TodayDiaryResponse> => {
  const BASE_URL = import.meta.env.VITE_SOCIAL_AUTH_URL;

  const response = await axios.get(`${BASE_URL}/diary/today`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// export type { TodayEmotion, TodayDiary, TodayDiaryResponse };
