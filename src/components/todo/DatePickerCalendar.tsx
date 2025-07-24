
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "@/styles/day-picker.css";
import { ko } from "date-fns/locale";
import { formatDate } from "@/utils/date";

interface DatePickerCalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

export default function DatePickerCalendar({ selectedDate, onDateSelect }: DatePickerCalendarProps) {
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onDateSelect(formatDate(date));
    }
  };

  return (
    <DayPicker
      mode="single"
      selected={new Date(selectedDate)}
      onSelect={handleDateSelect}
      locale={ko}
      className="w-full"
    />
  );
}
