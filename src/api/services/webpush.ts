// api/services/webpush.ts
import api from "../axios";

export interface TestNotificationRequest {
  title: string;
  body: string;
  options?: {
    icon?: string;
    badge?: string;
    vibrate?: number[];
    data?: { url?: string };
  };
}

// 서버 API만 담당
export const subscribeToWebpush = async (subscription: PushSubscription) => {
  return api.post("/webpush/subscribe", subscription);
};

export const unsubscribeFromWebpush = async (endpoint: string) => {
  return api.post("/webpush/unsubscribe", { endpoint });
};

export const sendTestNotification = async (payload: TestNotificationRequest) => {
  const response = await api.post("/webpush/send-notification", payload);
  return response.data;
};


export const webpushStatus = async (endpoint: string): Promise<boolean> => {
  const response = await api.get("/webpush/status", {
    params: { endpoint },
  });
  return response.data;
};