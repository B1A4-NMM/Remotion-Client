import { useQuery } from "@tanstack/react-query";
import { getMonthlyStatus } from "@/api/services/todo";

export interface MonthlyStatus {
  date: string;
  todoTotalCount: number;
  completedCount: number;
  isAllCompleted: boolean;
}

/**
 * Fetch monthly todo status for the given date's month.
 */
export const useMonthlyStatus = (date: Date) => {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return useQuery<MonthlyStatus[]>({
    queryKey: ["monthlyStatus", year, month],
    queryFn: () => getMonthlyStatus(year, month),
  });
};