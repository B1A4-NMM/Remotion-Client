import { useQuery } from "@tanstack/react-query";
import { getRecommendActivityWeekdayTomorrow } from "../../services/recommend";

export function useRecommendActivityWeekdayTomorrow(token: string) {
  return useQuery({
    queryKey: ["recommendActivityWeekdayTomorrow", token],
    queryFn: () => getRecommendActivityWeekdayTomorrow(token),
    enabled: !!token,
  });
}
