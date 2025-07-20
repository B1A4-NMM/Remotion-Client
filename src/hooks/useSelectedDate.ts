import { useSelectedDate as useSelectedDateStore } from "@/store/calendarStore";

export const useSelectedDate = () => {
  return useSelectedDateStore();
};