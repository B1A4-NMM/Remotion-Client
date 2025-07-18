import React from "react";
import { useGetNotifications } from  "@/api/queries/notifications/useGetNotifications"
import { Notification } from "@/types/notification";
import { Link } from "react-router-dom";

/* 상위 5개만 보여주는 컴포넌트 */


export default function NotificationPreview() {
    const { data: notifications = [] } = useGetNotifications(); 

    const recentNotifications = notifications
    .slice()
    .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0,5); //5개만 자르기 


    return (
        <div className="bg-card rounded-2xl shadow-lg p-6 mb-6 border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">최근 알림</h2>
            <Link to="/notifications" className="text-sm text-primary hover:underline">
              더보기
            </Link>
          </div>
    
          {recentNotifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">최근 알림이 없습니다.</p>
          ) : (
            <ul className="space-y-3">
              {recentNotifications.map((noti) => (
                <li
                  key={noti.id}
                  className={`p-3 rounded-lg border ${
                    noti.read
                      ? "bg-muted text-muted-foreground"
                      : "bg-accent text-foreground border-primary"
                  }`}
                >
                  <div className="font-medium truncate">{noti.title}</div>
                  <div className="text-xs mt-1 truncate">{noti.content}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    {new Date(noti.createdAt).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
      </div>
    );
}