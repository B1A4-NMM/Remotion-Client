import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@/components/theme-provider";
import { useNotiStore } from "@/store/useNotiStore";
import { Home, FileText, PieChart, User, Bell, Plus } from "lucide-react";
import dayjs from "dayjs";

export default function Sidebar() {
  const location = useLocation();
  const path = location.pathname.toLowerCase();
  const { theme } = useTheme();
  const { count } = useNotiStore();
  const today = dayjs().format("YYYY-MM-DD");

  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const navItems = [
    { to: "/", icon: Home, label: "홈", active: path === "/" },
    { to: "/login", icon: User, label: "로그인", active: path === "/login" },
    { to: "/signup", icon: User, label: "회원가입", active: path === "/signup" },
    {
      to: "/analysis",
      icon: PieChart,
      label: "감정 분석",
      active: path === "/analysis" || path === "/relation" || path.startsWith("/analysis/"),
    },
    {
      to: "/todos",
      icon: FileText,
      label: "할 일",
      active: path === "/todos" || path === "/routine" || path === "/contents",
    },
    { to: "/mypage", icon: User, label: "마이페이지", active: path === "/mypage" },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col fixed left-0 top-0 h-full w-64 border-r z-50 transition-colors ${
        isDark ? "bg-[#181718] border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">하루뒤</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(item => (
          <Link
            key={item.label}
            to={item.to}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              item.active
                ? "bg-[#EF7C80] text-white font-semibold"
                : isDark
                  ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        {/* 일기 작성 버튼 */}
        <Link
          to={`/diary/${today}`}
          className="flex items-center justify-center gap-3 px-4 py-4 rounded-lg bg-[#EF7C80] text-white font-semibold transition-all duration-200 hover:bg-[#e06b70]"
        >
          <Plus className="w-6 h-6" />
          <span>일기 작성</span>
        </Link>

        {/* 알림 */}
        <Link
          to="/notifications"
          className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            path === "/notifications"
              ? "bg-[#EF7C80] text-white font-semibold"
              : isDark
                ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5" />
            <span>알림</span>
          </div>
          {count > 0 && (
            <span className="bg-[#F36B6B] text-white text-xs font-semibold rounded-full px-2 py-0.5">
              {count}
            </span>
          )}
        </Link>
      </div>
    </aside>
  );
}
