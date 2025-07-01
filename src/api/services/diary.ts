import axios from "axios";

interface DiaryPayload {
  content: string;
  writtenDate: string;
  weather: string;
  token: string;
}

export const postDiary = async ({ content, writtenDate, weather, token }: DiaryPayload) => {
  const BASE_URL = import.meta.env.VITE_SOCIAL_AUTH_URL;

  const requestBody = { content, writtenDate, weather };

  console.log("📦 요청 데이터:", requestBody);
  console.log("🔐 Authorization 헤더:", `Bearer ${token}`);

  const response = await axios.post(`${BASE_URL}/diary`, requestBody, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data; // 꼭 있어야 useMutation의 data에 전달됨
};
