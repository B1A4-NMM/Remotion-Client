import { addDays, addMonths, subMonths, startOfMonth, endOfMonth } from "date-fns";

export const formatDate = (date: Date) => date.toISOString().slice(0, 10);

export const getMonthDates = (date: Date): Date[] => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return Array.from({ length: end.getDate() }, (_, i) => addDays(start, i));
};

export const nextMonth = (date: Date) => addMonths(date, 1);
export const prevMonth = (date: Date) => subMonths(date, 1);
