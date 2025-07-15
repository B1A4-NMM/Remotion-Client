import React from "react";
import HomeBar from "./HomeBar";
import { useNavigate } from "react-router-dom";
interface TitleProps {
  continuousWritingDate: number;
  emotionCountByMonth: number;
  totalDiaryCount: number;
  selectedTab: "menu" | "location" | "search";
  setSelectedTab: (tab: "menu" | "location" | "search") => void;
}

const Title: React.FC<TitleProps> = ({
  continuousWritingDate,
  emotionCountByMonth,
  totalDiaryCount,
  selectedTab,
  setSelectedTab,
}) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="w-full ">
        {/* 메인 헤더 */}
        <div className="flex items-center justify-between px-4 py-8 ">
          <h1 className="text-3xl font-bold text-gray-900 ">하루 기록</h1>

          {/* 액션 버튼들 */}
          <div className="flex items-center gap-2">
            {/* 검색 버튼 */}
            <button
              className="p-2 rounded-full bg-white transition-colors box-shadow shadow-xl"
              aria-label="검색"
              onClick={() => navigate("/search")}
            >
              <svg
                className={`w-5 h-5 ${selectedTab === "search" ? "text-black" : "text-gray-400"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* 위치 버튼 */}
            <button
              className="p-2 rounded-full bg-white transition-colors box-shadow shadow-xl"
              aria-label="위치"
              onClick={() => setSelectedTab("location")}
            >
              <svg
                className={`w-5 h-5 ${selectedTab === "location" ? "text-black" : "text-gray-400"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>

            {/* 메뉴 버튼 */}
            <button
              className="p-2 rounded-full bg-white transition-colors box-shadow shadow-xl"
              aria-label="메뉴"
              onClick={() => setSelectedTab("menu")}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={selectedTab === "menu" ? "text-black" : "text-gray-400"}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4 6.75C4 4.68733 4.05622 4 11 4C17.9438 4 18 4.68733 18 6.75C18 8.81267 18.0221 9.5 11 9.5C3.97785 9.5 4 8.81267 4 6.75Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4 15.25C4 13.1873 4.05622 12.5 11 12.5C17.9438 12.5 18 13.1873 18 15.25C18 17.3127 18.0221 18 11 18C3.97785 18 4 17.3127 4 15.25Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
        <HomeBar
          continuousWritingDate={continuousWritingDate}
          emotionCountByMonth={emotionCountByMonth}
          totalDiaryCount={totalDiaryCount}
        />
      </div>
    </>
  );
};

export default Title;
