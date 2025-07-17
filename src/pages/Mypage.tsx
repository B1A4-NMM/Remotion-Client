import React from "react";
import { useUserStore } from "@/store/userStore";
import { useTheme } from "@/components/theme-provider";

export default function Mypage() {
  const { user, logout } = useUserStore();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen p-6 text-foreground bg-background">
      <div className="max-w-md mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">마이페이지</h1>
        </div>

        {/* 계정 정보 카드 */}
        <div className="bg-card rounded-2xl shadow-lg p-6 mb-6 border">
          <h2 className="text-xl font-semibold mb-4">계정 정보</h2>
          <div className="space-y-4">
            {/* 소셜 로그인 정보 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm font-bold text-black">K</span>
                </div>
                <span className="text-sm text-muted-foreground">소셜 로그인</span>
              </div>
              <span className="text-sm font-medium">카카오</span>
            </div>

            {/* 닉네임 */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">닉네임</span>
              <span className="text-sm font-medium">{user?.name || "하루뒤"}</span>
            </div>

            {/* 이메일 */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">이메일</span>
              <span className="text-sm font-medium">{user?.email || "haruday@email.com"}</span>
            </div>
          </div>
        </div>

        {/* 테마 설정 카드 */}
        <div className="bg-card rounded-2xl shadow-lg p-6 mb-6 border">
          <h2 className="text-xl font-semibold mb-4">테마 설정</h2>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">다크 모드</span>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                theme === "dark" ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  theme === "dark" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {theme === "dark"
              ? "다크 모드가 활성화되어 있습니다"
              : "라이트 모드가 활성화되어 있습니다"}
          </p>
        </div>

        {/* 로그아웃 버튼 */}
        <button
          onClick={logout}
          className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold py-4 rounded-2xl transition-colors"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
