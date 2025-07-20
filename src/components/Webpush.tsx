// components/Webpush.tsx
import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { isPushSupported, urlBase64ToUint8Array } from "../utils/webpush";
import { subscribeToWebpush, unsubscribeFromWebpush, webpushStatus } from "@/api/services/webpush";
import { PushManagerService } from "@/api/services/pushManager";
import { WEBPUSH_CONFIG } from "../../webpush";

const Webpush = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(
    Notification.permission === "granted"
  );
  const [loading, setLoading] = useState(true);

  // 초기 상태 확인 개선
  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if (!isPushSupported()) {
        setLoading(false);
        return;
      }

      try {
        const registration = await navigator.serviceWorker.ready;
        const browserSub = await registration.pushManager.getSubscription();
        
        setSubscription(browserSub);
        
        if (browserSub) {
          // 브라우저에 구독이 있으면 서버 상태 확인
          try {
            const serverStatus = await webpushStatus(browserSub.endpoint);
            setIsSubscribed(serverStatus);
          } catch (error) {
            console.error("서버 상태 확인 실패:", error);
            // 서버 확인 실패 시 브라우저 구독 상태 기준으로 설정
            setIsSubscribed(true);
          }
        } else {
          // 브라우저에 구독이 없으면 false
          setIsSubscribed(false);
        }
      } catch (error) {
        console.error("구독 상태 확인 실패:", error);
        setIsSubscribed(false);
      } finally {
        setLoading(false);
      }
    };

    checkSubscriptionStatus();
  }, []);

  const handleToggle = async () => {
    if (loading) return;
    
    if (isSubscribed) {
      await unsubscribeUser();
    } else {
      await subscribeUser();
    }
  };

  const subscribeUser = async () => {
    if (!PushManagerService.isSupported()) {
      alert("Push messaging is not supported");
      return;
    }
    const hasPermission = await PushManagerService.requestPermission();
    if (!hasPermission) {
      alert("Notification permission not granted.");
      return;
    }
    setPermissionGranted(true);
    try {
      setLoading(true);
      // 기존 구독이 있으면 재사용
      const registration = await navigator.serviceWorker.ready;
      if (!registration) {
        alert("Service worker is not ready. Please refresh the page or check registration.");
        setLoading(false);
        return;
      }
      let pushSubscription = await registration.pushManager.getSubscription();
      if (!pushSubscription) {
        pushSubscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: WEBPUSH_CONFIG.VAPID_PUBLIC_KEY
            ? urlBase64ToUint8Array(WEBPUSH_CONFIG.VAPID_PUBLIC_KEY)
            : undefined,
        });
      }
      setSubscription(pushSubscription);
      await subscribeToWebpush(pushSubscription);
      setIsSubscribed(true);
    } catch (error) {
      console.error("Error subscribing:", error);
      alert("구독 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const unsubscribeUser = async () => {
    if (!subscription) {
      return;
    }

    try {
      setLoading(true);
      
      // 1. 서버에서 구독 취소 (브라우저 구독 취소 전에)
      await unsubscribeFromWebpush(subscription.endpoint);
            
      // 2. 상태 업데이트
      setIsSubscribed(false);
      setSubscription(null);
      
    } catch (error) {
      console.error("Error unsubscribing:", error);
      alert("구독 취소 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl shadow-lg p-6 mb-6 border">
      <h2 className="text-xl font-semibold mb-4">웹 푸시 설정</h2>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bell />
          <span className="text-sm text-muted-foreground">
            알림 설정
          </span>
        </div>
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
            loading
              ? "bg-gray-300 cursor-not-allowed"
              : isSubscribed
                ? "bg-blue-800 hover:bg-blue-900"
                : "bg-gray-400 hover:bg-gray-500"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
              loading
                ? "translate-x-3.5" // 중간 위치
                : isSubscribed
                  ? "translate-x-6"
                  : "translate-x-1"
            }`}
          />
        </button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        {loading
          ? "상태 확인 중..."
          : isSubscribed
            ? "웹 푸시 받기로 설정되어 있습니다."
            : "웹 푸시 받기가 비활성화되어 있습니다."}
      </p>
    </div>
  );
};

export default Webpush;
