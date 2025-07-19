"use client";

import {
  addDays,
  startOfWeek,
  format,
  addWeeks,
  subWeeks,
  getDay,
} from "date-fns";
import { useState, useEffect, useMemo } from "react";
import clsx from "clsx";
import { Check } from "lucide-react";

interface WeeklyCalendarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  onSwitchToMonthly?: () => void;
  monthlyStatus?: Array<{
    date: string;
    todoTotalCount: number;
    completedCount: number;
    isAllCompleted: boolean;
  }>;
}

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function WeeklyCalendar({
  selectedDate,
  setSelectedDate,
  onSwitchToMonthly,
  monthlyStatus,
}: WeeklyCalendarProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(selectedDate, { weekStartsOn: 1 })
  );

  const statusMap = useMemo(() => {
    const map: Record<string, {
      date: string;
      todoTotalCount: number;
      completedCount: number;
      isAllCompleted: boolean;
    }> = {};
    monthlyStatus?.forEach((s) => {
      map[s.date] = s;
    });
    return map;
  }, [monthlyStatus]);

  const days = Array.from({ length: 7 }, (_, i) =>
    addDays(currentWeekStart, i)
  );

  const goPrevWeek = () => setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  const goNextWeek = () => setCurrentWeekStart(addWeeks(currentWeekStart, 1));

  useEffect(() => {
    const weekEnd = addDays(currentWeekStart, 7);
    if (selectedDate < currentWeekStart || selectedDate >= weekEnd) {
      setCurrentWeekStart(startOfWeek(selectedDate, { weekStartsOn: 1 }));
    }
  }, [selectedDate, currentWeekStart]);

  const isSameDate = (d1: Date, d2: Date) =>
    d1.toDateString() === d2.toDateString();

  return (
    <div className="flex flex-col">
      {/* 요일 헤더 */}
      <div className="flex justify-between mb-1">
        {WEEKDAYS.map((day, idx) => (
          <span
            key={day}
            className={clsx(
              "text-[12px] font-medium text-center flex-1",
              idx === 6
                ? "text-[#F36B6B]"
                : idx === 5
                ? "text-[#7DA7E3]"
                : "text-black dark:text-white"
            )}
          >
            {day}
          </span>
        ))}
      </div>

      {/* 날짜 셀 */}
      <div className="flex w-full justify-between">
        {days.map((day) => {
          const isToday = isSameDate(day, new Date());
          const isSelected = isSameDate(day, selectedDate);
          const weekday = getDay(day);

          const baseColorClass =
            weekday === 0
              ? "text-[#F36B6B]"
              : weekday === 6
              ? "text-[#7DA7E3]"
              : "text-[#656565] dark:text-white";

          const finalColorClass =
            (isToday || isSelected) && weekday !== 0 && weekday !== 6
              ? "text-white"
              : baseColorClass;

          return (
            <div
              key={day.toISOString()}
              onClick={() => setSelectedDate(day)}
              className="flex flex-col items-center cursor-pointer flex-1"
            >
              {/* 날짜별 Todo 완료 현황 */}
              {(() => {
                const key = format(day, "yyyy-MM-dd");
                const status = statusMap[key];
                const incomplete = status
                  ? status.todoTotalCount - status.completedCount
                  : 0;
                const done = Boolean(status?.isAllCompleted);

              return (
                <div
                  className={clsx(
                    "w-5 h-6 rounded-full text-[10px] flex items-center justify-center my-1",
                    {
                      "bg-[#F36B6B] dark:bg-[#F36B6B] text-white": done,
                      "bg-[#D9D9D9] text-black dark:text-black": !done,
                    }
                  )}
                >
                    {status ? (done ? <Check className="w-3 h-3" /> : incomplete) : ""}                  </div>
                );
              })()}

              {/* 날짜 원 (isToday, isSelected) */}
              <span
                className={clsx(
                  "w-5 h-5 flex items-center justify-center rounded-full text-xs",
                  {
                    "font-bold": isToday || isSelected,
                    "bg-black dark:bg-white" : isSelected,
                    "bg-[#DADADA]": isToday && !isSelected,
                  },
                  finalColorClass
                )}
              >
                {day.getDate()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}