import { useTodos } from "@/api/queries/todo/useTodos";
import CalendarSection from "../components/todo/CalendarSection";
import TodoSection from "../components/todo/TodoSection";
import Title from "@/components/recommend/Title";

export default function CalendarPage() {
  useTodos(); // 📌 할 일 데이터 패칭

  return (
    <div className="flex flex-col h-screen overflow-hidden text-foreground">
      <Title />

      {/* 📅 Calendar */}
      <section className="px-4 pt-4 pb-2 h-[45vh]">
        <div className="h-full w-full rounded-2xl overflow-hidden">
          <CalendarSection />
        </div>
      </section>

      {/* ✅ Todo List */}
      <section className="p-4 rounded-t-3xl overflow-hidden flex-grow">
        <div className="overflow-y-auto h-full">
          <TodoSection />
        </div>
      </section>
    </div>
  );
}