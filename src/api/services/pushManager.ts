// services/pushManager.ts
import { urlBase64ToUint8Array } from "@/utils/webpush";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY!;

export class PushManagerService {
  // 브라우저 지원 확인
  static isSupported(): boolean {
    return "serviceWorker" in navigator && "PushManager" in window;
  }

  // 권한 요청
  static async requestPermission(): Promise<boolean> {
    if (Notification.permission === "granted") return true;
    
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  // 구독 생성/가져오기
  static async getOrCreateSubscription(): Promise<PushSubscription | null> {
    try {
      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
      }

      return subscription;
    } catch (error) {
      console.error("Error getting subscription:", error);
      return null;
    }
  }
}
