import { useState, useEffect,useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { BottomPopupHandle } from "@/components/BottomPopup";

import { usePostRoutineByType } from "@/api/queries/routine/usePostRoutineByType";
import { useGetRoutineByType } from "@/api/queries/routine/useGetRoutineByType";

import Title from "@/components/recommend/Title";
import FolderCardList from "@/components/routine/FolderCardList";
import BottomPopup from "@/components/BottomPopup";
import RoutineModalContent from "@/components/routine/RoutineModalContent";
import PersonalizedRoutineList from "@/components/routine/PersonalizedRoutineList";
import RecommendedRoutinePopup from "@/components/routine/RecommendedRoutinePoPup";

import { getTriggerRoutine, getRoutineByType } from "@/api/services/routine";
import { RoutineItem } from "@/types/routine";
import { useDeleteRoutineById } from "@/api/queries/routine/useDeleteRoutineById";
import { R } from "node_modules/framer-motion/dist/types.d-D0HXPxHm";

const Routine = () => {
  const queryClient = useQueryClient();
  const postRoutineMutation = usePostRoutineByType();
  const deleteRoutineMutation = useDeleteRoutineById();

  const [triggeredRoutines, setTriggeredRoutines] = useState<RoutineItem[]>([]);
  const [selectedEmotion, setSelectedEmotion] = useState<RoutineItem["routineType"] | null>(null);

  const [selectedRoutines, setSelectedRoutines] = useState<RoutineItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<RoutineItem["routineType"] | null>(
    "depression"
  );
  const [showRecommendation, setShowRecommendation] = useState(false);

  //바텀 팝업 상태 관리
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  //닫기 버튼 눌렀을 때 애니매이션 적용 
  const popupRef = useRef<BottomPopupHandle>(null);

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

  const { data: fetchedData, refetch: refetchRoutine } = useGetRoutineByType(
    selectedEmotion || "depression",
    { enabled: false }
  );

  const handleAddRoutine = async (content: string) => {
    if (!selectedEmotion) return;

    try {
      await postRoutineMutation.mutateAsync({
        type: selectedEmotion,
        content: content,
      });

      const updated = await getRoutineByType(selectedEmotion);
      const normalized = updated.map(item => ({
        id: item.routineId,
        content: item.content,
        routineType: item.routineType,
      }));

      setSelectedRoutines(normalized);
      await refetchRoutine();
    } catch (err) {
      console.error("루틴 추가 실패", err);
    }
  };

  const handleDeleteRoutine = async (id: number) => {
    try {
      await deleteRoutineMutation.mutateAsync(id);
      await refetchRoutine();
    } catch (err) {
      console.error("루틴 삭제 실패", err);
    }
  };

  // 루틴 폴더 상태관리 위한 함수 - 1
  const refreshTriggeredRoutines = async () => { 
    try{
      const updated = await getTriggerRoutine();
      setTriggeredRoutines(updated);
    }catch(err){
      console.error("루틴 생신 실패:", err);
    }
    // const data = await getTriggerRoutine();
    // setTriggeredRoutines(data);
  } 

  const handleFolderClick = async (emotionTitle: string) => {
    const emotionKey = emotionTitle as RoutineItem["routineType"];
    console.log("🔥 폴더 클릭됨", emotionKey);

    // 초기화
    setIsPopupOpen(false);
    setSelectedEmotion(null);
    setSelectedRoutines([]);
    setShowRecommendation(false);

    try {
      const routines = await getRoutineByType(emotionKey);

      const normalized: RoutineItem[] = routines.map((item: any) => ({
        id: item.routineId,
        content: item.content,
        routineType: item.routineType,
      }));

      setSelectedEmotion(emotionKey);

      if (routines && routines.length > 0) {
        setSelectedRoutines(normalized);
        setShowRecommendation(false);
      } else {
        setShowRecommendation(true);
      }

      setIsPopupOpen(true);
    } catch (err) {
      console.error("루틴 요청 실패", err);
      setSelectedEmotion(emotionKey);
      setSelectedRoutines([]);
      setShowRecommendation(true);
      setIsPopupOpen(true);
    }
  };

  //추천 루틴 추가
  const handleRecommendedAdd = (content: string) => {
    if (!selectedEmotion) return;

    // 1. 서버에 POST
    postRoutineMutation.mutate({
      type: selectedEmotion,
      content, // string말고 content
    });
  };

  return (
    <div className="overflow-auto text-foreground bg-[#fdfaf8] dark:bg-transparent px-4 ">
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
        {(["depression", "anxiety", "stress"] as RoutineItem["routineType"][]).map(type => (
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
                anxiety: "불안",
                stress: "스트레스",
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
          content: r.content || (r as any).content,
          onAdd: () => handleAddRoutine(r.content || (r as any).content),
        }));

        // console.log("🔍 전체 루틴:", triggeredRoutines);
        // console.log("🔍 선택된 필터:", selectedFilter);
        // console.log("🔍 필터링된 루틴:", filteredRoutines);

        return displayRoutines.length === 0 ? (
          <div className="flex items-center justify-center px-7 min-h-[230px]">
            <p className="text-sm text-gray-500 text-center">
              {selectedFilter ? "해당 감정의 루틴이 없어요." : "감정을 선택해주세요."}
            </p>
          </div>
        ) : (
          <PersonalizedRoutineList 
          routines={displayRoutines}
          onRefresh= {refreshTriggeredRoutines} />
        );
      })()}

      {selectedEmotion && (
        <BottomPopup
          ref={popupRef}
          isOpen={isPopupOpen}
          onClose={() => {
            setSelectedEmotion(null);
            setShowRecommendation(false);
            setIsPopupOpen(false);
          }}
          heightOption={{ heightPixel: 700 }}
        >
          {showRecommendation ? (
            <RecommendedRoutinePopup
              emotion={selectedEmotion}
              onAdd={handleRecommendedAdd}
              onClose={() => {
                setSelectedEmotion(null);
                setShowRecommendation(false);
              }}
            />
          ) : (
            <RoutineModalContent
              popupRef={popupRef}
              emotion={selectedEmotion}
              routines={selectedRoutines}
              onAdd={handleAddRoutine}
              onDelete={handleDeleteRoutine}
              onClose={() => {
                setSelectedEmotion(null);
                setShowRecommendation(false);
              }}
            />
          )}
        </BottomPopup>
      )}
    </div>
  );
};

export default Routine;
