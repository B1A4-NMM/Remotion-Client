// utils/webpush.ts
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  
  export function isPushSupported() {
    // iOS 환경 감지
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.userAgent.includes('Macintosh') && 'ontouchend' in document);
  
    if (isIOS) return false;
  
    return (
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    );
  }
  