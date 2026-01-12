import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "../api/axios"; // API 호출을 위해 import

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("accessToken"));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);

  const login = (newToken: string) => {
    localStorage.setItem("accessToken", newToken);
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      // 서버에 로그아웃 요청 (쿠키 삭제 및 Redis 삭제)
      await api.post("/auth/logout");
    } catch (error) {
      console.error("로그아웃 요청 실패:", error);
    } finally {
      // 클라이언트 상태 정리
      localStorage.removeItem("accessToken");
      // refreshToken은 HttpOnly 쿠키라 클라이언트가 못 지움 (서버가 지워줘야 함)
      setToken(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const value = {
    isAuthenticated,
    login,
    logout,
    token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
