import axios from "axios";
import type { StrengthData } from "../../types/strength";

export const getStrength = async () => {
  const BASE_URL = import.meta.env.VITE_SOCIAL_AUTH_URL;

  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("❌ 액세스 토큰이 없습니다.");

  const response = await axios.get(`${BASE_URL}/strength`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getStrengthPeriod = async (
  token: string,
  year: string,
  month: string
): Promise<StrengthData> => {
  const BASE_URL = import.meta.env.VITE_SOCIAL_AUTH_URL;

  const response = await axios.get(`${BASE_URL}/strength/period/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    params: {
      year,
      month,
    },
  });
  return response.data;
};
