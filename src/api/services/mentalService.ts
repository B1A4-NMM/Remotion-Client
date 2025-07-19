import api from "../axios";

export const getMentalData = async (
  emotion: "스트레스" | "불안" | "우울" | "활력" | "안정" | "유대",
  period: string | number
) => {
  const response = await api.get("/emotion", {
    params: {
      emotion,
      period,
    },
    paramsSerializer: params => {
      const usp = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        usp.append(key, String(value));
      });
      return usp.toString();
    },
    timeout: 15000, // 15초 타임아웃 유지
  });

  return response.data;
};
