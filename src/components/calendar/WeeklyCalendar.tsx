"use client";

import { addDays, startOfWeek, format, addWeeks, subWeeks } from "date-fns";
import { useState } from "react";

interface WeeklyCalendarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export default function WeeklyCalendar({
  selectedDate,
  setSelectedDate,
}: WeeklyCalendarProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(selectedDate, { weekStartsOn: 0 })
  );

  const days = Array.from({ length: 7 }, (_, i) =>
    addDays(currentWeekStart, i)
  );

  const goPrevWeek = () => setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  const goNextWeek = () => setCurrentWeekStart(addWeeks(currentWeekStart, 1));

  return (
    <div className="flex flex-col px-4">
      {/* Weekly 바 */}
      <div className="flex items-center justify-between">
        <button onClick={goPrevWeek} className="text-gray-400">&lt;</button>

        <div className="flex-1 overflow-x-auto no-scrollbar">
          <div className="flex w-full justify-between">
            {days.map((day) => {
              const isToday =
                day.toDateString() === new Date().toDateString();
              const isSelected =
                day.toDateString() === selectedDate.toDateString();

              // 오늘이면 선택 상태와 상관없이 '오늘' 스타일 우선
              const isTodaySelected = isToday;

              return (
                <div
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className="flex flex-col items-center cursor-pointer flex-1"
                >
                  {/* 요일: 한 글자 */}
                  <span
                    className={`text-sm ${isToday ? "text-pink-500 font-bold" : "text-gray-400"}`}
                  >
                    {format(day, "EEEEE")}
                  </span>

                  {/* 날짜: 오늘은 핑크 배경/흰글씨, 선택된 날짜는 light gray */}
                  <span
                    className={`
                      mt-1 px-2 py-1 rounded-full
                      ${isTodaySelected ? "bg-pink-500 text-white" : ""}
                      ${!isToday && isSelected ? "bg-gray-200 text-black" : ""}
                    `}
                  >
                    {day.getDate()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <button onClick={goNextWeek} className="text-gray-400">&gt;</button>
      </div>
    </div>
  );
}
