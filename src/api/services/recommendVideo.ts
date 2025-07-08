// api/services/recommendVideo.ts
import axios from "axios";
import type { video } from "../../types/video";

export const getVideo = async (
  token: string, 
  period: number = 0
): Promise<video> => {
  const BASE_URL = import.meta.env.VITE_SOCIAL_AUTH_URL;

  const response = await axios.get(`${BASE_URL}/recommend/video`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    params: {
      period // 검색 기간 파라미터 추가
    }
  });

  return response.data;
};
