import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SOCIAL_AUTH_URL,
});

// 전역 로그아웃 모달 상태 관리
let logoutModalStore: any = null;

// store를 설정하는 함수
export const setLogoutModalStore = (store: any) => {
  logoutModalStore = store;
};

// 요청 인터셉터 - 토큰 자동 첨부
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("accessToken");
    if (token) {
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
    if (error.response?.status === 401) {
      // 토큰 만료 또는 무효
      localStorage.removeItem("accessToken");

      // 모달 store가 설정되어 있고 openModal 메서드가 있으면 모달을 띄움
      if (logoutModalStore && typeof logoutModalStore.openModal === "function") {
        logoutModalStore.openModal();
      } else {
        // 모달 store가 없거나 openModal이 없으면 바로 리다이렉트
        console.warn("logoutModalStore not available, redirecting to login");
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
