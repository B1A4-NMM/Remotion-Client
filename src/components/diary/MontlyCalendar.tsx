// components/diary/MonthlyCalendar.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dayjs from "dayjs";
import { useGetWrittenDays } from "../../api/queries/home/useGetWrittenDays";

interface MonthlyCalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({
  selectedDate,
  onDateSelect,
  onClose,
  isOpen,
}) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs(selectedDate));
  const [calendarDays, setCalendarDays] = useState<(dayjs.Dayjs | null)[]>([]);

  // 일기 쓴 날짜 가져오기
  const { data: writtenDaysData } = useGetWrittenDays(
    currentMonth.year(),
    currentMonth.month() + 1
  );

  const writtenDays = writtenDaysData?.writtenDays || [];

  useEffect(() => {
    generateCalendarDays();
  }, [currentMonth]);

  const generateCalendarDays = () => {
    const startOfMonth = currentMonth.startOf("month");
    const endOfMonth = currentMonth.endOf("month");
    const startOfCalendar = startOfMonth.startOf("week");
    const endOfCalendar = endOfMonth.endOf("week");

    const days: (dayjs.Dayjs | null)[] = [];
    let currentDay = startOfCalendar;

    while (currentDay.isBefore(endOfCalendar) || currentDay.isSame(endOfCalendar)) {
      if (currentDay.isSame(startOfMonth, "month")) {
        days.push(currentDay);
      } else {
        days.push(null);
      }
      currentDay = currentDay.add(1, "day");
    }

    setCalendarDays(days);
  };

  const handleDateClick = (date: dayjs.Dayjs) => {
    const formattedDate = date.format("YYYY-MM-DD");
    console.log("🔍 MonthlyCalendar handleDateClick 호출됨:", formattedDate);
    onDateSelect(formattedDate);
    onClose();
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => prev.subtract(1, "month"));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => prev.add(1, "month"));
  };

  const goToPreviousYear = () => {
    setCurrentMonth(prev => prev.subtract(1, "year"));
  };

  const goToNextYear = () => {
    setCurrentMonth(prev => prev.add(1, "year"));
  };

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            onClick={onClose}
          />

          {/* 달력 모달 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-4 right-4 rounded-lg shadow-xl z-50 p-4 calendar-modal"
          >
            {/* 달력 헤더 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1">
                {/* 년도 이전 버튼 */}
                <button
                  onClick={goToPreviousYear}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors text-black dark:text-white"
                  title="이전 년도"
                >
                  <div className="flex">
                    <ChevronLeft className="w-4 h-4" />
                    <ChevronLeft className="w-4 h-4 -ml-2" />
                  </div>
                </button>
                {/* 월 이전 버튼 */}
                <button
                  onClick={goToPreviousMonth}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors text-black dark:text-white"
                  title="이전 월"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>

              <h2 className="text-lg font-semibold text-black dark:text-white">
                {currentMonth.format("YYYY년 M월")}
              </h2>

              <div className="flex items-center gap-1">
                {/* 월 다음 버튼 */}
                <button
                  onClick={goToNextMonth}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors text-black dark:text-white"
                  title="다음 월"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                {/* 년도 다음 버튼 */}
                <button
                  onClick={goToNextYear}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors text-black dark:text-white"
                  title="다음 년도"
                >
                  <div className="flex">
                    <ChevronRight className="w-4 h-4" />
                    <ChevronRight className="w-4 h-4 -ml-2" />
                  </div>
                </button>
              </div>
            </div>

            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map(day => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* 달력 그리드 */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                if (!day) {
                  return <div key={index} className="h-10" />;
                }

                const isSelected = day.format("YYYY-MM-DD") === selectedDate;
                const isToday = day.isSame(dayjs(), "day");
                const isWrittenDay = writtenDays.includes(day.date());

                return (
                  <button
                    key={index}
                    onClick={() => handleDateClick(day)}
                    className={`relative h-10 rounded-lg transition-colors ${
                      isSelected
                        ? "bg-blue-800 text-white"
                        : isToday
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white"
                    }`}
                  >
                    <span className="text-sm">{day.date()}</span>
                    {/* 일기 쓴 날짜 표시 */}
                    {isWrittenDay && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                        <div className="w-1.5 h-1.5 bg-red-900 rounded-full"></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MonthlyCalendar;
