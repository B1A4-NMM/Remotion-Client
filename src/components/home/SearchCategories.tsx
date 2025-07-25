import React, { useState } from "react";
import { Camera, Bookmark, Calendar } from "lucide-react";
import MonthlyCalendar from "../diary/MonthlyCalendar";
import dayjs from "dayjs";

interface SearchCategoriesProps {
  onCategorySelect: (category: "photo" | "place" | "bookmark" | "date") => void;
  selectedCategory: string | null;
  onDateSelect?: (date: string) => void;
}

const SearchCategories: React.FC<SearchCategoriesProps> = ({
  onCategorySelect,
  selectedCategory,
  onDateSelect,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));

  const categories = [
    {
      id: "photo",
      icon: <Camera className="w-5 h-5" />,
      label: "사진",
    },
    {
      id: "date",
      icon: <Calendar className="w-5 h-5" />,
      label: "날짜",
    },
    {
      id: "bookmark",
      icon: <Bookmark className="w-5 h-5" />,
      label: "북마크",
    },
  ];

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === "date") {
      setIsCalendarOpen(true);
    } else {
      onCategorySelect(categoryId as "photo" | "place" | "bookmark" | "date");
    }
  };

  const handleDateSelect = (date: string) => {
    console.log("🔍 SearchCategories handleDateSelect 호출됨:", date);
    console.log("🔍 onDateSelect prop 존재 여부:", !!onDateSelect);
    setSelectedDate(date);
    setIsCalendarOpen(false);
    onDateSelect?.(date);
    // onCategorySelect("date"); // 제거 - SearchPage에서 직접 처리
  };

  return (
    <>
      <div className="px-4 py-2">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">카테고리</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {category.icon}
              <span className="text-sm">{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 날짜 선택 캘린더 */}
      <MonthlyCalendar
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        onClose={() => setIsCalendarOpen(false)}
        isOpen={isCalendarOpen}
        overlayTopClass="top-60"
      />
      {console.log("🔍 MonthlyCalendar props:", {
        selectedDate,
        isCalendarOpen,
        onDateSelect: typeof handleDateSelect,
      })}
    </>
  );
};

export default SearchCategories;
