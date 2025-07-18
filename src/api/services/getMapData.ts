// src/api/getMapData.ts
import api from "../axios";

export const getMapData = async () => {
  try {
    const response = await api.get("/map");
    console.log("📥 /map 응답 데이터:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ /map 요청 실패:", error);
    throw error;
  }
};
