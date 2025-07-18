import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useTodoStore } from "@/store/todoStore";
import { getMonthDates, nextMonth, prevMonth, formatDate } from "@/utils/date";
import { format, startOfMonth } from "date-fns";

interface MonthlyCalendarProps {
  selectedDate: Date;
  onSelect: (date: Date) => void;
}

export default function MonthlyCalendar({ selectedDate, onSelect }: MonthlyCalendarProps) {
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
        <button onClick={handlePrev} className="p-1 text-gray-500">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="font-semibold text-sm">
          {format(currentMonth, "yyyy.MM")}
        </span>
        <button onClick={handleNext} className="p-1 text-gray-500">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 px-4 pb-4">
        {monthDates.map(date => {
          const done = checkAllDone(date);
          const selected = isSelected(date);
          return (
            <button
              key={formatDate(date)}
              onClick={() => onSelect(date)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${
                done
                  ? "bg-black text-white"
                  : selected
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-900 hover:bg-gray-300"
              }`}
            >
              {done ? <Check className="w-4 h-4" /> : date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}