"use client";

import { useState } from "react";
import WeeklyCalendar from "./WeeklyCalendar";
import MonthlyCalendar from "./MonthlyCalendar";
import { addWeeks, subWeeks, addMonths, subMonths, format } from "date-fns";
import { useSelectedDate } from "@/hooks/useSelectedDate";

export default function CalendarSection() {
  const [view, setView] = useState<"week" | "month">("week");
  const { selectedDate, setSelectedDate } = useSelectedDate();

  const goPrev = () => {
    setSelectedDate(
      view === "week" ? subWeeks(selectedDate, 1) : subMonths(selectedDate, 1)
    );
  };

  const goNext = () => {
    setSelectedDate(
      view === "week" ? addWeeks(selectedDate, 1) : addMonths(selectedDate, 1)
    );
  };

  return (
    <div className="flex flex-col h-full px-6">
      {/* ✅ 상단 Navigation */}
      <div className="flex justify-between items-center mt-6 mb-6">
        {/* 좌측: 년월 */}
        <div className="text-lg font-semibold">
          {format(selectedDate, "yyyy년 M월")}
        </div>

        {/* 우측: < > 주 월 */}
        <div className="flex items-center space-x-2 text-sm">
          <button onClick={goPrev} className="text-gray-400 font-bold">
            &lt;
          </button>
          <button onClick={goNext} className="text-gray-400 font-bold">
            &gt;
          </button>
          <span className="font-bold text-black">
            {view === "week" ? "주" : "월"}
          </span>
          <button
            onClick={() => setView(view === "week" ? "month" : "week")}
            className="text-gray-400 font-bold"
          >
            {view === "week" ? "월" : "주"}
          </button>
        </div>
      </div>

      {/* ✅ Calendar 영역 */}
      {view === "week" ? (
        <WeeklyCalendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      ) : (
        <MonthlyCalendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      )}
    </div>
  );
}