import api from "../axios";
import api from "../axios";

export async function getRecommendActivityWeekdayTomorrow() {
  const res = await api.get("/recommend/activity/weekday/today");
  // console.log("getRecommendActivityWeekdayTomorrow", res.data);
  return res.data;
}
