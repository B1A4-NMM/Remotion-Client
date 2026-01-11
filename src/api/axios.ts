import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SOCIAL_AUTH_URL,
  withCredentials: true, // 쿠키 자동 포함 설정 (HttpOnly Cookie 사용 시 필수)
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
  async error => {
    const originalRequest = error.config;

    // 401 에러이고, 아직 재시도하지 않은 요청이며, refresh 요청이 아닌 경우
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
      originalRequest._retry = true;
      
      try {
        console.log("🔄 토큰 만료, 재발급 시도 (Cookie)...");
        // 토큰 갱신 요청 (쿠키가 자동으로 전송됨)
        const { data } = await api.post(`/auth/refresh`);

        console.log("✅ 토큰 재발급 성공");
        // 새 Access Token 저장
        localStorage.setItem("accessToken", data.access_token);
        
        // Refresh Token은 백엔드가 Set-Cookie 헤더로 자동 갱신해줌

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
      // refreshToken은 쿠키에 있으므로 클라이언트가 직접 지울 수 없음 (로그아웃 API 호출 필요하지만, 여기선 상태만 클리어)

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
