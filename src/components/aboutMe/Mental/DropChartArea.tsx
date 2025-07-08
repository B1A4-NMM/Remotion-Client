// DropChartArea.tsx
import { useDrop } from "react-dnd";
import { useState } from "react";
import MentalChart from "../Mental/MentalChart";

const DropChartArea = () => {
  const [currentType, setCurrentType] = useState<"stress" | "anxiety" | "depression">("stress");

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: "MENTAL_TYPE",
    drop: (item: { type: string }) => {
      if (["stress", "anxiety", "depression"].includes(item.type)) {
        setCurrentType(item.type as any);
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      data-drop-zone
      ref={dropRef}
      onDragOver={e => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={e => {
        e.stopPropagation();
      }}
      className="w-full h-72 border-2 border-dashed rounded-xl flex items-center justify-center"
    >
      <MentalChart type={currentType} />
    </div>
  );
};

export default DropChartArea;
