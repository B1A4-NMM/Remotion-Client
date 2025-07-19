import React, { useEffect, useRef } from "react";
import { useGetNotification } from "@/api/queries/notifications/useGetNotifications";
import NotificationCard from "@/components/notification/NotificationCard"; 

// TODO: 실제 앱에서는 isSubscribed를 Webpush context/prop 등에서 받아야 함
const isSubscribed = true;

export default function Notification() {
  const { data: notifications = [] } = useGetNotification();
  // 최초 마운트 시 null, 이후에는 string[]
  const prevIdsRef = useRef<string[] | null>(null);
 
  //최신 순으로 정렬
  const sortedNotifications = notifications.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // 새 알림 감지 시 웹 푸시(로컬 Notification) 트리거
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.Notification === "undefined") return;
    if (prevIdsRef.current === null) {
      // 최초 마운트 시에는 알림 띄우지 않고 id만 저장
      prevIdsRef.current = sortedNotifications.map(noti => String(noti.id));
      return;
    }
    if (!isSubscribed) return;
    const prevIds = prevIdsRef.current;
    const newNotis = sortedNotifications.filter(noti => !prevIds.includes(String(noti.id)));
    if (newNotis.length > 0 && window.Notification.permission === "granted") {
      newNotis.forEach(noti => {
        const n: any = noti;
        new window.Notification(n.title || "새 알림", {
          body: n.body || n.content || "새로운 알림이 도착했습니다.",
          icon: "/favicon.ico"
        });
      });
    }
    prevIdsRef.current = sortedNotifications.map(noti => String(noti.id));
  }, [sortedNotifications]);

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
