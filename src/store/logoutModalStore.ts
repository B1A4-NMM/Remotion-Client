import { create } from "zustand";

interface LogoutModalStore {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useLogoutModalStore = create<LogoutModalStore>(set => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
