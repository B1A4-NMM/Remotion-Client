import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SOCIAL_AUTH_URL,
  withCredentials: false, // 쿠키 사용 안 함
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
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// 응답 인터셉터 - 401 에러 처리
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // 401 에러이고, 아직 재시도하지 않은 요청이며, refresh 요청이 아닌 경우
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        console.log("🔄 토큰 만료, 재발급 시도 (localStorage)...");
        // 토큰 갱신 요청 (localStorage에서 refreshToken 읽어서 전송)
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("Refresh token not found");
        }

        const { data } = await api.post(
          `/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        console.log("✅ 토큰 재발급 성공");
        // 새 Access Token 저장
        localStorage.setItem("accessToken", data.access_token);

        // Refresh Token도 갱신
        if (data.refresh_token) {
          localStorage.setItem("refreshToken", data.refresh_token);
        }

        // 실패한 요청의 헤더 업데이트
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;

        // 실패한 요청 재시도
        return api(originalRequest);
      } catch (refreshError) {
        console.error("❌ 토큰 갱신 실패:", refreshError);
        // 갱신 실패 시 로그아웃 처리 진행
      }
    }

    // 위에서 리턴되지 않았다면 (갱신 실패, 등) 로그아웃 처리
    if (error.response?.status === 401) {
      // 토큰 만료 또는 무효
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      console.log("🔍 API 에러 발생 (401) -> 로그아웃 처리:", {
        url: error.config?.url,
        data: error.response?.data,
      });

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
    }

    return Promise.reject(error);
  }
);

export default api;
