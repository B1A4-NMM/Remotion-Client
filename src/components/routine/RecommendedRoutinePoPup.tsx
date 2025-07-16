import { useQueryClient } from "@tanstack/react-query";
import { useBottomPopupStore } from "@/store/useBottomPopupStore";
import { RoutineType } from "@/types/routine";
import { usePostRoutineByType } from "@/api/queries/routine/usePostRoutineByType";

interface RecommendedRoutinePopupProps {
  emotion: RoutineType;
  onAdd: (title: string) => void;
  onClose: () => void;
}

const RECOMMENDED_ROUTINES = {
  depression: ["하루 산책하기", "감정 일기 쓰기", "햇빛 받으며 스트레칭"],
  anxiety: ["격렬한 운동하기", "분노 일기 쓰기", "소리 내기 or 감정 표현"],
  stress: ["심호흡 명상", "하루 일정 정리", "따뜻한 차 한 잔"],
};

export default function RecommendedRoutinePopup({
  emotion,
  onAdd,
  onClose,
}: RecommendedRoutinePopupProps) {
  const queryClient = useQueryClient();
  const { mutate: postRoutine } = usePostRoutineByType();

  const handleClick = (title: string) => {
    onAdd(title);
  };

  const handleClose = () => {
    queryClient.invalidateQueries({ queryKey: ["routine", emotion] });
    onClose();
  };

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>

      <div
        className="bg-white rounded-2xl w-full"
        style={{
          animation: "slideUp 0.3s ease-out",
        }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-black">{emotion} 루틴 추천</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-5">
            아직 루틴이 없어요. 이런 것부터 시작해보는 건 어때요?
          </p>

          {RECOMMENDED_ROUTINES[emotion] ? (
            <div className="space-y-3">
              {RECOMMENDED_ROUTINES[emotion].map((title, index) => (
                <button
                  key={index}
                  className="w-full text-left bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 active:scale-[0.98]"
                  onClick={() => handleClick(title)}
                >
                  <span className="text-black text-sm">{title}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">추천 루틴이 없습니다.</p>
          )}
        </div>
      </div>
    </>
  );
}
