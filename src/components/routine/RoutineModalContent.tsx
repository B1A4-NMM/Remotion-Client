// RoutineModalContent.tsx
import { useState } from "react";
import { RoutineItem } from "@/types/routine";



interface RoutineModalContentProps {
  emotion: string;
  routines: RoutineItem[];
  onAdd: (content: string) => void;
  onDelete: (id: number) => void;
  onClose: () => void;
}

const RoutineModalContent = ({
  emotion,
  routines,
  onAdd,
  onDelete,
  onClose,
}: RoutineModalContentProps) => {
  const [newRoutine, setNewRoutine] = useState("");

  const handleAdd = () => {
    if (newRoutine.trim()) {
      onAdd(newRoutine.trim());
      setNewRoutine("");
    }
  };

  return (

  <div className="p-6 bg-white rounded-t-2xl max-h-[75vh] overflow-y-auto">
    <div className="flex justify-between items=center mb-4">    
      <div className="text-lg font-bold mb-4">{emotion} 루틴 모아보기</div>
      <button onClick={onClose} 
      className="text-gray-500 text-sm hover:text-black border border-gray-300 rounded px-3 py-1">
      닫기
      </button>
      </div>

      {routines.length === 0 ? (
        <p className="text-sm text-gray-400">아직 추가된 루틴이 없어요.</p>
      ) : (
        routines.map((routine) => (
          <div
      key={routine.id}
      className="
      flex justify-between items-center 
      border px-4 py-3 rounded-xl mb-2 
      transition
      text-sm
      dark:border-white/30 border-gray-300 
      dark:text-white text-black 
      dark:bg-white/10 bg-white 
      dark:hover:bg-white/20 hover:bg-gray-100
      backdrop-blur-sm
      "
    >
      <span className="text-sm">{routine.content}</span>
      <button
        onClick={() => onDelete(routine.id)}
        className="text-xs dark:text-red-300 dark:hover:text-red-500 text-red-600 hover:text-red-800"
      >
      delete
    </button>
  </div>
        ))
      )}

      <div className="flex mt-4 gap-2">
        <input
          type="text"
          value={newRoutine}
          onChange={(e) => setNewRoutine(e.target.value)}
          placeholder="루틴 추가하기"
          className="
          flex-1 px-3 py-2 text-sm rounded
        border border-gray-300 bg-white text-black
        placeholder-gray-400
        dark:border-white/30 dark:bg-white/10 dark:text-white
        dark:placeholder-white/60
        backdrop-blur-sm
          "
        />
        <button
          onClick={handleAdd}
          className="
          px-4 py-2 rounded
        bg-black text-white hover:bg-gray-800
        dark:bg-white/20 dark:hover:bg-white/30
        dark:text-white
        hover:scale-105 transition-transform
          "
        >
          추가
        </button>
      </div>
    </div>
  );
};

export default RoutineModalContent;
