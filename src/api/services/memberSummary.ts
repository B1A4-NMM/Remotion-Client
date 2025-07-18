// api/services/memberSummary.ts
import api from "../axios";
import type { MemberSummaryResponse } from "../../types/diary";

export const getMemberSummary = async (days: number = 3): Promise<MemberSummaryResponse> => {
  const response = await api.get("/member/summary", {
    params: {
      days, // 검색 기간 파라미터 추가
    },
  });
  // console.log("📦 Member Summary Response:", response.data);

  return response.data;
};
