// Todos.tsx

import { useSelectedDate } from "@/hooks/useSelectedDate";
import CalendarSection from "../components/todo/CalendarSection";
import TodoSection from "../components/todo/TodoSection";
import Title from "@/components/recommend/Title";

export default function TodosPage() {
  const { selectedDate } = useSelectedDate();

  return (
    <div className="min-h-screen overflow-auto text-foreground bg-[#fdfaf8] px-4 pb-8">
      <Title currentTab="todos" onTabChange={() => {}} />

      {/* 📅 Calendar 영역: 높이 고정 없이 자연 배치 */}
      <div className="mt-2">
        <CalendarSection />
      </div>

      {/* ✅ Todo 영역: Calendar 아래로 자연 흐름 */}
      <div className="mt-6">
        <TodoSection selectedDate={selectedDate} />
      </div>
    </div>
  );
}