import React from "react";
import dayjs from "dayjs";
import 'dayjs/locale/ko';
import { useNavigate } from "react-router-dom";
import { useTheme } from "../theme-provider";

interface DiaryTitleProps {
  selectedDate: string;
  onCalendarClick: () => void;
  onBackClick: () => void;
}

const DiaryTitle: React.FC<DiaryTitleProps> = ({ selectedDate, onCalendarClick, onBackClick }) => {
  const navigate = useNavigate();
  dayjs.locale('ko');

  
  const formatDate = (date: string) => {
    return dayjs(date).format("YYYY년 M월 D일 dddd");
  };

  const backHome = () => {
    onBackClick();
    navigate(`/`);
  };

  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  

  return (
    <div className="relative pt-[32px] left-0 w-full ">
      <div className="flex items-center justify-between px-4 pb-[20px]">
        <h1 className="text-2xl font-bold text-gray-900 ml-2">{formatDate(selectedDate)}</h1>

        {/* 액션 버튼들 */}
        <div className="flex items-center gap-2">
          {/* 검색 버튼 */}
          <button
            className="p-2 rounded-full bg-white transition-colors box-shadow shadow-xl"
            aria-label="달력"
            onClick={onCalendarClick}
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M2.57715 7.83688H17.4304"
                stroke={isDark?"white":"#090909"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.7015 11.0918H13.7092"
                stroke={isDark?"white":"#090909"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.0042 11.0918H10.0119"
                stroke={isDark?"white":"#090909"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.29816 11.0918H6.30588"
                stroke={isDark?"white":"#090909"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.7015 14.3305H13.7092"
                stroke={isDark?"white":"#090909"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.0042 14.3305H10.0119"
                stroke={isDark?"white":"#090909"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.29816 14.3305H6.30588"
                stroke={isDark?"white":"#090909"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.3694 1.66699V4.40931"
                stroke={isDark?"white":"#090909"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.63795 1.66699V4.40931"
                stroke={isDark?"white":"#090909"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.5319 2.98291H6.4758C4.02856 2.98291 2.5 4.34619 2.5 6.8521V14.3935C2.5 16.9388 4.02856 18.3336 6.4758 18.3336H13.5242C15.9791 18.3336 17.5 16.9624 17.5 14.4565V6.8521C17.5077 4.34619 15.9868 2.98291 13.5319 2.98291Z"
                stroke={isDark?"white":"#090909"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* 닫기 버튼 */}
          <button
            className="p-2 rounded-full bg-white transition-colors box-shadow shadow-xl"
            aria-label="닫기"
            onClick={backHome}
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M15 5L5 15"
                stroke={isDark?"white":"#090909"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15 15L5 5"
                stroke={isDark?"white":"#090909"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <hr className="border-gray-300 mr-5 ml-5"></hr>
    </div>
  );
};

export default DiaryTitle;
