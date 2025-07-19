import React, { useState, useEffect, useRef } from "react";
import { useGetNotification } from "@/api/queries/notifications/useGetNotifications";
import { useNotificationExpand } from "@/hooks/useNotificationExpand";
import NotificationCard from "@/components/notification/NotificationCard"; 
import { useNavigate } from "react-router-dom";

type Tab =  "all" | " unread"; 
// TODO: 실제 앱에서는 isSubscribed를 Webpush context/prop 등에서 받아야 함
const isSubscribed = true;

export default function Notification() {
  const { data: notifications = [] } = useGetNotification();
  const { expandedId,handleToggleExpand } =useNotificationExpand();
  const navigate = useNavigate();
  const [tab,setTab] = useState<Tab>("all");

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

  // 탭에 따라 필터링된 알림
  const filteredNotifications =
    tab === "unread"
      ? sortedNotifications.filter((n) => !n.read)
      : sortedNotifications;


  return (
    <div className="p-6">

      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-muted-foreground mb-4"
      >
        ← 뒤로가기
      </button>


      <h1 className="text-2xl font-bold mb-6">전체 알림</h1>


      {/* 탭: 전체 / 안읽은 알림만 */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setTab("all")}
          className={`text-sm ${
            tab === "all" ? "font-bold underline text-black dark:text-white" : "text-gray-400"
          }`}
        >
          전체
        </button>
        <button
          onClick={() => setTab("unread")}
          className={`text-sm ${
            tab === "unread" ? "font-bold underline text-black dark:text-white" : "text-gray-400"
          }`}
        >
          안 읽은 것만
        </button>
      </div>

      {/*알림 목록*/}
      {filteredNotifications.length === 0 ? (
        <p className="text-sm text-muted-foreground">알림이 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {filteredNotifications.map((noti) => (
            <NotificationCard 
            key={noti.id} 
            noti={noti}
            isExpanded={expandedId === noti.id}
            onToggleExpand={handleToggleExpand}
            />
          ))}
        </ul>
      )}
    </div>
  ); 
}
