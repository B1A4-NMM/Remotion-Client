import React from "react";

import { Notification } from "@/types/notification";
import { getRedirectUrl } from "@/utils/getRedirectUrl";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";


// 알림 메세지 칸 하나하나 컴포넌트 처리 
export default function NotificationCard( { noti }: { noti: Notification }) {
    const navigate = useNavigate();
    const redirectUrl =getRedirectUrl(noti);

    const handleClick = () => {
        if(redirectUrl) {
            //redirectUrl 경로가 존재하면 이동
            navigate(redirectUrl);
        }
    };


    return (
        <li
      onClick={handleClick}
      className={clsx(
        "p-4 rounded-xl border cursor-pointer transition hover:shadow-md",
        noti.read
          ? "bg-muted/50 text-muted-foreground"
          : "bg-background text-foreground border-primary",
        "dark:bg-white/5 dark:text-white dark:border-white/10"
      )}
    >
      <div className="text-sm font-medium truncate">{noti.content}</div>
      <div className="text-[10px] text-muted-foreground mt-1">
        {new Date(noti.createdAt).toLocaleString()}
      </div>
    </li>
    );
}

