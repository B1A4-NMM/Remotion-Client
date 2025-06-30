import React from "react";
import TodoSection from "../components/todo/TodoSection"

const Calendar = () => {
  return (
    <div className = "flex flex-col">
        <div> ⬆️ 캘린더 / ⬇️ 할 일 </div>
        <TodoSection />
    </div>
  );
};

export default Calendar;
