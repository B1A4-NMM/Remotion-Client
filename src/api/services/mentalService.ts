import api from "../axios";

export const getMentalData = async (
  emotion: "스트레스" | "불안" | "우울",
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
  });

  return response.data;
};
