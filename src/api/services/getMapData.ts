// src/api/getMapData.ts
import axios from "axios";

export const getMapData = async () => {
  const BASE_URL = import.meta.env.VITE_SOCIAL_AUTH_URL;
  const token = localStorage.getItem("accessToken");

  try {
    const response = await axios.get(`${BASE_URL}/map`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("📥 /map 응답 데이터:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ /map 요청 실패:", error);
    throw error;
  }
};
