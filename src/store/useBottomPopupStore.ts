import { create } from "zustand";

interface BottomPopupState {
    isOpen: boolean;
    open: () => void;
    close : () => void;
}

export const useBottomPopupStore = create<BottomPopupState>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
  }));