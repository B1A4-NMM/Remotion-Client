"use client";

import { useState } from "react";
import WeeklyCalendar from "./WeeklyCalendar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarSection() {
  const [view, setView] = useState<"week" | "month">("week");
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="flex flex-col h-full">
      {/* View toggle */}
      <div className="text-lg font-bold flex gap-4 px-4 mt-4 mb-4">
        <button
          onClick={() => setView("week")}
          className={`${view === "week" ? "font-bold text-white" : "text-gray-400"}`}
        >
          Weekly
        </button>
        <button
          onClick={() => setView("month")}
          className={`${view === "month" ? "font-bold text-white" : "text-gray-400"}`}
        >
          Monthly
        </button>
      </div>

      {view === "week" && (
        <WeeklyCalendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      )}

    {view === "month" && (
      <div className="h-full w-full">
      <Calendar
        value={selectedDate}
        onChange={(value) => setSelectedDate(value as Date)}
        view="month"
        className="react-calendar rounded-lg p-2 bg-[#1E1E1E] text-white h-full"
      />
      </div>
    )}
    </div>
  );
}
