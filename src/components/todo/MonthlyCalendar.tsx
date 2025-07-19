"use client";

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameDay,
  isSameMonth,
  getDay,
} from "date-fns";
import clsx from "clsx";
import { useMemo } from "react";
import { Check } from "lucide-react";

interface MonthlyCalendarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  monthlyStatus?: Array<{
    date: string;
    todoTotalCount: number;
    completedCount: number;
    isAllCompleted: boolean;
  }>;
}

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function MonthlyCalendar({
  selectedDate,
  setSelectedDate,
  monthlyStatus,
}: MonthlyCalendarProps) {
  const today = new Date();

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

  const start = startOfWeek(startOfMonth(selectedDate), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(selectedDate), { weekStartsOn: 1 });

  const days = [];
  let current = start;
  while (current <= end) {
    days.push(current);
    current = addDays(current, 1);
  }

  return (
    <div className="grid grid-cols-7 gap-y-1 pb-4">
      {/* 요일 헤더 */}
      {WEEKDAYS.map((day, idx) => (
        <div
          key={day}
          className={clsx(
            "text-[12px] font-medium text-center",
            idx === 6
              ? "text-[#F36B6B]"
              : idx === 5
              ? "text-[#7DA7E3]"
              : "text-black dark:text-white"
          )}
        >
          {day}
        </div>
      ))}

      {/* 날짜 셀 */}
      {days.map((day) => {
        const isToday = isSameDay(day, today);
        const isSelected = isSameDay(day, selectedDate);
        const inMonth = isSameMonth(day, selectedDate);
        const weekday = getDay(day); // 0: SUN ~ 6: SAT

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

        const bgClass = isToday && isSelected
          ? "bg-black"
          : isSelected
          ? "bg-black"
          : isToday
          ? "bg-[#DADADA]"
          : "";

        return (
          <div
            key={day.toISOString()}
            onClick={() => setSelectedDate(day)}
            className="flex flex-col items-center cursor-pointer"
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
                      "bg-[#D9D9D9] dark:bg-[#656565]": !done,
                    }
                  )}
                >
                  {status ? (done ? <Check className="w-3 h-3" /> : incomplete) : ""}
                </div>
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
                bgClass,
                finalColorClass
              )}
              style={{
                opacity: inMonth ? 1 : 0.3,
              }}
            >
              {day.getDate()}
            </span>
          </div>
        );
      })}
    </div>
  );
}