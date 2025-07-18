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
            className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg mb-2"
          >
            <span className="text-sm">{routine.content}</span>
            <button onClick={() => onDelete(routine.id)}>delete</button>
          </div>
        ))
      )}

      <div className="flex mt-4 gap-2">
        <input
          type="text"
          value={newRoutine}
          onChange={(e) => setNewRoutine(e.target.value)}
          placeholder="루틴 추가하기"
          className="flex-1 border rounded px-3 py-2 text-sm"
        />
        <button
          onClick={handleAdd}
          className="bg-black text-white hover:bg-gray-800 px-4 py-2 rounded hover:scale-105 transition-transform"
        >
          추가
        </button>
      </div>
    </div>
  );
};

export default RoutineModalContent;
