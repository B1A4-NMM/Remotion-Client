import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence, delay } from "framer-motion";
import dayjs from "dayjs";
import { create } from "zustand";

import '../../styles/App.css'

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
    selectedDate?: Date;
  }
  const MonthlyCalendar = ({ onDateSelect, selectedDate }: MonthlyCalendarProps) => {
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const today = dayjs();
    const [internalSelected, setInternalSelected] = useState<dayjs.Dayjs | null>(
      selectedDate ? dayjs(selectedDate) : null
    );
    useEffect(() => {
      if (selectedDate) {
        const newSelected = dayjs(selectedDate);
        setInternalSelected(newSelected);
        setCurrentMonth(newSelected.startOf('month')); // 👈 이 줄 추가!
      }
    }, [selectedDate]);

    // 현재 월의 모든 날짜 가져오기
    const getMonthDates = (month: dayjs.Dayjs) => {
      const dates = [];
      const daysInMonth = month.daysInMonth();
      
      for (let i = 1; i <= daysInMonth; i++) {
        dates.push(month.date(i));
      }
      return dates;
    };
  
    const centerDate = (idx: number) => {
      const cont = scrollRef.current;
      if (!cont) return;
      const itemW = 68;
      const left = idx * itemW - cont.clientWidth / 2 + itemW / 2;
      cont.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
    };
  
    // 선택된 날짜를 특정 월에서 찾아서 중앙에 위치시키는 함수
    const centerSelectedDateInMonth = (targetMonth: dayjs.Dayjs, targetDate: dayjs.Dayjs) => {
      const monthDates = getMonthDates(targetMonth);
      const selectedIdx = monthDates.findIndex(d => 
        d.isSame(targetDate, 'day')
      );
      
      if (selectedIdx !== -1) {
        setTimeout(() => centerDate(selectedIdx), 100);
      }
    };

    // useLayoutEffect(() => {
    //   if (selectedDate) {
    //     const newSelected = dayjs(selectedDate);
    //     setInternalSelected(newSelected);
    
    //     const newMonth = newSelected.startOf('month');
    //     setCurrentMonth(newMonth);
    
    //     requestAnimationFrame(() => {
    //       centerSelectedDateInMonth(newMonth, newSelected);
    //     });
    //   }
    // }, [selectedDate]);

    useLayoutEffect(() => {
      if (internalSelected && internalSelected.isSame(currentMonth, 'month')) {
        const idx = getMonthDates(currentMonth).findIndex(d =>
          d.isSame(internalSelected, 'day')
        );
        if (idx !== -1) {
          centerDate(idx);
        }
      }
    }, [currentMonth, internalSelected]);
  
    const monthDates = getMonthDates(currentMonth);
    const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];
  
    // 수정된 드래그 제약사항 - 양방향 드래그 지원
    const calculateDragConstraints = () => {
      if (!scrollRef.current) return { left: 0, right: 0 };
      
      const itemWidth = 68;
      const containerWidth = scrollRef.current.clientWidth;
      const totalWidth = monthDates.length * itemWidth;
      const maxScroll = Math.max(0, totalWidth - containerWidth);
  
      return {
        left: -maxScroll,   // 왼쪽으로 드래그 가능
        right: maxScroll,   // 오른쪽으로도 드래그 가능
      };
    };
  
  
    // 수평 스크롤 캘린더 날짜 클릭 핸들러
    const handleDateClick = (date: dayjs.Dayjs, index: number) => {
      if (date.isAfter(today, 'day')) return;
      
      setInternalSelected(date);  
      centerDate(index);
      onDateSelect?.(date.toDate());
      setIsCalendarOpen(false);
    };
  
    // 수정된 전체 캘린더 클릭 핸들러
    const handleFullCalendarDateClick = (date: dayjs.Dayjs) => {
      if (date.isAfter(today, 'day')) return;
    
      setInternalSelected(date);          // ① 즉시 표시용
      onDateSelect?.(date.toDate());      // ② 부모에도 알림
    
      if (!date.isSame(currentMonth, 'month')) {
        const newMonth = date.startOf('month');
        setCurrentMonth(newMonth);
        requestAnimationFrame(() => centerSelectedDateInMonth(newMonth, date));
      } else {
        const idx = getMonthDates(currentMonth).findIndex(d => d.isSame(date, 'day'));
        centerDate(idx);
      }
    
      setIsCalendarOpen(false);
    };
  
    // 나머지 함수들은 동일...
    const generateFullCalendar = (month: dayjs.Dayjs) => {
      const firstDay = month.startOf("month");
      const lastDay = month.endOf("month");
      const startDate = firstDay.startOf("week").add(1, "day");
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
            <div className="text-white font-medium">
              <div className="text-lg">{today.format("MM월 DD일")}</div>
              <div className="text-sm text-gray-400">{today.format("YYYY년")}</div>
            </div>
            
            {/* 현재 월 표시 - 이제 올바르게 업데이트됨 */}
            <span className="text-white font-medium">{currentMonth.format("YYYY년 MM월")}</span>
            
            <button
              onClick={() => setIsCalendarOpen(true)}
              className="text-gray-400 hover:text-white p-2"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" />
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" />
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>
  
          {/* 수정된 스크롤 캘린더 */}
          <div 
            ref={scrollRef}
            className="w-full overflow-x-auto hide-scrollbar"
            style={{ scrollBehavior: "smooth" }}
          >
            <motion.div
              ref={containerRef}
              drag="x"
              dragConstraints={calculateDragConstraints()}
              dragElastic={0.1}
              className="flex gap-2 px-4 pb-2 cursor-grab active:cursor-grabbing"
              style={{
                width: "max-content",
                minWidth: "100%",
              }}
              initial={isTransitioning ? { opacity: 0, x: 0 } : false}
              animate={isTransitioning ? { opacity: 1, x: 0 } : {}}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {monthDates.map((date, index) => {
                const isFuture = date.isAfter(today, 'day');
                const isSelected = internalSelected ? date.isSame(internalSelected, 'day') : false;
                const dayNumber = date.date();
                const dayOfWeek = date.day();
  
                return (
                  <motion.button
                    key={index}
                    onClick={() => handleDateClick(date, index)}
                    disabled={isFuture}
                    className={`
                      flex flex-col items-center flex-shrink-0 p-2 transition-all
                      ${isFuture ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                    style={{ minWidth: "60px" }}
                    whileHover={!isFuture ? { scale: 1.05 } : {}}
                    whileTap={!isFuture ? { scale: 0.95 } : {}}
                  >
                    <span className="text-gray-400 text-xs mb-1">
                      {dayLabels[dayOfWeek === 0 ? 6 : dayOfWeek - 1]}
                    </span>
                    <div
                      className={`
                        w-10 h-10 rounded-xl flex items-center justify-center text-white font-medium transition-colors text-sm
                        ${isSelected ? "bg-blue-600 shadow-lg" : "bg-transparent hover:bg-gray-700"}
                        ${isFuture ? "bg-gray-800 text-gray-500" : ""}
                      `}
                    >
                      {dayNumber}
                    </div>
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
                      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                        const isSelected = internalSelected ? date.isSame(internalSelected, 'day') : false;                        const isFuture = date.isAfter(today, 'day');
  
                        return (
                          <motion.button
                            key={`${weekIndex}-${dayIndex}`}
                            onClick={() => handleFullCalendarDateClick(date)}
                            disabled={isFuture}
                            className={`
                              h-12 rounded-lg flex items-center justify-center text-sm font-medium transition-colors
                              ${isCurrentMonth ? "text-white" : "text-gray-600"}
                              ${isSelected ? "bg-blue-600 text-white shadow-lg" : "hover:bg-gray-700"}
                              ${isFuture ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                            `}
                            whileHover={!isFuture ? { scale: 1.05 } : {}}
                            whileTap={!isFuture ? { scale: 0.95 } : {}}
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
  