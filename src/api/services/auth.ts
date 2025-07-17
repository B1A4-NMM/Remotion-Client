import axios from "axios";

export const demoLogin = async (id: "traveler" | "lee" | "harry" | "demo") => {
  const BASE_URL = import.meta.env.VITE_SOCIAL_AUTH_URL;
  const response = await axios.get(`${BASE_URL}/auth/demo`, {
    params: { id }, // 쿼리 파라미터로 전달
  });
  console.log(response.data);
  return response.data;
};
