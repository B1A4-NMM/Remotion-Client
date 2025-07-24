import React from "react";
import { useUserStore } from "@/store/userStore";
import { useTheme } from "@/components/theme-provider";
import NotificationPreview from "@/components/notification/NotificationPreview";
import { useGetAuthTest } from "@/api/queries/auth/useGetAuthTest";
import kakao from "@/assets/img/kakao.svg";
import google from "@/assets/img/google.svg";
import Webpush from "@/components/Webpush";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// 아이콘 컴포넌트들
const SunIcon = ({ className }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
    <path d="M12 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 20v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M4.93 4.93l1.41 1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M17.66 17.66l1.41 1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M2 12h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M20 12h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M6.34 6.34l-1.41 1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M19.07 19.07l-1.41 1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const MoonIcon = ({ className }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Mypage() {
  const { user, logout } = useUserStore();
  const { theme, setTheme } = useTheme();
  const { data: authData, isLoading, error } = useGetAuthTest();
  const navigate= useNavigate();

  // API 데이터에서 사용자 정보 추출
  const apiUser = authData?.user;
  const socialType = apiUser?.socialType || "kakao";
  const nickname = apiUser?.nickname || user?.name || "하루뒤";
  const userId = apiUser?.id || "N/A";

  // 소셜 타입에 따른 아이콘과 텍스트
  const getSocialInfo = (type: string) => {
    switch (type.toLowerCase()) {
      case "kakao":
        return {
          icon: <img src={kakao} alt="Kakao" className="w-6 h-6" />,
          text: "카카오",
        };
      case "google":
        return {
          icon: <img src={google} alt="Google" className="w-6 h-6" />,
          text: "구글",
        };
      default:
        return {
          icon: "?",
          text: type,
        };
    }
  };

  const socialInfo = getSocialInfo(socialType);

  return (
    <div className="min-h-screen overflow-auto text-foreground bg-[#fdfaf8] dark:bg-transparent px-4 pb-8">
      <div className="max-w-md mx-auto">
        {/* 헤더 */}
        <div className="pt-8">
          <h1 className="text-3xl font-bold text-gray-900 pb-8">마이페이지</h1>
        </div>

        {/* 알림 5개 미리보기 카드*/}
        <NotificationPreview />

        {/* 계정 정보 카드 */}
        <div className="bg-card rounded-2xl shadow-lg p-6 mb-6 border">
          <h2 className="text-xl font-semibold mb-4">계정 정보</h2>
          <div className="space-y-4">
            {/* 소셜 로그인 정보 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-3">
                  {typeof socialInfo.icon === "string" ? (
                    <span className="text-lg font-bold text-muted-foreground">
                      {socialInfo.icon}
                    </span>
                  ) : (
                    socialInfo.icon
                  )}
                </div>
                <span className="text-sm text-muted-foreground">소셜 로그인</span>
              </div>
              <span className="text-sm font-medium">{socialInfo.text}</span>
            </div>

            {/* 사용자 ID */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">사용자 ID</span>
              <span className="text-sm font-medium">{isLoading ? "로딩 중..." : userId}</span>
            </div>

            {/* 닉네임 */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">닉네임</span>
              <span className="text-sm font-medium">{isLoading ? "로딩 중..." : nickname}</span>
            </div>

            {/* API 응답 상태 표시 (개발용) */}
            {error && <div className="text-xs text-red-500 mt-2">API 오류: {error.message}</div>}
          </div>
        </div>

        {/* 테마 설정 카드 */}
        <div className="bg-card rounded-2xl shadow-lg p-6 mb-6 border">
          <h2 className="text-xl font-semibold mb-4">테마 설정</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {theme === "dark" ? (
                <MoonIcon className="w-5 h-5 text-blue-800" />
              ) : (
                <SunIcon className="w-5 h-5 text-yellow-500" />
              )}
              <span className="text-sm text-muted-foreground">
                {theme === "dark" ? "다크 모드" : "라이트 모드"}
              </span>
            </div>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
                theme === "dark"
                  ? "bg-blue-800 hover:bg-blue-900"
                  : "bg-yellow-400 hover:bg-yellow-400"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
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

        <Webpush />

        <div className="bg-card rounded-2xl shadow-lg p-6 mb-6 border cursor-pointer flex justify-between "
          onClick={()=>navigate("/faq")}>
          <span className="text-xl font-semibold">FQA</span>
          <div className="text-sm text-muted-foreground flex justify-left mt-1">
            <span className="mt-[1px] ">자주 하는 질문</span> 
            <ChevronRight/>
          </div>
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
