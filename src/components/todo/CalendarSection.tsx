"use client";

import { useState } from "react";
import WeeklyCalendar from "./WeeklyCalendar";
import MonthlyCalendar from "./MonthlyCalendar";
import { addWeeks, subWeeks, addMonths, subMonths } from "date-fns";
import { useSelectedDate } from "@/store/calendarStore";

export default function CalendarSection() {
  const [view, setView] = useState<"week" | "month">("week");
  const { selectedDate, setSelectedDate } = useSelectedDate();

  const goPrev = () => {
    if (view === "week") {
      setSelectedDate(subWeeks(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  };

  const goNext = () => {
    if (view === "week") {
      setSelectedDate(addWeeks(selectedDate, 1));
    } else {
      setSelectedDate(addMonths(selectedDate, 1));
    }
  };
  return (
    <div className="flex flex-col h-full">
      {/* Navigation and toggle */}
      <div className="flex items-center justify-between px-4 mt-4 mb-4 text-lg font-bold">
        <button onClick={goPrev} className="text-gray-400">&lt;</button>
        <button
          onClick={() => setView(view === "week" ? "month" : "week")}
          className="px-4 py-1 border rounded-full"
        >
          {view === "week" ? "월간" : "주간"}
        </button>
        <button onClick={goNext} className="text-gray-400">&gt;</button>
      </div>

      {view === "week" && (
        <WeeklyCalendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />      
      )}

      {view === "month" && (
        <MonthlyCalendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      )}
    </div>
  );
}
