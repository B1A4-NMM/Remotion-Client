"use client";

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isSameMonth,
  getDay,
} from "date-fns";
import clsx from "clsx";

interface MonthlyCalendarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function MonthlyCalendar({
  selectedDate,
  setSelectedDate,
}: MonthlyCalendarProps) {
  const today = new Date();

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
          className="text-[12px] font-medium text-center"
          style={{
            color:
              idx === 6
                ? "#F36B6B"
                : idx === 5
                ? "#7DA7E3"
                : "black",
          }}
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

        const dateColor =
          weekday === 0
            ? "#F36B6B"
            : weekday === 6
            ? "#7DA7E3"
            : "#656565";

        const finalColor =
          (isToday || isSelected) && weekday !== 0 && weekday !== 6
            ? "white"
            : dateColor;

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
            {/* 완료 체크박스 자리 */}
            <div className="w-5 h-6 rounded-full bg-[#D9D9D9] my-1" />

            {/* 날짜 */}
            <span
              className={clsx(
                "w-5 h-5 flex items-center justify-center rounded-full text-xs",
                {
                  "font-bold": isToday || isSelected,
                },
                bgClass
              )}
              style={{
                color: finalColor,
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