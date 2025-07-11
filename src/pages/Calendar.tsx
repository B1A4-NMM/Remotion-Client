// ✅ 캘린더 + 투두 리사이즈 UI 통합 버전
import React from "react";
import { useTodos } from "@/api/queries/todo/useTodos";
import CalendarSection from "../components/calendar/CalendarSection";
import TodoSection from "../components/todo/TodoSection";

export default function CalendarPage() {
  useTodos(); // 할 일 패칭

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [size, setSize] = React.useState(50); // 상단 비율
  const [dragging, setDragging] = React.useState(false);
  const startYRef = React.useRef<number | null>(null);

  // const updateSizeFromDelta = (deltaY: number) => {
  //   const rect = containerRef.current?.getBoundingClientRect();
  //   if (!rect) return;
  //   const percentDelta = (deltaY / rect.height) * 100 * 1.5;
  //   const newSize = Math.min(95, Math.max(5, size + percentDelta)); // ✅ 마우스 방향과 화면 동기화
  //   setSize(newSize);
  // };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true);
    startYRef.current = e.clientY;

  };

  let animationFrame:number | null = null;

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging || startYRef.current === null || !containerRef.current) return;

    if(animationFrame) cancelAnimationFrame(animationFrame);

    animationFrame=requestAnimationFrame(() => {
      const deltaY = e.clientY - startYRef.current!;
      
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const percentDelta = (deltaY / rect.height) * 100 * 1.5;
      
      const newSize = Math.min(70, Math.max(20, size + percentDelta));
      setSize(newSize);
    });
 };

  const handleMouseUp = () => {
    setDragging(false);
    startYRef.current = null;
  };

  React.useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-screen overflow-hidden"
      style = {{ backgroundColor : "#FAF6F4" }} //밝은 배경 
    >
      {/* 📅 상단 Calendar */}
      <section
        className="transition-[flex-basis] duration-200 ease-in-out p-4 rounded-b-3xl overflow-hidden"
        style={{ flexBasis: `${size}%` }}
      >
      <div className="h-full"> 
        <CalendarSection />
      </div>
    </section>

      {/* ✅ 커스텀 경계 바 */}
      <div
        className="h-2 w-24 self-center my-1 bg-black/40 rounded-full cursor-row-resize"
        onMouseDown={handleMouseDown}
      />

      {/* ✅ 하단 Todo */}
      <section
        className="transition-[flex-basis] duration-200 ease-in-out p-4 rounded-t-3xl overflow-hidden flex-grow"
        style={{ flexBasis: `${100 - size}%` }}
      >
        <div className="overflow-y-auto h-full">
          <TodoSection />
        </div>
      </section>
    </div>
  );
}
