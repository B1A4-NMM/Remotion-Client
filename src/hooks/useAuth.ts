import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";

interface User {
  id: number;
  email: string;
  name: string;
}

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    token,
    login,
    logout,
    setLoading,
    setToken,
    validateToken,
  } = useUserStore();

  // 앱 시작 시 토큰 확인 (페이지 로드/새로고침 시 한 번만)
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("accessToken");

      if (storedToken) {
        setToken(storedToken);
        const isValid = await validateToken(storedToken);
        if (!isValid) {
          // 토큰이 유효하지 않으면 이미 logout()이 호출됨
          return;
        }
      } else {
        // 토큰이 없으면 로그인 페이지로
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, [setToken, validateToken, setLoading]);

  // 토큰 만료 체크 (5분마다)
  useEffect(() => {
    const checkTokenExpiry = async () => {
      const storedToken = localStorage.getItem("accessToken");
      if (storedToken) {
        await validateToken(storedToken);
      }
    };

    // 페이지 포커스 시에만 체크 (사용자가 탭을 다시 열 때)
    const handleFocus = () => {
      checkTokenExpiry();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [validateToken]);

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    validateToken,
  };
};
