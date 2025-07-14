import { useLocation, Outlet } from "react-router-dom";
import BottomNavigation from "./components/BottomNavigation";
import { Toaster } from "sonner";

// 하단 네비게이션을 숨길 경로 목록
const HIDE_NAV_PATHS = ["/signup", "/login", "/diary/2025-07-12", "/video"];

export default function Layout() {
  const location = useLocation();

  // 현재 경로가 네비게이션을 숨겨야 하는 경로에 포함되지 않는 경우만 보여줌
  const shouldShowNav = !HIDE_NAV_PATHS.includes(location.pathname);

  return (
    <div className="w-full min-h-[100dvh] flex justify-center bg-[#FAF6F4] font-pretendard">
      <div className="w-full max-w-[414px] flex flex-col relative bg-[#FAF6F4] text-black min-h-[100dvh]">
        <main className="flex-1 h-full">
          <Outlet />
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
