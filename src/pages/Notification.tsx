import React from "react";
import { useGetNotification } from "@/api/queries/notifications/useGetNotifications";
import NotificationCard from "@/components/notification/NotificationCard"; 


export default function Notification() {
  const { data: notifications = [] } = useGetNotification();
 
  //최신 순으로 정렬
  const sortedNotifications =notifications.sort(
    (a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">전체 알림</h1>

      {sortedNotifications.length === 0 ? (
        <p className="text-sm text-muted-foreground">알림이 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {sortedNotifications.map((noti) => (
            <NotificationCard key={noti.id} noti={noti} />
          ))}
        </ul>
      )}
    </div>
  ); 
}
