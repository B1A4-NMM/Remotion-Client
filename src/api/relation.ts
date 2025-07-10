// src/api/queries/relation/getRelation.ts
import axios from "axios";

export const getRelation = async () => {
  const BASE_URL = import.meta.env.VITE_SOCIAL_AUTH_URL;
  const token = localStorage.getItem("accessToken");

  console.log("🔍 /relation 데이터 요청 중...");

  const response = await axios.get(`${BASE_URL}/relation`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("✅ /relation 응답 데이터:", response.data);
  return response.data;
};
