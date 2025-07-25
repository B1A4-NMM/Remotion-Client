import api from "../axios";

export async function getRecommendActivityWeekdayTomorrow() {
  const res = await api.get("/recommend/activity/weekday/today");
  return res.data;
}
