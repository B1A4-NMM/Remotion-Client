import axios from "axios";

export const getMentalData = async (
  emotion: "스트레스" | "불안" | "우울",
  period: string | number
) => {
  const BASE_URL = import.meta.env.VITE_SOCIAL_AUTH_URL;
  const token = localStorage.getItem("accessToken");

  const response = await axios.get(`${BASE_URL}/emotion`, {
    params: {
      emotion,
      period,
    },
    headers: {
      Authorization: `Bearer ${token}`,
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
