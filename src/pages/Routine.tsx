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

  // const handleFolderClick = async(emotionTitle: string) => {
  //   const emotionKey = emotionTitle as RoutineItem["routineType"];

  //   console.log("Folder 클릭됨", emotionKey);
  //   setSelectedEmotion(emotionKey);

  //   console.log("selectedEmotion SET 완료");
  //   setIsPopupOpen(true);
  //   setShowRecommendation(false);

  //   try{
  //     const data =await getRoutineByType(emotionKey);

  //     if (data && data.length > 0) {
  //       setEmotionRoutines(
  //         data.map((item:any) => ({
  //           id:item.routineId,
  //           title: item.content,
  //           routineType:item.routineType,
  //         }))
  //       ) ;

  //       // 응답 루틴 저장
  //       setShowRecommendation(false);     // 기본 추천 아님

  //     } else {
  //       console.log("루틴 없음,추천 루틴 모달 표시");
  //       setEmotionRoutines([]);           // 루틴 없음
  //       setShowRecommendation(true);      // 기본 추천 보여주기
  //     }
  //   }catch(err){
  //     console.error("루틴 불러오기 실패:",err);
  //     setEmotionRoutines([]);
  //     setShowRecommendation(true);
  //   }
  //   // const hasRoutines = allRoutines.some((r) => r.routineType === emotionKey);
  //   // setShowRecommendation(!hasRoutines);
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
    <div className="  text-foreground min-h-screen">
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
      {triggeredRoutines.length === 0 ? (
        <div className="flex items-center justify-center px-7 min-h-[230px]">
          <p className="text-sm text-gray-500 text-center">아직 선별된 루틴이 없어요.</p>
        </div>
      ) : (
        <PersonalizedRoutineList
          routines={triggeredRoutines.map(r => ({
            id: r.id,
            title: r.title,
            onAdd: () => handleAddRoutine(r.title),
          }))}
        />
      )}

      <BottomPopup
        isOpen={!!selectedEmotion}
        onClose={() => {
          setSelectedEmotion(null);
          setShowRecommendation(false);
        }}
        heightOption={{ heightPixel: 500 }}
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
