import { create } from "zustand";

interface SelectedDateState {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export const useSelectedDate = create<SelectedDateState>(set => ({
  selectedDate: new Date(),
  setSelectedDate: date => set({ selectedDate: date }),
}));