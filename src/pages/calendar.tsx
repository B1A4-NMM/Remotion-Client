import React from "react";
import CalendarSection from "../components/calendar/CalendarSection";
import TodoSection from "../components/todo/TodoSection"

export default function Calendar() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-none border-b">
        <CalendarSection />
      </div>
      <div> ⬆️ 캘린더 / ⬇️ 할 일 </div>
      <div className="flex-grow overflow-y-auto">
        <TodoSection />
      </div>
    </div>
  );
}