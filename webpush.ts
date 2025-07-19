// config/webpush.ts
export const WEBPUSH_CONFIG = {
  VAPID_PUBLIC_KEY:  import.meta.env.VITE_VAPID_PUBLIC_KEY,
} as const;
  
  // 환경변수 검증 함수 (선택사항)
  export const validateWebpushConfig = () => {
    const required = ['API_BASE_URL', 'VAPID_PUBLIC_KEY', 'JWT'] as const;
    
    for (const key of required) {
      if (!WEBPUSH_CONFIG[key]) {
        throw new Error(`Missing required environment variable: REACT_APP_${key}`);
      }
    }
};
  