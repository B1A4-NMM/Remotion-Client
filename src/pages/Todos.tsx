// Todos.tsx
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { parseDateStringToDate } from "@/utils/date";
import { useTodos } from "@/api/queries/todo/useTodos";
import { useSelectedDate } from "@/hooks/useSelectedDate";
import { formatDate } from "@/utils/date";
import CalendarSection from "../components/todo/CalendarSection";
import TodoSection from "../components/todo/TodoSection";
import Title from "@/components/recommend/Title";

export default function TodosPage() {
  // const { selectedDate } = useSelectedDate();
  const [searchParams] = useSearchParams();
  const { selectedDate, setSelectedDate } = useSelectedDate();
  useTodos(formatDate(selectedDate)); // 📌 할 일 데이터 패칭

  const urlDate = searchParams.get("date");

  useEffect(() => {
    if (urlDate) {
      const parsed = parseDateStringToDate(urlDate); // 날짜 형식 파싱 함수 필요
      setSelectedDate(parsed);
    }
  }, [urlDate]);

  return (
    <div className="overflow-auto text-foreground bg-[#fdfaf8] dark:bg-transparent md:px-8 px-4 pb-8 md:pb-12">
      <Title />

      {/* 📅 Calendar 영역: 높이 고정 없이 자연 배치 */}
      <div className="mt-2 md:mt-4">
        <CalendarSection />
      </div>

      {/* ✅ Todo 영역: Calendar 아래로 자연 흐름 */}
      <div className="mt-6 md:mt-8">
        <TodoSection />
      </div>
    </div>
  );
}
