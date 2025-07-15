import axios from "axios";
const BASE_URL = import.meta.env.VITE_SOCIAL_AUTH_URL;

export async function getRecommendActivityWeekdayTomorrow() {
  const token = localStorage.getItem("accessToken") || "";
  if (!token) throw new Error("로그인 토큰이 없습니다.");
  const res = await axios.get(`${BASE_URL}/recommend/activity/weekday/today`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("getRecommendActivityWeekdayTomorrow", res.data);
  return res.data;
}
