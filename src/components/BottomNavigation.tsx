import React, { useEffect } from "react";

//import { useGetNotiCount } from "../api/queries/notifications/useGetNotiCount";
import { Link, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { useTheme } from "./theme-provider";

import { useNotiStore } from "@/store/useNotiStore";

export default function BottomNavigation() {
  //const { data } = useGetNotiCount();
  
  const { count, fetchCount } = useNotiStore();
  // const count =data?.count ?? 0;

  const location = useLocation();
  const path = location.pathname.toLowerCase();
  const today = dayjs().format("YYYY-MM-DD");
  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => {
    fetchCount(); // 최초 mount 시 서버에서 count 불러오기
  }, []);
  
  
  return (
    <div className="fixed bottom-0 left-0 w-full max-w-md mx-auto z-40" style={{ minWidth: 0 }}>
      <div className="relative w-full" style={{ aspectRatio: "414/84" }}>
        <svg
          viewBox="0 0 393 84"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            opacity="0.95"
            d="M197.5 0C207.24 0 215.877 4.72168 221.249 12H369C382.255 12 393 22.7452 393 36V84H0V36C0 22.7452 10.7452 12 24 12H173.751C179.123 4.72168 187.76 0 197.5 0Z"
            fill={isDark ? "#29222B" : "white"}
          />

          {/* '+' 아이콘 (가운데 위치) */}
          <circle opacity="0.9" cx="197.5" cy="29.5" r="24.5" fill={isDark ? "white" : "black"} />
          <path
            d="M185.49 29.9805H209.51"
            stroke={isDark ? "black" : "white"}
            strokeWidth={3}
            strokeLinecap="round"
          />
          <path
            d="M197.495 41.9951L197.495 17.9755"
            stroke={isDark ? "black" : "white"}
            strokeWidth={3}
            strokeLinecap="round"
          />

          {/* Home 아이콘 (첫 번째 위치) */}
          <path
            d="M50.8957 48.5048V45.1922C50.8957 44.3466 51.5862 43.6612 52.438 43.6612H55.5517C55.9607 43.6612 56.353 43.8225 56.6422 44.1096C56.9315 44.3967 57.094 44.7862 57.094 45.1922V48.5048C57.0914 48.8563 57.2302 49.1944 57.4797 49.4439C57.7292 49.6933 58.0687 49.8337 58.4229 49.8336H60.5472C61.5393 49.8362 62.4917 49.4467 63.1941 48.7512C63.8966 48.0557 64.2913 47.1112 64.2913 46.1263V36.6894C64.2913 35.8938 63.9361 35.1392 63.3213 34.6287L56.0949 28.8992C54.8378 27.8946 53.0367 27.927 51.8172 28.9762L44.7556 34.6287C44.1118 35.1241 43.727 35.881 43.708 36.6894V46.1167C43.708 48.1695 45.3843 49.8336 47.4522 49.8336H49.528C50.2635 49.8337 50.8613 49.2446 50.8666 48.5144L50.8957 48.5048Z"
            fill={
              isDark ? (path === "/" ? "white" : "#B6B6B6") : path === "/" ? "black" : "#B6B6B6"
            }
          />

          {/* Analysis 아이콘 (두 번째 위치로 이동) */}
          <path
            d="M115.0244 40.4106C114.9778 40.7023 114.9551 40.994 114.9551 41.2856C114.9551 43.9106 117.0781 46.0327 119.6914 46.0327C119.983 46.0327 120.2631 45.9993 120.5547 45.9526V55.3657C120.5547 59.3218 118.2214 61.6674 114.2549 61.6675H105.6338C101.6662 61.6673 99.333 59.3218 99.333 55.3657V46.7339C99.333 42.7673 101.6662 40.4108 105.6338 40.4106H115.0244ZM115.2588 47.5034C114.9428 47.4686 114.6292 47.6092 114.4414 47.8657L111.6191 51.5171L108.3867 48.9741C108.1885 48.8225 107.9549 48.7632 107.7217 48.7876C107.4895 48.8226 107.2789 48.9496 107.1377 49.1362L103.6856 53.6284L103.6143 53.7339C103.4161 54.106 103.5096 54.5845 103.8594 54.8423C104.0227 54.9473 104.1982 55.0171 104.3965 55.0171C104.6659 55.0287 104.9217 54.8879 105.085 54.6675L108.0127 50.8979L111.3379 53.396L111.4434 53.4644C111.8166 53.6625 112.2835 53.5703 112.5518 53.2192L115.9229 48.8687L115.876 48.8921C116.0626 48.6354 116.0981 48.3088 115.9697 48.0171C115.8425 47.7255 115.5609 47.5267 115.2588 47.5034ZM119.8545 38.3335C121.4061 38.3335 122.6659 39.5934 122.666 41.145C122.666 42.6967 121.4062 43.9565 119.8545 43.9565C118.303 43.9564 117.043 42.6966 117.043 41.145C117.043 39.5935 118.303 38.3337 119.8545 38.3335Z"
            fill={
              isDark
                ? path === "/analysis" || path==="/relation"
                  ? "white"
                  : "#B6B6B6"
                : path === "/analysis" || path === "/relation"
                  ? "black"
                  : "#B6B6B6"
            }
            transform="translate(10, -10.5) "
          />

          {/* Recommend 아이콘 (네 번째 위치로 이동) */}
          <path
            d="M268.58008 40.5923C270.1076 40.5923 271.332 41.8284 271.332 43.3667V47.0591C271.332 48.5866 270.1076 49.8325 268.58008 49.8325H264.91895C263.40228 49.8325 262.16699 48.5866 262.16699 47.0591V43.3667C262.16699 41.8284 263.40228 40.5923 264.91895 40.5923H268.58008ZM281.082 40.5923C282.5987 40.5923 283.834 41.8284 283.834 43.3667V47.0591C283.834 48.5866 282.5987 49.8325 281.082 49.8325H277.4209C275.8934 49.8325 274.6689 48.5866 274.6689 47.0591V43.3667C274.6689 41.8284 275.8934 40.5923 277.4209 40.5923H281.082ZM268.58008 28.1665C270.1076 28.1665 271.332 29.4123 271.332 30.9409V34.6343C271.332 36.1725 270.1076 37.4077 268.58008 37.4077H264.91895C263.40237 37.4077 262.16714 36.1725 262.16699 34.6343V30.9409C262.16699 29.4123 263.40228 28.1665 264.91895 28.1665H268.58008ZM281.082 28.1665C282.5987 28.1665 283.834 29.4123 283.834 30.9409V34.6343C283.834 36.1725 282.5987 37.4077 281.082 37.4077H277.4209C275.8935 37.4077 274.6691 36.1725 274.6689 34.6343V30.9409C274.6689 29.4123 275.8934 28.1665 277.4209 28.1665H281.082Z"
            fill={
              isDark
                ? path === "/todos" || path === "/routine" || path === "/contents"
                  ? "white"
                  : "#B6B6B6"
                : path === "/todos" || path === "/routine" || path === "/contents"
                  ? "black"
                  : "#B6B6B6"
            }
          />

          {/* Profile 아이콘 (마지막 위치) */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C14.9391 2 17.294 4.35415 17.294 7.29117C17.294 10.2282 14.9391 12.5832 12 12.5832C9.0619 12.5832 6.70601 10.2282 6.70601 7.29117C6.70601 4.35415 9.0619 2 12 2ZM12 22C7.66237 22 4 21.2951 4 18.5751C4 15.8541 7.68538 15.1741 12 15.1741C16.3386 15.1741 20 15.8791 20 18.5991C20 21.3201 16.3146 22 12 22Z"
            transform="translate(327, 25) scale(1.2)"
            fill={
              isDark
                ? path === "/mypage"
                  ? "white"
                  : "#B6B6B6"
                : path === "/mypage"
                  ? "black"
                  : "#B6B6B6"
            }
          />
        </svg>

        {/* 클릭 영역 */}
        <div className="absolute inset-0 flex justify-between items-end pb-4 px-2">
          <Link to="/" className="flex-1 h-full" />
          <Link to="/relation" className="flex-1 h-full" />
          <Link to={`/diary/${today}`} className="flex-1 h-full flex justify-center items-end">
            <div className="w-14 h-14 -mt-4 z-10 rounded-full" />
          </Link>
          <Link to="/todos" className="flex-1 h-full" />
          <Link to="/mypage" className="flex-1 h-full" >
            {/* 알림 뱃지 */}
            {count > 0 && (
              <span className="absolute top-5 right-7 bg-[#F36B6B] text-white text-[10px] font-semibold rounded-full px-1.5 py-0.5 z-50">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
