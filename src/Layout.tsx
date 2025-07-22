import { useLocation } from "react-router-dom";
import { useBottomPopupStore } from "./store/useBottomPopupStore";
import BottomNavigation from "./components/BottomNavigation";
import { Toaster } from "sonner";
import AnimatedOutlet from "./components/AnimatedOutlet";
import Title from "./components/analysis/Title";

// 하단 네비게이션을 숨길 경로 목록
const HIDE_NAV_PATHS = ["/signup", "/login", "/diary", "/video", "/result", "/loading7"];
const SHOW_TITLE_PATHS = ["/analysis", "/relation"];

export default function Layout() {
  const location = useLocation();
  const isPopupOpen = useBottomPopupStore(state => state.isOpen);

  // 현재 경로가 네비게이션을 숨겨야 하는 경로에 포함되지 않는 경우만 보여줌
  const shouldShowNav =
    !HIDE_NAV_PATHS.some(path => location.pathname.startsWith(path)) && !isPopupOpen;

  const shouldShowTitle = SHOW_TITLE_PATHS.includes(location.pathname);

  return (
    <div className="w-full min-h-[100dvh] flex justify-center bg-[black] font-pretendard">
      <div
        className="w-full max-w-[414px] flex flex-col relative bg-[#FAF6F4] dark:bg-gradient-to-b dark:from-[#181718] dark:via-[#181718] dark:to-[#4A3551] dark:text-white min-h-[100dvh] bg-fixed"
        style={{
          backgroundAttachment: "fixed",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
      >
        {shouldShowTitle && <Title name={"감정 분석"} isBackActive={false} back={""} />}
        <main className={`flex-1 h-full ${shouldShowNav ? "pb-[84px]" : ""}`}>
          <AnimatedOutlet />
          <Toaster
            position="top-center"
            expand={true}
            richColors={true}
            closeButton={true}
            toastOptions={{
              duration: 4000,
              style: {
                background: "#ffff",
                color: "#EF7C80",
                border: "1px solid #E5E5EA",
                boxShadow: "0 4px 24px 0 rgba(80, 80, 120, 0.08)",
                borderRadius: "16px",
              },
            }}
          />
        </main>

        {shouldShowNav && (
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[414px] z-50">
            <BottomNavigation />
          </div>
        )}
      </div>
    </div>
  );
}
