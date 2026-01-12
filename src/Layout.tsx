import { useLocation } from "react-router-dom";
import { useBottomPopupStore } from "./store/useBottomPopupStore";
import BottomNavigation from "./components/BottomNavigation";
import Sidebar from "./components/Sidebar";
import { Toaster } from "sonner";
import AnimatedOutlet from "./components/AnimatedOutlet";
import Title from "./components/analysis/Title";

// 하단 네비게이션을 숨길 경로 목록 (인증 관련 페이지에서는 모바일 네비도 숨김)
const HIDE_NAV_PATHS = ["/signup", "/login", "/diary", "/video", "/result", "/loading"];
const SHOW_TITLE_PATHS = ["/analysis", "/relation"];
// 사이드바를 숨길 경로 목록 (인증 관련 페이지에서는 데스크탑 사이드바도 숨김)
const HIDE_SIDEBAR_PATHS = ["/signup", "/login"];

export default function Layout() {
  const location = useLocation();
  const isPopupOpen = useBottomPopupStore(state => state.isOpen);

  // 현재 경로가 네비게이션을 숨겨야 하는 경로에 포함되지 않는 경우만 보여줌
  const shouldShowNav =
    !HIDE_NAV_PATHS.some(path => location.pathname.startsWith(path)) && !isPopupOpen;

  // 사이드바를 보여줄지 여부 (인증 페이지는 숨김)
  const shouldShowSidebar = !HIDE_SIDEBAR_PATHS.some(path => location.pathname.startsWith(path));

  const shouldShowTitle = SHOW_TITLE_PATHS.includes(location.pathname);

  return (
    <div className="w-full min-h-[100dvh] flex justify-center bg-black font-pretendard">
      <div
        className={`w-full flex flex-col relative bg-[#FAF6F4] dark:bg-gradient-to-b dark:from-[#181718] dark:via-[#181718] dark:to-[#4A3551] dark:text-white min-h-[100dvh] ${
          shouldShowSidebar ? "md:flex md:flex-row" : "flex justify-center"
        }`}
        style={{
          backgroundAttachment: "fixed",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Desktop Sidebar - Hidden on mobile and auth pages */}
        {shouldShowSidebar && <Sidebar />}

        {/* Main Content Area - Mobile: max-w-[414px], Desktop: full width with left padding */}
        <main
          className={`flex-1 h-full ${
            shouldShowSidebar ? "md:ml-64 md:max-w-screen-xl" : ""
          } ${shouldShowNav ? "pb-[84px]" : ""}`}
        >
          {shouldShowTitle && (
            <Title
              name={location.pathname === "/relation" ? "관계 분석" : "감정 분석"}
              isBackActive={false}
              back=""
            />
          )}
          <div className="md:px-8">
            <AnimatedOutlet />
          </div>
          <Toaster
            position="top-center"
            expand={true}
            richColors={true}
            closeButton={true}
            toastOptions={{
              duration: 4000,
              style: {
                background: "#ffffff",
                color: "#EF7C80",
                border: "1px solid #E5E5EA",
                boxShadow: "0 4px 24px 0 rgba(80, 80, 120, 0.08)",
                borderRadius: "16px",
              },
            }}
          />
        </main>

        {/* Mobile Bottom Navigation - Hidden on desktop */}
        {shouldShowNav && (
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[414px] z-50 md:hidden">
            <BottomNavigation />
          </div>
        )}
      </div>
    </div>
  );
}
