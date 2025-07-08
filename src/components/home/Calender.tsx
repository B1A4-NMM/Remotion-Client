import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, delay } from "framer-motion";
import dayjs from "dayjs";
import { create } from "zustand";


interface DiaryStore {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
}

export const useDiaryStore = create<DiaryStore>(set => ({
  isExpanded: false,
  setIsExpanded: (value: boolean) => set({ isExpanded: value }),
}));


interface MonthlyCalendarProps {
    onDateSelect?: (date: Date) => void;
  }
  
  const MonthlyCalendar = ({ onDateSelect }: MonthlyCalendarProps) => {
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false); // 월 전환 상태
    const containerRef = useRef<HTMLDivElement>(null);
    const today = dayjs();
  
    // 현재 월의 모든 날짜 가져오기
    const getMonthDates = (month: dayjs.Dayjs) => {
      const dates = [];
      const daysInMonth = month.daysInMonth();
  
      for (let i = 1; i <= daysInMonth; i++) {
        dates.push(month.date(i));
      }
      return dates;
    };
  
    const monthDates = getMonthDates(currentMonth);
    const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];
  
    // 드래그 제약사항 계산
    const calculateDragConstraints = () => {
      const itemWidth = 70; // 각 날짜 버튼 너비
      const containerWidth = typeof window !== "undefined" ? window.innerWidth : 400;
      const visibleItems = Math.floor(containerWidth / itemWidth);
      const maxScroll = Math.max(0, (monthDates.length * 1.43 - visibleItems) * itemWidth);
  
      return {
        left: -maxScroll,
        right: 0,
      };
    };
  
    // 드래그 종료 시 월 변경
    const handleDragEnd = (event: any, info: any) => {
      const threshold = 700;
  
      if (info.offset.x > threshold) {
        // 오른쪽으로 드래그 - 이전 달
        setIsTransitioning(true);
        setCurrentMonth(prev => prev.subtract(1, "month"));
  
        // 짧은 지연 후 전환 상태 해제
        setTimeout(() => setIsTransitioning(false), 300);
      } else if (info.offset.x < -threshold) {
        // 왼쪽으로 드래그 - 다음 달
        setIsTransitioning(true);
        setCurrentMonth(prev => prev.add(1, "month"));
  
        setTimeout(() => setIsTransitioning(false), 300);
      }
      // setDragX(0) 제거!
    };
  
    // 날짜 클릭 핸들러
    const handleDateClick = (date: dayjs.Dayjs) => {
      console.log("Selected date:", date.format("YYYY-MM-DD"));
      onDateSelect?.(date.toDate());
      setIsCalendarOpen(false);
    };
  
    // 큰 캘린더용 전체 달력 생성
    const generateFullCalendar = (month: dayjs.Dayjs) => {
      const firstDay = month.startOf("month");
      const lastDay = month.endOf("month");
      const startDate = firstDay.startOf("week").add(1, "day"); // 월요일 시작
      const endDate = lastDay.endOf("week").add(1, "day");
  
      const weeks = [];
      let currentWeek = [];
      let current = startDate;
  
      while (current.isBefore(endDate) || current.isSame(endDate, "day")) {
        currentWeek.push(current);
  
        if (currentWeek.length === 7) {
          weeks.push([...currentWeek]);
          currentWeek = [];
        }
  
        current = current.add(1, "day");
      }
  
      return weeks;
    };
  
    return (
      <>
        <div className="absolute top-3 left-0 right-0 z-10">
          {/* 상단 네비게이션 */}
          <div className="flex justify-between items-center mb-4 px-4">
            {/* 오늘 날짜 */}
            <div className="text-white font-medium">
              <div className="text-lg">{today.format("MM월 DD일")}</div>
              <div className="text-sm text-gray-400">{today.format("YYYY년")}</div>
            </div>
  
            {/* 현재 월 표시 */}
            <span className="text-white font-medium">{currentMonth.format("YYYY년 MM월")}</span>
  
            {/* 캘린더 버튼 */}
            <button
              onClick={() => setIsCalendarOpen(true)}
              className="text-gray-400 hover:text-white p-2"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="18"
                  rx="2"
                  ry="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" />
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" />
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>
  
          {/* 스크롤 가능한 날짜 목록 */}
          <div className="w-full overflow-hidden">
            <motion.div
              key={currentMonth.format("YYYY-MM")} // 월이 바뀔 때마다 새로운 컴포넌트
              ref={containerRef}
              drag="x"
              dragConstraints={calculateDragConstraints()}
              dragElastic={0.1}
              onDragEnd={handleDragEnd}
              className="flex gap-2 px-4 pb-2 cursor-grab active:cursor-grabbing"
              style={{
                width: "max-content",
                minWidth: "200%",
              }}
              // 월 전환 시에만 애니메이션 적용
              initial={isTransitioning ? { opacity: 0, x: 0 } : false}
              animate={isTransitioning ? { opacity: 1, x: 0 } : {}}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {monthDates.map((date, index) => {
                const isToday = date.isSame(today, "day");
                const dayNumber = date.date();
                const dayOfWeek = date.day();
  
                return (
                  <motion.button
                    key={`${currentMonth.format("YYYY-MM")}-${index}`}
                    onClick={() => handleDateClick(date)}
                    className="flex flex-col items-center flex-shrink-0 p-2"
                    style={{ minWidth: "60px" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-gray-400 text-xs mb-1">
                      {dayLabels[dayOfWeek === 0 ? 6 : dayOfWeek - 1]}
                    </span>
                    <div
                      className={`
                      w-10 h-10 rounded-xl flex items-center justify-center text-white font-medium transition-colors text-sm
                      ${isToday ? "bg-blue-600 shadow-lg" : "bg-transparent hover:bg-gray-700"}
                    `}
                    >
                      {dayNumber}
                    </div>
                    <div
                      className={`
                      w-1.5 h-1.5 rounded-full mt-1
                      ${index % 3 === 0 ? "bg-green-400" : "transparent"}
                    `}
                    />
                  </motion.button>
                );
              })}
            </motion.div>
          </div>
        </div>
  
        {/* 전체 캘린더 모달 */}
        <AnimatePresence>
          {isCalendarOpen && (
            <motion.div
              className="inset-0 z-50 bg-black/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCalendarOpen(false)}
            >
              <motion.div
                className="absolute top-0 left-0 right-0 bg-gray-900 rounded-b-3xl shadow-2xl"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={e => e.stopPropagation()}
              >
                {/* 캘린더 헤더 */}
                <div className="flex justify-between items-center p-6 border-b border-gray-700">
                  <button
                    onClick={() => setCurrentMonth(prev => prev.subtract(1, "month"))}
                    className="text-gray-400 hover:text-white p-2"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M15 18L9 12L15 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
  
                  <h2 className="text-white text-xl font-bold">
                    {currentMonth.format("YYYY년 MM월")}
                  </h2>
  
                  <button
                    onClick={() => setCurrentMonth(prev => prev.add(1, "month"))}
                    className="text-gray-400 hover:text-white p-2"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 18L15 12L9 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
  
                {/* 요일 헤더 */}
                <div className="grid grid-cols-7 gap-1 p-4 pb-2">
                  {dayLabels.map((day, index) => (
                    <div key={index} className="text-center text-gray-400 text-sm font-medium py-2">
                      {day}
                    </div>
                  ))}
                </div>
  
                {/* 캘린더 그리드 */}
                <div className="p-4 pt-0 pb-8 z-40">
                  {generateFullCalendar(currentMonth).map((week, weekIndex) => (
                    <div key={weekIndex} className="grid grid-cols-7 gap-1 mb-2">
                      {week.map((date, dayIndex) => {
                        const isCurrentMonth = date.isSame(currentMonth, "month");
                        const isToday = date.isSame(today, "day");
  
                        return (
                          <motion.button
                            key={`${weekIndex}-${dayIndex}`}
                            onClick={() => handleDateClick(date)}
                            className={`
                              h-12 rounded-lg flex items-center justify-center text-sm font-medium transition-colors
                              ${isCurrentMonth ? "text-white" : "text-gray-600"}
                              ${isToday ? "bg-blue-600 text-white shadow-lg" : "hover:bg-gray-700"}
                            `}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {date.date()}
                          </motion.button>
                        );
                      })}
                    </div>
                  ))}
                </div>
  
                {/* 닫기 버튼 */}
                <div className="flex justify-center pb-6">
                  <button
                    onClick={() => setIsCalendarOpen(false)}
                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-colors"
                  >
                    닫기
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  };
  
  export default MonthlyCalendar;
  