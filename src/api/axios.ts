import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SOCIAL_AUTH_URL,
  // baseURL: import.meta.env.DEV
  // ? '/api'
  // : import.meta.env.VITE_SOCIAL_AUTH_URL,
});

// 전역 로그아웃 모달 상태 관리
let logoutModalStore: any = null;

// store를 설정하는 함수
export const setLogoutModalStore = (store: any) => {
  logoutModalStore = store;
};

// JWT 토큰에서 만료 시간 추출
const getTokenExpiry = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.exp ? payload.exp * 1000 : null; // 밀리초로 변환
  } catch (error) {
    console.error("토큰 파싱 실패:", error);
    return null;
  }
};

// 토큰이 곧 만료될 예정인지 확인 (5분 전)
const isTokenExpiringSoon = (token: string): boolean => {
  const expiry = getTokenExpiry(token);
  if (!expiry) return true;

  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000; // 5분
  return expiry - now <= fiveMinutes;
};

// 요청 인터셉터 - 토큰 자동 첨부
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      // 토큰이 곧 만료될 예정이면 로그아웃
      if (isTokenExpiringSoon(token)) {
        console.log("🔍 토큰이 곧 만료될 예정 - 로그아웃");
        localStorage.removeItem("accessToken");
        if (logoutModalStore && typeof logoutModalStore.openModal === "function") {
          logoutModalStore.openModal();
        } else {
          window.location.href = "/login";
        }
        return Promise.reject(new Error("토큰 만료"));
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error)
);

// 응답 인터셉터 - 401 에러 처리
api.interceptors.response.use(
  response => response,
  error => {
    console.log("🔍 API 에러 발생:", {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data,
    });

    if (error.response?.status === 401) {
      console.log("🔍 401 에러 감지 - 로그아웃 처리 시작");
      // 토큰 만료 또는 무효
      localStorage.removeItem("accessToken");

      // 모달 store가 설정되어 있고 openModal 메서드가 있으면 모달을 띄움
      if (logoutModalStore && typeof logoutModalStore.openModal === "function") {
        console.log("🔍 로그아웃 모달 표시");
        logoutModalStore.openModal();
      } else {
        // 모달 store가 없거나 openModal이 없으면 바로 리다이렉트
        console.warn("🔍 logoutModalStore not available, redirecting to login");
        window.location.href = "/login";
      }
    } else if (error.response?.status >= 500) {
      console.error("Server Error:", error.response.data);
      // 500 오류에 대한 추가 처리 로직
    }
    return Promise.reject(error);
  }
);

export default api;
