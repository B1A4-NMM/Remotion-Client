// types/webpush.ts
export interface NotificationPayload {
    title: string;
    body: string;
    options?: {
      icon?: string;
      badge?: string;
      vibrate?: number[];
      data?: {
        url?: string;
      };
    };
  }
  
  export interface SendNotificationRequest {
    subscription: PushSubscription;
    payload: NotificationPayload;
  }
  
  export interface SendNotificationResponse {
    success: boolean;
    message?: string;
  }
  