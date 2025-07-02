//home.ts
import axios from "axios";

interface TodayEmotion {
  emotionType: string;
  intensity: number;
}

interface TodayDiary {
  diaryId: number;
  title: string;
  writtenDate: string;
  emotions: string[];
  targets: string[];
}

interface TodayDiaryResponse {
  todayEmotions: TodayEmotion[];
  todayDiaries: TodayDiary[];
}

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
