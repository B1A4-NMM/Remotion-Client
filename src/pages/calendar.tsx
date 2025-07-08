import React from "react";
import { useTodos } from "@/api/queries/todo/useTodos";
import CalendarSection from "../components/calendar/CalendarSection";
import TodoSection from "../components/todo/TodoSection";

export default function Calendar() {
  useTodos(); // 할 일 데이터 패칭

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [size, setSize] = React.useState(50); // 상단 높이 비율
  const [dragging, setDragging] = React.useState(false);

  // 드래그로 캘린더 높이 조절
  React.useEffect(() => {
    if (!dragging) return;

    document.body.style.userSelect = "none";
    document.body.style.overflow = "hidden";

    const handleMove = (e: MouseEvent) => {
      e.preventDefault();
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const percent = (y / rect.height) * 100;
      setSize(Math.min(90, Math.max(10, percent))); // 최소 10%, 최대 90%
    };

    const stop = () => {
      setDragging(false);
      document.body.style.userSelect = "";
      document.body.style.overflow = "";
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", stop);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", stop);
      document.body.style.userSelect = "";
      document.body.style.overflow = "";
    };
  }, [dragging]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col min-h-screen bg-black overflow-hidden"
    >
      {/* ✅ 상단 CalendarSection */}
      <section
        className="bg-[#1E1E1E] flex-none p-4 mb-1 rounded-b-3xl overflow-y-auto"
        style={{ flexBasis: `${size}%` }}
      >
        <CalendarSection />
      </section>

      {/* ✅ 리사이즈 바 */}
      <div
        className="h-2 w-24 self-center my-2 cursor-row-resize bg-gray-300 rounded"
        onMouseDown={() => setDragging(true)}
      />

      {/* ✅ 하단 TodoSection */}
      <section
        className="bg-[#1E1E1E] flex-grow flex flex-col overflow-hidden p-4 mt-1 mb-10 rounded-t-3xl"
        style={{ flexBasis: `${100 - size}%` }}
      >
        <div className="overflow-y-auto flex-grow">
          <TodoSection />
        </div>
      </section>
    </div>
  );
}
