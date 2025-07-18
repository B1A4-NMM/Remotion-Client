"use client";

import { useState } from "react";
import WeeklyCalendar from "./WeeklyCalendar";
import MonthlyCalendar from "./MonthlyCalendar";
import { addWeeks, subWeeks, addMonths, subMonths, format } from "date-fns";
import { useSelectedDate } from "@/hooks/useSelectedDate";
import { useMonthlyStatus } from "@/api/queries/todo/useMonthlyStatus";

export default function CalendarSection() {
  const [view, setView] = useState<"week" | "month">("week");
  const { selectedDate, setSelectedDate } = useSelectedDate();
  const { data: monthlyStatus } = useMonthlyStatus(selectedDate);

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
    <div className="flex flex-col px-2 sm:px-4">
      {/* 상단 Navigation */}
      <div className="flex justify-between items-center mt-4 mb-6">
        <div className="text-lg font-semibold">
          {format(selectedDate, "yyyy년 M월")}
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <button onClick={goPrev} className="text-black dark:text-white font-black">
            &lt;
          </button>
          <button onClick={goNext} className="text-black dark:text-white font-black">
            &gt;
          </button>
          <span className="font-bold">
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

      {/* Calendar */}
      {view === "week" ? (
        <WeeklyCalendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          monthlyStatus={monthlyStatus}
        />
      ) : (
        <MonthlyCalendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          monthlyStatus={monthlyStatus}
        />
      )}
    </div>
  );
}