// api/services/diaryContent.ts
import api from "../axios";
import type { DiaryResponse } from "../../types/diary";

export const getDiaryContent = async (id: string): Promise<DiaryResponse> => {
  const response = await api.get(`/diary/${id}`);
  return response.data;
};

export const getDiaryContentResult = async (id: string): Promise<DiaryResponse> => {
  const response = await api.get(`/diary/json/${id}`);
  return response.data;
};
