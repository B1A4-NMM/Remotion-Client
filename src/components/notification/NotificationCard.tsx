import React from "react";


import { Notification } from "@/types/notification";
import { getRedirectUrl } from "@/utils/getRedirectUrl";
import { usePatchNotification } from "@/api/queries/notifications/usePatchNotification";

import clsx from "clsx";
import { useNavigate } from "react-router-dom";


interface Props {
    noti: Notification;
    isExpanded: boolean;
    onToggleExpand: (noti: Notification) => void;
}

// 알림 메세지 칸 하나하나 컴포넌트 처리 
export default function NotificationCard( { noti,isExpanded,onToggleExpand }: Props) {
    const navigate = useNavigate();
    const redirectUrl =getRedirectUrl(noti);
    const patchMutation = usePatchNotification();

    const handleClick = () => {

        //1.클릭하는 순간 먼저 읽음 처리
        if (!noti.read) {
            patchMutation.mutate(noti.id);
        }

        //2.만약 오늘의 멘트면 확장만
        if (noti.type === "TODAY_COMMENT"){
            onToggleExpand(noti);
            return;
        }

        //3.각 알림마다 경로 리다이렉션 
        if(redirectUrl) {
            //redirectUrl 경로가 존재하면 이동
            navigate(redirectUrl);
        }
    };


    return (
        <li
  onClick={handleClick}
  className={clsx(
    "p-4 rounded-xl border cursor-pointer transition whitespace-pre-wrap break-words",
    noti.read
      ? // 읽은 알림 - 기존 스타일 유지
        "bg-muted/50 text-muted-foreground border border-white/10 "
      // 안 읽은 알림 - 강조
       : "noti-unread"
        
  )}
>
      <div className="text-sm font-medium ">
        {isExpanded ? noti.content : <span className = "truncate block">{noti.content}</span>}
      </div>
      <div className="text-[10px] text-muted-foreground mt-1">
        {new Date(noti.createdAt).toLocaleString()}
      </div>
    </li>
    );
}

