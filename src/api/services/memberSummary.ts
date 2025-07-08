// api/services/memberSummary.ts
import axios from "axios";
import type { MemberSummaryResponse } from "../../types/diary";

export const getMemberSummary = async (
  token: string, 
  days: number = 3
): Promise<MemberSummaryResponse> => {
  const BASE_URL = import.meta.env.VITE_SOCIAL_AUTH_URL;

  const response = await axios.get(`${BASE_URL}/member/summary`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    params: {
      days // 검색 기간 파라미터 추가
    }
  });

  return response.data;
};
