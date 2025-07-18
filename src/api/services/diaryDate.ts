// api/services/diaryDate.ts
import api from "../axios";
import type { TodayDiaryResponse } from "../../types/diary";

export const getDiaryDate = async (date: string): Promise<TodayDiaryResponse> => {
  const response = await api.get("/diary/date", {
    params: {
      date, // 검색 기간 파라미터 추가
    },
  });

  return response.data;
};
