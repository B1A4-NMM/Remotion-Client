import React from "react";
import { useGetNotification } from  "@/api/queries/notifications/useGetNotifications"
import { Notification } from "@/types/notification";
import NotificationCard from "./NotificationCard";
import { Link } from "react-router-dom";

/* 상위 5개만 보여주는 컴포넌트 */


export default function NotificationPreview() {
    const { data: notifications = [] } = useGetNotification(); 

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
              <NotificationCard key={noti.id} noti={noti} />
            ))}
          </ul>
        )}
      </div>
    );


    
}