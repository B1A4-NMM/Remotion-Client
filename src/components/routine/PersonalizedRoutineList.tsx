import React, { useState,useEffect } from "react";
import { usePatchRoutineById } from "@/api/queries/routine/usePatchRoutineById"
import { precisionFixed } from "d3";

interface RoutineItem {
  id: number;
  content: string;
  onAdd: () => void;
}

interface Props {
  routines: RoutineItem[];
}

const PersonalizedRoutineList = ({ routines }: Props) => {
  const [ localRoutines, setLocalRoutines ] = useState<RoutineItem[]>(routines);
  const { mutate } = usePatchRoutineById();

  const handleAddAndPatch = (routine : RoutineItem) => {
    mutate(routine.id, {
      onSuccess: () => {
        routine.onAdd();
        setLocalRoutines((prev) =>
        prev.filter((item) => item.id !== routine.id )
        );
      }
    });
  }

  useEffect(() => {
    setLocalRoutines(routines);
  }, [routines]);



  return (
    <div className="px-7 mt-4">
      {/* 고정 높이 + 내부 스크롤 가능한 박스 */}
      <div
        className="flex flex-col space-y-2 overflow-y-auto pb-[125px] max-h-[calc(100vh-330px)]"
        style={{ maxHeight: "calc(100vh - 400px)" }} // 상단 영역 제외한 나머지 높이
      >
        {localRoutines.map((routine) => (
          <div
            key={routine.id}
            className="w-full bg-white rounded-xl border border-gray-200 py-3 px-4 flex items-center justify-between shadow-sm"
          >
            <span className="text-sm text-gray-800">{routine.content}</span>
            <button
              className="w-6 h-6 flex items-center justify-center text-lg rounded-full bg-white/40 text-red
                           hover:scale-125 transition-transform duration-200 ease-in-out"
              onClick={() => handleAddAndPatch(routine)}
            >
              +
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalizedRoutineList;
