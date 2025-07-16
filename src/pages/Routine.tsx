import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import Title from "@/components/recommend/Title";
import FolderCardList from "@/components/routine/FolderCardList";
import BottomPopup from "@/components/routine/BottomPopup";
import RoutineModalContent from "@/components/routine/RoutineModalContent";
import PersonalizedRoutineList from "@/components/routine/PersonalizedRoutineList";
import RecommendedRoutinePopup from "@/components/routine/RecommendedRoutinePoPup";
import { getTriggerRoutine, getRoutineByType } from "@/api/services/routine";
import { RoutineType } from "@/types/routine";

export interface RoutineItem {
  id: number;
  title: string;
  routineType: RoutineType;
}

const Routine = () => {
  const queryClient = useQueryClient();

  const [triggeredRoutines, setTriggeredRoutines] = useState<RoutineItem[]>([]);
  const [selectedEmotion, setSelectedEmotion] = useState<RoutineItem["routineType"] | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<RoutineItem["routineType"] | null>(null);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [allRoutines, setAllRoutines] = useState<RoutineItem[]>([]);
  const [emotionRoutines, setEmotionRoutines] = useState<RoutineItem[]>([]);

  // // ✅ ✅ ✅ 이 부분 추가해봐! (Routine 컴포넌트 안에서만)
  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log("🔥 강제 테스트: 우울 루틴 모달 열기");
  //     setSelectedEmotion("depression");
  //     setShowRecommendation(true);
  //   }, 1000);
  // }, []);

  // 서버에서 Trigger 루틴 조회
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTriggerRoutine();
        setTriggeredRoutines(data);
      } catch (err) {
        console.error("루틴 불러오기 실패:", err);
      }
    };

    fetchData();
  }, []);

  // 루틴 추가 핸들러
  const handleAddRoutine = (title: string) => {
    if (!selectedFilter) return;
    const newRoutine: RoutineItem = {
      id: Date.now(),
      title,
      routineType: selectedFilter,
    };
    setAllRoutines(prev => [...prev, newRoutine]);
  };

  const handleDeleteRoutine = (id: number) => {
    setAllRoutines(prev => prev.filter(r => r.id !== id));
  };

  // const handleFolderClick = async (emotionTitle: string) => {
  //   const emotionKey = emotionTitle as RoutineItem["routineType"];

  //   console.log("🔥 Folder 클릭됨", emotionKey);

  //   // 상태를 한 번에 설정하여 동기화 문제 방지
  //   setSelectedEmotion(emotionKey);
  //   setShowRecommendation(true);

  //   console.log("🔥 모달 상태 설정 완료:", { emotionKey });

  //   // API 호출 (백그라운드)
  //   try {
  //     const data = await getRoutineByType(emotionKey);

  //     if (data && data.length > 0) {
  //       const mappedRoutines = data.map((item: any) => ({
  //         id: item.routineId,
  //         title: item.content,
  //         routineType: item.routineType,
  //       }));

  //       console.log("🔍 매핑된 루틴 데이터:", mappedRoutines);

  //       setTriggeredRoutines(prev => {
  //         const existingIds = prev.map(r => r.id);
  //         const newRoutines = mappedRoutines.filter(r => !existingIds.includes(r.id));
  //         return [...prev, ...newRoutines];
  //       });
  //     }
  //   } catch (err) {
  //     console.error("루틴 불러오기 실패:", err);
  //   }
  // };

    // Routine.tsx 내
  const handleFolderClick = (emotionTitle: string) => {
  const emotionKey = emotionTitle as RoutineItem["routineType"];
  console.log("🔥 폴더 클릭됨 (테스트)", emotionKey);

  setSelectedEmotion(null);
  setShowRecommendation(false);
  
  // setSelectedEmotion(emotionKey);
  // setShowRecommendation(true); // 무조건 추천루틴 모달 뜨게 고정

   // 2단계: 약간의 딜레이 후 다시 설정
   setTimeout(() => {
    setSelectedEmotion(emotionKey);
    setShowRecommendation(true); // 무조건 추천 뜨게
  }, 0); // 또는 10~50ms
};

  //추천 루틴 추가
  const handleRecommendedAdd = (title: string) => {
    if (!selectedEmotion) return;
    const newRoutine: RoutineItem = {
      id: Date.now(),
      title,
      routineType: selectedEmotion,
    };
    setAllRoutines(prev => [...prev, newRoutine]);
    setShowRecommendation(false);
  };

  return (
    <div>
      <Title />

      {/* 상단 제목 */}
      <div className="mt-10 flex justify-between px-7">
        <h1 className="text-xl font-bold mb-[20px]">당신의 루틴</h1>
      </div>

      <FolderCardList onFolderClick={handleFolderClick} />

      {/* 필터 버튼 */}
      <div className="flex justify-between px-7 mt-6">
        <h1 className="text-xl font-bold">하루뒤가 선별한 루틴</h1>
      </div>
      <div className="flex gap-3 px-7 mt-2 mb-4">
        {(["depression", "stress", "anxiety"] as RoutineItem["routineType"][]).map(type => (
          <button
            key={type}
            className={`px-4 py-1 rounded-full border text-sm ${
              selectedFilter === type ? "bg-black text-white" : "bg-white text-black"
            }`}
            onClick={() => setSelectedFilter(selectedFilter === type ? null : type)}
          >
            {
              {
                depression: "우울",
                stress: "스트레스",
                anxiety: "분노",
              }[type]
            }
          </button>
        ))}
      </div>

      {/* 루틴 리스트 */}
      {(() => {
        // 선택된 필터에 따라 루틴 필터링
        const filteredRoutines = selectedFilter
          ? triggeredRoutines.filter(r => {
              // 매핑된 데이터와 원본 데이터 모두 처리
              const routineType = r.routineType || (r as any).routineType;
              return routineType === selectedFilter;
            })
          : [];

        // 표시용 데이터로 변환 (원본 데이터도 처리)
        const displayRoutines = filteredRoutines.map(r => ({
          id: r.id || (r as any).routineId,
          title: r.title || (r as any).content,
          onAdd: () => handleAddRoutine(r.title || (r as any).content),
        }));

        console.log("🔍 전체 루틴:", triggeredRoutines);
        console.log("🔍 선택된 필터:", selectedFilter);
        console.log("🔍 필터링된 루틴:", filteredRoutines);

        return displayRoutines.length === 0 ? (
          <div className="flex items-center justify-center px-7 min-h-[230px]">
            <p className="text-sm text-gray-500 text-center">
              {selectedFilter ? "해당 감정의 루틴이 없어요." : "감정을 선택해주세요."}
            </p>
          </div>
        ) : (
          <PersonalizedRoutineList routines={displayRoutines} />
        );
      })()}

<BottomPopup
  isOpen={!!selectedEmotion}
  onClose={() => {
    setSelectedEmotion(null);
    setShowRecommendation(false);
  }}
  heightOption={{ heightPixel: 700 }}
>
  {selectedEmotion && showRecommendation && (
    <RecommendedRoutinePopup
      emotion={selectedEmotion}
      onAdd={handleRecommendedAdd}
      onClose={() => {
        setSelectedEmotion(null);
        setShowRecommendation(false);
        
      }}
    />
  )}
</BottomPopup>
    </div>
  );
};

export default Routine;
