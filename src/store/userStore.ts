import { create } from "zustand";

interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  tokenExpiryWarning: boolean; // 토큰 만료 경고 상태

  // Actions
  login: (token: string, userData: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setToken: (token: string | null) => void;
  setTokenExpiryWarning: (warning: boolean) => void;

  // Token validation
  validateToken: (token: string) => Promise<boolean>;
  startTokenCheck: () => void; // 토큰 체크 시작
  stopTokenCheck: () => void; // 토큰 체크 중지
}

// JWT 토큰에서 페이로드 추출
const getTokenPayload = (token: string): any => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch (error) {
    console.error("토큰 파싱 실패:", error);
    return null;
  }
};

// JWT 토큰에서 만료 시간 추출
const getTokenExpiry = (token: string): number | null => {
  const payload = getTokenPayload(token);
  return payload?.exp ? payload.exp * 1000 : null; // 밀리초로 변환
};

// 토큰이 만료되었는지 확인
const isTokenExpired = (token: string): boolean => {
  const expiry = getTokenExpiry(token);
  if (!expiry) return true;

  const now = Date.now();
  return now >= expiry;
};

// 토큰이 곧 만료될 예정인지 확인 (10분 전)
const isTokenExpiringSoon = (token: string): boolean => {
  const expiry = getTokenExpiry(token);
  if (!expiry) return true;

  const now = Date.now();
  const tenMinutes = 10 * 60 * 1000; // 10분
  return expiry - now <= tenMinutes;
};

let tokenCheckInterval: NodeJS.Timeout | null = null;

export const useUserStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  token: null,
  tokenExpiryWarning: false,

  login: (token: string, userData: User) => {
    localStorage.setItem("accessToken", token);
    set({
      token,
      user: userData,
      isAuthenticated: true,
      isLoading: false,
      tokenExpiryWarning: false,
    });
    // 로그인 시 토큰 체크 시작
    get().startTokenCheck();
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      tokenExpiryWarning: false,
    });
    // 로그아웃 시 토큰 체크 중지
    get().stopTokenCheck();
    window.location.href = "/login";
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setToken: (token: string | null) => {
    set({ token });
  },

  setTokenExpiryWarning: (warning: boolean) => {
    set({ tokenExpiryWarning: warning });
  },

  validateToken: async (token: string): Promise<boolean> => {
    if (!token) return false;

    // 토큰 만료 확인
    if (isTokenExpired(token)) {
      console.warn("토큰이 만료되었습니다.");
      get().logout();
      return false;
    }

    // 토큰이 유효하면 사용자 정보 설정
    set({
      user: {
        id: 1,
        email: "user@example.com",
        name: "사용자",
      },
      isAuthenticated: true,
    });

    // 토큰 체크 시작
    get().startTokenCheck();
    return true;
  },

  startTokenCheck: () => {
    // 기존 인터벌이 있으면 제거
    get().stopTokenCheck();

    // 1분마다 토큰 체크
    tokenCheckInterval = setInterval(() => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        get().logout();
        return;
      }

      // 토큰이 만료되었으면 로그아웃
      if (isTokenExpired(token)) {
        console.warn("토큰이 만료되었습니다.");
        get().logout();
        return;
      }

      // 토큰이 곧 만료될 예정이면 경고
      if (isTokenExpiringSoon(token)) {
        console.warn("토큰이 곧 만료될 예정입니다.");
        set({ tokenExpiryWarning: true });
      } else {
        set({ tokenExpiryWarning: false });
      }
    }, 60000); // 1분마다 체크
  },

  stopTokenCheck: () => {
    if (tokenCheckInterval) {
      clearInterval(tokenCheckInterval);
      tokenCheckInterval = null;
    }
  },
}));
