//home.ts
import api from "../axios";
import type { HomeResponse } from "../../types/diary";

export const getHomeData = async (): Promise<HomeResponse> => {
  const response = await api.get("/diary/home");
  return response.data;
};

// export type { TodayEmotion, TodayDiary, TodayDiaryResponse };
