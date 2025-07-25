import api from "../axios";

export const demoLogin = async (id: "traveler" | "lee" | "harry" | "demo") => {
  const response = await api.get("/auth/demo", {
    params: { id }, // 쿼리 파라미터로 전달
  });
  return response.data;
};
