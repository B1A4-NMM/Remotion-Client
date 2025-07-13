//home.ts
import axios from "axios";
import type { HomeResponse } from "../../types/diary";

export const getHomeData = async (token: string): Promise<HomeResponse> => {
  const BASE_URL = import.meta.env.VITE_SOCIAL_AUTH_URL;

  const response = await axios.get(`${BASE_URL}/diary/home`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// export type { TodayEmotion, TodayDiary, TodayDiaryResponse };
