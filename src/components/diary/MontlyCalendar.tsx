// components/diary/MonthlyCalendar.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dayjs from "dayjs";

interface MonthlyCalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  onClose?: () => void;
  isOpen?: boolean;
  /**
   * When true, render the calendar without its own overlay or modal
   * wrapper so it can be embedded inside another component.
   */
  disableOverlay?: boolean;
}

const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({
  selectedDate,
  onDateSelect,
  onClose,
  isOpen = true,
  disableOverlay = false,
}) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs(selectedDate));
  const [calendarDays, setCalendarDays] = useState<(dayjs.Dayjs | null)[]>([]);

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
    onDateSelect(formattedDate);
    if (!disableOverlay) {
      onClose?.();
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => prev.subtract(1, "month"));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => prev.add(1, "month"));
  };

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <AnimatePresence>
      {(disableOverlay ? true : isOpen) && (
        <>
          {/* 배경 오버레이 */}
          {!disableOverlay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-30 z-40"
              onClick={onClose}
            />
          )}

          {/* 달력 모달 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={
              disableOverlay
                ? "bg-white rounded-lg shadow-xl p-4"
                : "absolute top-20 left-4 right-4 bg-white rounded-lg shadow-xl z-50 p-4"
            }          >
            {/* 달력 헤더 */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={goToPreviousMonth}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-black dark:text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <h2 className="text-lg font-semibold text-black dark:text-white">
                {currentMonth.format("YYYY년 M월")}
              </h2>

              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-black dark:text-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day, index) => (
                <div
                  key={day}
                  className={`text-center text-sm font-medium p-2 ${
                    index === 0
                      ? "text-red-500"
                      : index === 6
                        ? "text-blue-500"
                        : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* 날짜 그리드 */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                if (!day) {
                  return <div key={index} className="p-2" />;
                }

                const isSelected = day.format("YYYY-MM-DD") === selectedDate;
                const isToday = day.isSame(dayjs(), "day");
                const isSunday = day.day() === 0;
                const isSaturday = day.day() === 6;

                return (
                  <button
                    key={day.format("YYYY-MM-DD")}
                    onClick={() => handleDateClick(day)}
                    className={`
                      p-2 text-sm rounded-lg transition-colors relative text-black dark:text-white
                      ${isSelected ? "bg-blue-500 text-white font-semibold" : "hover:bg-gray-100 dark:hover:bg-gray-700"}
                      ${isToday && !isSelected ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold" : ""}
                      ${isSunday && !isSelected && !isToday ? "text-red-500" : ""}
                      ${isSaturday && !isSelected && !isToday ? "text-blue-500" : ""}
                    `}
                  >
                    {day.format("D")}
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
