import {
  addDays,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  format,
} from "date-fns";

export const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

export const getMonthDates = (date: Date): Date[] => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return Array.from({ length: end.getDate() }, (_, i) => addDays(start, i));
};

export const nextMonth = (date: Date) => addMonths(date, 1);
export const prevMonth = (date: Date) => subMonths(date, 1);

export function parseDateStringToDate(dateStr: string): Date { 
  return new Date(dateStr); 
}