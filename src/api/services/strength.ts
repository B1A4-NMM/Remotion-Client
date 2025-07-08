import axios from "axios";

export const getStrength = async () => {
  const BASE_URL = import.meta.env.VITE_SOCIAL_AUTH_URL;

  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("❌ 액세스 토큰이 없습니다.");

  const response = await axios.get(`${BASE_URL}/strength`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("✅ /strength 응답 데이터:", response.data);

  return response.data;
};
