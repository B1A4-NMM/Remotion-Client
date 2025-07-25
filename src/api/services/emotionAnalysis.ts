// api/services/character.ts
import api from "../axios";
import type { EmotionAnalysisResponse } from "../../types/diary";

export const getEmotionAnalysis = async (): Promise<EmotionAnalysisResponse> => {
  const response = await api.get("/member/emotion/base-analysis");
  return response.data;
};
