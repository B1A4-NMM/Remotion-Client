import { useLocation, Outlet } from "react-router-dom";
import BottomNavigation from "./components/BottomNavigation";
import { Toaster } from "sonner";

// 하단 네비게이션을 숨길 경로 목록
const HIDE_NAV_PATHS = ["/signup", "/login", "/diary/2025-07-12"];

export default function Layout() {
  const location = useLocation();

  // 현재 경로가 네비게이션을 숨겨야 하는 경로에 포함되지 않는 경우만 보여줌
  const shouldShowNav = !HIDE_NAV_PATHS.includes(location.pathname);

  return (
    <div className="w-full flex justify-center items-start min-h-screen font-pretendard">
      <div className="w-full max-w-[414px] min-h-screen relative bg-[#FAF6F4] text-black">
        <main>
          <Outlet />
          <Toaster
            position="top-center"
            expand={true}
            richColors={false}
            closeButton={true}
            toastOptions={{
              duration: 4000,
              style: {
                background: "#FFFFFF",
                color: "#000000",
                border: "1px solid #000000",
              },
              className: "my-toast",
            }}
          />
        </main>

        {shouldShowNav && (
          <div className="fixed bottom-0 left-0 right-0 w-full max-w-[414px] mx-auto z-50">
            <BottomNavigation />
          </div>
        )}
      </div>
    </div>
  );
}
