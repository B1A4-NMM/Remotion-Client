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
          className={`${view === "week" ?  "border-[rgba(75,2,2,0.3)] text-[rgba(75,2,2,0.9)]"
          : "border-transparent text-[#999]"
      }`}
        >
          Weekly
        </button>
        <button
          onClick={() => setView("month")}
          className={`${view === "month" ? "border-[rgba(75,2,2,0.3)] text-[rgba(75,2,2,0.9)]"
          : "border-transparent text-[#999]"
      }`}
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
        tileContent={null}
        formatDay={(_,date) => String(date.getDate())}
        value={selectedDate}
        onChange={(value) => setSelectedDate(value as Date)}
        view="month"
        className="react-calendar rounded-lg p-2 h-full"
      />
      </div>
    )}
    </div>
  );
}
