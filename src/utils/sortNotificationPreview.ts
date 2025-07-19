// utils/sortNotificationPreview.ts
import { Notification } from "@/types/notification";

export function getTop5Notifications(notifications: Notification[]) {
  const unread = notifications
    .filter((n) => !n.read)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const read = notifications
    .filter((n) => n.read)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return [...unread, ...read].slice(0, 5);
}

//unread + read = 5 개 항상 자르기 