// RoutineModalContent.tsx
import { useState,useRef } from "react";
import { RoutineItem } from "@/types/routine";
import { BottomPopupHandle } from "../BottomPopup";

interface RoutineModalContentProps {
  emotion: string;
  routines: RoutineItem[];
  onAdd: (content: string) => void;
  onDelete: (id: number) => void;
  onClose: () => void;
  popupRef: React.RefObject<BottomPopupHandle>;
}

const RoutineModalContent = ({
  emotion,
  routines,
  onAdd,
  onDelete,
  onClose,
  popupRef,
}: RoutineModalContentProps) => {
  const [newRoutine, setNewRoutine] = useState("");

  const handleAdd = () => {
    if (newRoutine.trim()) {
      onAdd(newRoutine.trim());
      setNewRoutine("");
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-black rounded-t-2xl max-h-[75vh] flex flex-col">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-bold text-black dark:text-white">{emotion} 루틴 모아보기</div>
        <button
          onClick={() => popupRef.current?.close()}
          className="text-gray-500 text-sm hover:text-black border border-gray-300 rounded px-3 py-1"
        >
          닫기
        </button>
      </div>

      {/* ✅ 루틴 리스트만 스크롤되게 분리 */}

      {routines.length === 0 ? (
    <p className="text-sm text-gray-400 dark:text-white/50">
      아직 추가된 루틴이 없어요.
    </p>
) : (
  <div className="flex-1 overflow-y-auto pr-1 mb-2">
    {routines.map(routine => (
      <div
        key={routine.id}
        className="flex justify-between items-center
        border px-4 py-3 rounded-xl mb-2 
        text-sm transition
        dark:border-white/10 border-gray-300 
        dark:text-white text-black 
        dark:bg-white/ bg-white 
        dark:hover:bg-white/10 hover:bg-gray-100
        backdrop-blur-sm"
      >
        <span className="text-sm text-black dark:text-white font-sans">
          {routine.content}
        </span>
        <button
          onClick={() => onDelete(routine.id)}
          className="text-xs dark:text-red-300 dark:hover:text-red-500 text-red-600 hover:text-red-800"
        >
          delete
        </button>
      </div>
    ))}
  </div>
)}


     

      {/* ✅ 항상 하단에 고정되는 추가 입력창 */}
      <div className="flex grid grid-cols-4 mt-4 gap-2 pt-2 border-t border-gray-300 dark:border-white/20">
        <input
          type="text"
          value={newRoutine}
          onChange={e => setNewRoutine(e.target.value)}
          placeholder="루틴 추가하기"
          className="flex col-span-3 py-2 text-sm rounded
      border border-gray-300 bg-white text-black
      placeholder-gray-400
      pl-3
      dark:border-white/30 dark:bg-white/10 dark:text-white
      dark:placeholder-white/60
      backdrop-blur-sm"
        />
        <button
          onClick={handleAdd}
          className="col-span-1 rounded-sm`
      bg-black text-white hover:bg-gray-800
      dark:bg-white/20 dark:hover:bg-white/30
      dark:text-white
      hover:scale-105 transition-transform"
        >
          추가
        </button>
      </div>
    </div>
  );
};

export default RoutineModalContent;
