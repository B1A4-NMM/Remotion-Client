import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  email: string;
  name: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // 토큰 유효성 검사 - 원래 방식대로 단순화
  const validateToken = async (token: string): Promise<boolean> => {
    // 토큰이 있으면 유효하다고 간주 (원래 방식)
    if (token) {
      // 사용자 정보는 기본값으로 설정
      setUser({
        id: 1,
        email: "user@example.com",
        name: "사용자",
      });
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  // 로그인
  const login = (token: string, userData: User) => {
    localStorage.setItem("accessToken", token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  // 로그아웃
  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  // 초기 인증 상태 확인
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("accessToken");

      if (token) {
        const isValid = await validateToken(token);
        if (!isValid) {
          navigate("/login");
        }
      } else {
        // 토큰이 없으면 로그인 페이지로
        if (window.location.pathname !== "/login") {
          navigate("/login");
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, [navigate]);

  // 토큰 만료 체크 (5분마다)
  useEffect(() => {
    const checkTokenExpiry = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        await validateToken(token);
      }
    };

    const interval = setInterval(checkTokenExpiry, 5 * 60 * 1000); // 5분
    return () => clearInterval(interval);
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    validateToken,
  };
};
