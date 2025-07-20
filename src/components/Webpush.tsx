// components/Webpush.tsx
import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { isPushSupported, urlBase64ToUint8Array } from "../utils/webpush";
import { subscribeToWebpush, unsubscribeFromWebpush, webpushStatus } from "@/api/services/webpush";
import { PushManagerService } from "@/api/services/pushManager";
import { WEBPUSH_CONFIG } from "../../webpush";

const Webpush = () => {
  const [isSupported, setIsSupported] = useState(true); // ✅ 기본값을 true로 변경
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(
    typeof Notification !== 'undefined' && Notification.permission === "granted"
  );
  const [loading, setLoading] = useState(true);
  const [supportCheckComplete, setSupportCheckComplete] = useState(false);

  // ✅ 더 자세한 푸시 지원 여부 확인
  useEffect(() => {
    const checkPushSupport = async () => {
      console.log('=== Push Support 체크 시작 ===');
      
      // 기본 API 체크
      const basicChecks = {
        hasWindow: typeof window !== 'undefined',
        hasNavigator: typeof navigator !== 'undefined',
        hasServiceWorker: 'serviceWorker' in navigator,
        hasPushManager: 'PushManager' in window,
        hasNotification: 'Notification' in window,
      };
      
      console.log('Basic checks:', basicChecks);
      
      const basicSupport = Object.values(basicChecks).every(Boolean);
      
      if (!basicSupport) {
        console.log('❌ Basic support failed');
        setIsSupported(false);
        setSupportCheckComplete(true);
        setLoading(false);
        return;
      }

      // Service Worker 등록 상태 체크
      try {
        console.log('Service Worker 상태 확인 중...');
        const registration = await navigator.serviceWorker.getRegistration();
        console.log('SW Registration:', registration);
        
        if (!registration) {
          console.log('⚠️ Service Worker 등록되지 않음 - 등록 시도');
          try {
            await navigator.serviceWorker.register('/sw.js');
            console.log('✅ Service Worker 등록 성공');
          } catch (error) {
            console.error('❌ Service Worker 등록 실패:', error);
          }
        }

        // PushManager 실제 접근 테스트
        const testRegistration = await navigator.serviceWorker.ready;
        const hasValidPushManager = testRegistration.pushManager !== undefined;
        
        console.log('PushManager 테스트:', hasValidPushManager);
        
        setIsSupported(hasValidPushManager);
        console.log('✅ Push support:', hasValidPushManager);
        
      } catch (error) {
        console.error('❌ Service Worker 체크 실패:', error);
        setIsSupported(false);
      } finally {
        setSupportCheckComplete(true);
      }
    };

    checkPushSupport();
  }, []);

  // 초기 상태 확인
  useEffect(() => {
    if (!supportCheckComplete || !isSupported) return;

    const checkSubscriptionStatus = async () => {
      try {
        console.log('구독 상태 확인 시작...');
        const registration = await navigator.serviceWorker.ready;
        const browserSub = await registration.pushManager.getSubscription();
        
        console.log('Browser subscription:', browserSub);
        setSubscription(browserSub);
        
        if (browserSub) {
          try {
            const serverStatus = await webpushStatus(browserSub.endpoint);
            setIsSubscribed(serverStatus);
            console.log('Server status:', serverStatus);
          } catch (error) {
            console.error("서버 상태 확인 실패:", error);
            setIsSubscribed(true);
          }
        } else {
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
  }, [supportCheckComplete, isSupported]);

  const handleToggle = async () => {
    if (loading || !isSupported) return;
    
    if (isSubscribed) {
      await unsubscribeUser();
    } else {
      await subscribeUser();
    }
  };

  const subscribeUser = async () => {
    if (!isSupported) {
      alert("이 브라우저는 푸시 알림을 지원하지 않습니다.");
      return;
    }

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
      const registration = await navigator.serviceWorker.ready;
      
      if (!registration) {
        alert("Service worker is not ready. Please refresh the page or check registration.");
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
      alert("구독 중 오류가 발생했습니다: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const unsubscribeUser = async () => {
    if (!subscription) return;

    try {
      setLoading(true);
      await unsubscribeFromWebpush(subscription.endpoint);
      setIsSubscribed(false);
      setSubscription(null);
    } catch (error) {
      console.error("Error unsubscribing:", error);
      alert("구독 취소 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 항상 렌더링하되, 지원하지 않는 경우 비활성화된 상태로 표시
  return (
    <div className="bg-card rounded-2xl shadow-lg p-6 mb-6 border">
      <h2 className="text-xl font-semibold mb-4">웹 푸시 설정</h2>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bell className={!isSupported ? 'opacity-50' : ''} />
          <span className={`text-sm text-muted-foreground ${!isSupported ? 'opacity-50' : ''}`}>
            알림 설정
          </span>
        </div>
        
        <button
          onClick={handleToggle}
          disabled={loading || !isSupported}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
            loading || !isSupported
              ? "bg-gray-300 cursor-not-allowed"
              : isSubscribed
                ? "bg-blue-800 hover:bg-blue-900"
                : "bg-gray-400 hover:bg-gray-500"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
              loading
                ? "translate-x-3.5"
                : isSubscribed
                  ? "translate-x-6"
                  : "translate-x-1"
            }`}
          />
        </button>
      </div>
      
      <p className="text-xs text-muted-foreground mt-2">
        {!supportCheckComplete
          ? "지원 여부 확인 중..."
          : !isSupported
            ? "이 브라우저는 웹 푸시를 지원하지 않습니다."
            : loading
              ? "상태 확인 중..."
              : isSubscribed
                ? "웹 푸시 받기로 설정되어 있습니다."
                : "웹 푸시 받기가 비활성화되어 있습니다."}
      </p>
    </div>
  );
};

export default Webpush;
