import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { usePostRoutineByType } from "@/api/queries/routine/usePostRoutineByType";
import { useGetRoutineByType } from "@/api/queries/routine/useGetRoutineByType";

import Title from "@/components/recommend/Title";
import FolderCardList from "@/components/routine/FolderCardList";
import BottomPopup from "@/components/routine/BottomPopup";
import RoutineModalContent from "@/components/routine/RoutineModalContent";
import PersonalizedRoutineList from "@/components/routine/PersonalizedRoutineList";
import RecommendedRoutinePopup from "@/components/routine/RecommendedRoutinePoPup";
import { getTriggerRoutine } from "@/api/services/routine";
import { RoutineItem } from "@/types/routine";
import { useDeleteRoutineById } from "@/api/queries/routine/useDeleteRoutineById";


const Routine = () => {

  const queryClient = useQueryClient();
  const postRoutineMutation = usePostRoutineByType();
  const deleteRoutineMutation =useDeleteRoutineById();

  const [triggeredRoutines, setTriggeredRoutines] = useState<RoutineItem[]>([]);
  const [selectedEmotion, setSelectedEmotion] = useState<RoutineItem["routineType"] | null>(null);
  
  const [selectedRoutines, setSelectedRoutines] =useState<RoutineItem[]>([]); 
  const [selectedFilter, setSelectedFilter] = useState<RoutineItem["routineType"] | null>(null);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [setAllRoutines] = useState<RoutineItem[]>([]);
  

  const [fetchedRoutines] = useState<RoutineItem[]>([]);
  

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

 

  const handleAddRoutine = async(content: string) => {
    if(!selectedEmotion) return;

    try{
      await postRoutineMutation.mutateAsync({
        type:selectedEmotion,
        content:content,
      });
      await refetchRoutine();
      } catch(err){
        console.error("루틴 추가 실패", err);
      }
  };

  const handleDeleteRoutine =async(id: number) => {
    try{
          await deleteRoutineMutation.mutateAsync(id);
          await refetchRoutine();
        }catch(err){
          console.error("루틴 삭제 실패",err);
    }
  }
  

  
//   // 강제 바텀시트 모달 하드코딩 
//   const handleFolderClick = (emotionTitle: string) => {
//   const emotionKey = emotionTitle as RoutineItem["routineType"];
//   console.log("🔥 폴더 클릭됨 (테스트)", emotionKey);

//   setSelectedEmotion(null);
//   setSelectedFilter(null);
//   setShowRecommendation(false);
  
//   // setSelectedEmotion(emotionKey);
//   // setShowRecommendation(true); // 무조건 추천루틴 모달 뜨게 고정

//    // 2단계: 약간의 딜레이 후 다시 설정
//    setTimeout(() => {
//     setSelectedEmotion(emotionKey);
//     setSelectedFilter(emotionKey);
//     setShowRecommendation(true); // 무조건 추천 뜨게
//   }, 0); // 또는 10~50ms
// };

  const {
    data: fetchedData,
    refetch: refetchRoutine,
  } = useGetRoutineByType(selectedEmotion || "depression", { enabled:false });
   

  //폴더 클릭시 루틴 get
  const handleFolderClick =async ( emotionTitle : string) => {
    const emotionKey = emotionTitle as RoutineItem["routineType"];
    console.log("폴더 클릭됨" , emotionKey);

    // 상태 초기화
    setSelectedEmotion(null);
    setSelectedFilter(null);
    setShowRecommendation(false);


    //상태 반영 시간 주기
    await new Promise(resolve => setTimeout(resolve,0));
  
    //상태 반영 => useEffect에서 fetch 처리 
    setSelectedEmotion(emotionKey); 
  }

  useEffect(() => {
    const fetchRoutine = async () => {
      if(!selectedEmotion) return;

      try {
        const result = await refetchRoutine();
        const newData =result.data;

        console.log("서버 응답:", newData);
  
        if (newData && newData.length > 0) {
          setSelectedRoutines(newData);
          setShowRecommendation(false);
        }else{
          setSelectedRoutines([]);
          setShowRecommendation(true);
        }
      }catch(err) {
        console.error("루틴 요청 실패", err);
        setSelectedRoutines([]);
        setShowRecommendation(true);
      }  
    };
    fetchRoutine();
  }, [selectedEmotion]);
  
  

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

{/* <BottomPopup
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
</BottomPopup> */}
  {selectedEmotion && (
  <BottomPopup
    isOpen={!!selectedEmotion}
    onClose={() => {
      setSelectedEmotion(null);
      setShowRecommendation(false);
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
    ) : fetchedData &&  fetchedData.length > 0 ? (
      <RoutineModalContent
        emotion={selectedEmotion}
        routines={selectedRoutines}
        onAdd={handleAddRoutine}
        onDelete={handleDeleteRoutine}
        onClose={() => {
          setSelectedEmotion(null);
          setShowRecommendation(false);
        }}
      />
    ) : null}
  </BottomPopup>
  )}

    </div>
  );
};

export default Routine;
