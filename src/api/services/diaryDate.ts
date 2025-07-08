// api/services/diaryDate.ts
import axios from "axios";
import type { TodayDiaryResponse } from "../../types/diary";

export const getDiaryDate = async (
  token: string, 
  date: string
): Promise<TodayDiaryResponse> => {
  const BASE_URL = import.meta.env.VITE_SOCIAL_AUTH_URL;

  const response = await axios.get(`${BASE_URL}/diary/date`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    params: {
      date // 검색 기간 파라미터 추가
    }
  });

  return response.data;
};
