// api/services/character.ts
import axios from "axios";
import type { EmotionAnalysisResponse } from "../../types/diary";

export const getEmotionAnalysis = async (token: string): Promise<EmotionAnalysisResponse> => {
  const BASE_URL = import.meta.env.VITE_SOCIAL_AUTH_URL;

  const response = await axios.get(`${BASE_URL}/member/emotion/base-analysis`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  // console.log("response.data", response.data);

  return response.data;
};
