import React, { useEffect, useRef, useState } from "react";
import { useTodos } from "@/api/queries/todo/useTodos";
import CalendarSection from "../components/todo/CalendarSection";
import TodoSection from "../components/todo/TodoSection";
import Title from "@/components/recommend/Title";

export default function CalendarPage() {
  useTodos(); // 📌 할 일 데이터 패칭

  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(50); // 상단 Calendar 영역 비율
  const [dragging, setDragging] = useState(false);
  const startYRef = useRef<number | null>(null);
  let animationFrame: number | null = null;

  // 🖱️ Mouse Down
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true);
    startYRef.current = e.clientY;
  };

  // 🖱️ Mouse Move
  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging || startYRef.current === null || !containerRef.current) return;

    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(() => {
      const deltaY = e.clientY - startYRef.current!;
      const rect = containerRef.current.getBoundingClientRect();
      const percentDelta = (deltaY / rect.height) * 100 * 1.5;
      const newSize = Math.min(75, Math.max(20, size + percentDelta));
      setSize(newSize);
      startYRef.current = e.clientY;
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
    startYRef.current = null;
  };

  // 📱 Touch Start
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setDragging(true);
    startYRef.current = e.touches[0].clientY;
  };

  // 📱 Touch Move
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!dragging || startYRef.current === null || !containerRef.current) return;
    const deltaY = e.touches[0].clientY - startYRef.current!;
    const rect = containerRef.current.getBoundingClientRect();
    const percentDelta = (deltaY / rect.height) * 100 * 1.5;
    const newSize = Math.min(80, Math.max(20, size + percentDelta));
    setSize(newSize);
    startYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    setDragging(false);
    startYRef.current = null;
  };

  //이벤트 리스너 등록
  useEffect(() => {
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
      className="flex flex-col h-screen overflow-hidden   text-foreground"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Title />
      {/* 📅 상단 Calendar */}
      <section
        className="transition-[flex-basis] duration-200 ease-in-out px-4 pt-4 pb-2 overflow-hidden"
        style={{ height: `calc(${size}vh)` }}
      >
        <div className="h-full w-full rounded-2xl overflow-hidden">
          <CalendarSection />
        </div>
      </section>

      {/* 🔘 커스텀 리사이즈 바 */}
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
