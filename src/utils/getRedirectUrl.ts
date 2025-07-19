import { Notification } from "@/types/notification";

//해시 테이블 기반 Map (Record) 구조

const redirectStrategies : Record<
    Notification["type"],
    (noti: Notification) => string
    > = {
        routine_added: () => "/routine",
        todo_incomplete: (noti) => 
            `/calendar?date=${noti.targetDate}`,
        recap_diary: (noti) =>
            `/diary/${noti.targetDate}`,
        character_changed : () => "analysis/character",
    };

export const getRedirectUrl = (noti: Notification): string => {
    return redirectStrategies[noti.type]?.(noti) || "/";
}; 