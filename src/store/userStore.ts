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

  // Actions
  login: (token: string, userData: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setToken: (token: string | null) => void;

  // Token validation
  validateToken: (token: string) => Promise<boolean>;
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

export const useUserStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  token: null,

  login: (token: string, userData: User) => {
    localStorage.setItem("accessToken", token);
    set({
      token,
      user: userData,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    window.location.href = "/login";
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setToken: (token: string | null) => {
    set({ token });
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
    return true;
  },
}));
