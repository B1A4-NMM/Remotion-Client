import axios from "axios";

export const getMentalData = async (
  emotion: "스트레스" | "불안" | "우울",
  period: string | number
) => {
  const BASE_URL = import.meta.env.VITE_SOCIAL_AUTH_URL;
  const token = localStorage.getItem("accessToken");

  console.log("📊 감정 데이터 요청 중...");
  console.log("emotion:", emotion);
  console.log("period:", period);

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

  console.log("✅ 감정 데이터 응답:", response.data); // 👉 추가된 부분

  return response.data;
};
