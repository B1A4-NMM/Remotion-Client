import { useQueryClient } from "@tanstack/react-query";
import { useBottomPopupStore } from "@/store/useBottomPopupStore";
import { RoutineType } from "@/types/routine";
import { usePostRoutineByType } from "@/api/queries/routine/usePostRoutineByType";

interface RecommendedRoutinePopupProps {
    emotion: RoutineType;
    onAdd: (title: string) => void;
    onClose:() => void;
  }
  
  const RECOMMENDED_ROUTINES = {
    depression: ["하루 산책하기", "감정 일기 쓰기", "햇빛 받으며 스트레칭"],
    anxiety: ["격렬한 운동하기", "분노 일기 쓰기", "소리 내기 or 감정 표현"],
    stress: ["심호흡 명상", "하루 일정 정리", "따뜻한 차 한 잔"],
  };
  
  export default function RecommendedRoutinePopup({ emotion,onAdd, onClose
   }: RecommendedRoutinePopupProps) {

    //const { close } = useBottomPopupStore();
    const queryClient = useQueryClient();
  
    const { mutate: postRoutine } = usePostRoutineByType();
  
    const handleClick = (title: string) => {
      // postRoutine(
      //   { type:emotion,title },
      //   {
      //     onSuccess: () => {
      //       onAdd(title); //화면에 반영
      //       //바텀시트를 닫을 때 화면 갱신 , 여기서 하면 안됨
      //     },
      //   }
      // );
      onAdd(title);
    };

    //바텀시트를 닫을 때 invalidate 처리
    const handleClose = () => {
      queryClient.invalidateQueries({ queryKey: ["routine",emotion]});
      onClose();
    };
  
    return (
      <div className="p-5">
         <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold mb-2">{emotion} 루틴 추천</h2>
        <button onClick={handleClose} className="text-sm text-gray-500">
          닫기
        </button>
        </div>

        <p className="text-sm text-gray-600 mb-3">아직 루틴이 없어요. 이런 것부터 시작해보는 건 어때요?</p>
        
        {RECOMMENDED_ROUTINES[emotion] ?(
          <ul className="space-y-2">
          {RECOMMENDED_ROUTINES[emotion].map((title, index) => (
            <li
              key={index}
              className="cursor-pointer border border-gray-300 rounded px-3 py-2 hover:bg-gray-100"
              onClick={() => handleClick(title)}
            >
              {title}
            </li>
          ))}
        </ul>

        ) : (
          <p>추천 루틴이 없습니다.</p>

        )}

      </div>
    );
  }