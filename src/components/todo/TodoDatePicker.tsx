import { addMonths, subMonths, format } from "date-fns";
import { useState, useEffect } from "react";
import MonthlyCalendar from "./MonthlyCalendar";

interface TodoDatePickerProps {
  date: Date;
  onSelect: (date: Date) => void;
}

export default function TodoDatePicker({ date, onSelect }: TodoDatePickerProps) {
  const [selected, setSelected] = useState(date);

  useEffect(() => {
    setSelected(date);
  }, [date]);

  const goPrev = () => setSelected(prev => subMonths(prev, 1));
  const goNext = () => setSelected(prev => addMonths(prev, 1));

  const handleSelect = (d: Date) => {
    setSelected(d);
    onSelect(d);
  };

  return (
    <div className="flex flex-col px-2">
      <div className="flex justify-between items-center mb-4">
        <button onClick={goPrev} className="text-black dark:text-white font-black">
          &lt;
        </button>
        <span className="text-lg font-semibold">
          {format(selected, "yyyy년 M월")}
        </span>
        <button onClick={goNext} className="text-black dark:text-white font-black">
          &gt;
        </button>
      </div>
      <MonthlyCalendar
        selectedDate={selected}
        setSelectedDate={handleSelect}
      />
    </div>
  );
}
