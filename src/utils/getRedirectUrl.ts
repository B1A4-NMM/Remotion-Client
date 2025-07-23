import { Notification } from "@/types/notification";

//해시 테이블 기반 Map (Record) 구조

export const redirectStrategies : Record<
    Notification["type"],
    (noti: Notification) => string
    > = {
        ROUTINE: () => "/routine",
        TODO: (noti) =>
            `/todos?date=${noti.targetDate}`,
        RECAP: (noti) =>
            `/result/${noti.diaryId}`,
        CHARACTER : () => "/analysis/character",
        TODAY_COMMENT : () => ""
};

export const getRedirectUrl = (noti: Notification): string => {
    return redirectStrategies[noti.type]?.(noti) || "/";
}; 