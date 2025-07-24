import { create } from "zustand";
import { getNotiCount } from "@/api/services/notification";
import { NotiCount } from "@/types/notification";

type NotiStore = { 
    count : number;
    fetchCount: () => Promise<void>;
    decreaseCount: () => void;
    resetCount: () => void;
};

//NotiStore 수정
export const useNotiStore = create<NotiStore>((set) => ({
    count: 0 ,

    fetchCount: async () => {
        try{
            const data:NotiCount =await getNotiCount();
            set({ count: data.count });
        }catch(err) { 
            console.error("알림 ")
        }
    },

    decreaseCount: () => set((state) => ({ count: Math.max(state.count -1 , 0) })),
    resetCount: () => set({ count: 0 }),
}));