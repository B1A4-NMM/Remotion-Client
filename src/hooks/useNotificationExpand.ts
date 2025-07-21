// hooks/useNotificationExpand.ts
import { useState } from "react";
import { Notification } from "@/types/notification";

export function useNotificationExpand() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleToggleExpand = (noti: Notification) => {
    setExpandedId((prev) => (prev === noti.id ? null : noti.id));
  };

  return {
    expandedId,
    handleToggleExpand,
  };
}
