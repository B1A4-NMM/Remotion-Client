import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useTodoStore } from "@/store/todoStore";
import { getMonthDates, nextMonth, prevMonth, formatDate } from "@/utils/date";
import { format, startOfMonth, isToday } from "date-fns";
import { useSelectedDate } from "@/hooks/useSelectedDate";
import clsx from "clsx";

interface MonthlyCalendarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export default function MonthlyCalendar({ selectedDate, setSelectedDate }: MonthlyCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate));
  const todos = useTodoStore(state => state.todos);

  const monthDates = useMemo(() => getMonthDates(currentMonth), [currentMonth]);

  const checkAllDone = (date: Date) => {
    const key = formatDate(date);
    const dayTodos = todos.filter(t => t.date === key);
    return dayTodos.length > 0 && dayTodos.every(t => t.isCompleted);
  };

  const isSelected = (date: Date) => formatDate(date) === formatDate(selectedDate);

  const handlePrev = () => setCurrentMonth(prevMonth(currentMonth));
  const handleNext = () => setCurrentMonth(nextMonth(currentMonth));

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2">
        <button
          onClick={handlePrev}
          aria-label="이전 달"
          className="p-1 text-gray-500 hover:text-black"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="font-semibold text-sm">
          {format(currentMonth, "yyyy.MM")}
        </span>
        <button
          onClick={handleNext}
          aria-label="다음 달"
          className="p-1 text-gray-500 hover:text-black"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 px-4 pb-4">
        {monthDates.map(date => {
          const done = checkAllDone(date);
          const selected = isSelected(date);
          const today = isToday(date);

          return (
            <button
              key={formatDate(date)}
              onClick={() => setSelectedDate(date)}
              aria-label={`날짜 ${format(date, "yyyy-MM-dd")}`}
              className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors relative",
                {
                  "bg-black text-white": done,
                  "bg-blue-500 text-white": !done && selected,
                  "bg-gray-200 text-gray-900 hover:bg-gray-300": !done && !selected,
                  "ring-2 ring-gray-400": today, // ✅ 오늘 표시
                }
              )}
            >
              {done ? <Check className="w-4 h-4" /> : format(date, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}