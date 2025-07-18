import React from "react";
import { useGetNotifications } from "@/api/queries/notifications/useGetNotifications";

export default function Notifications() {
  const { data: notifications = [] } = useGetNotifications();

  return (
    <div className="min-h-screen p-6 bg-background text-foreground">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">전체 알림</h1>

        {notifications.length === 0 ? (
          <p className="text-sm text-muted-foreground">알림이 없습니다.</p>
        ) : (
          <ul className="space-y-4">
            {notifications.map((noti) => (
              <li
                key={noti.id}
                className={`p-4 rounded-xl border ${
                  noti.read
                    ? "bg-muted text-muted-foreground"
                    : "bg-accent text-foreground border-primary"
                }`}
              >
                <div className="font-medium">{noti.title}</div>
                <div className="text-sm">{noti.content}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {new Date(noti.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
