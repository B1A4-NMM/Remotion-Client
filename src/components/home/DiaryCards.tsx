import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, delay } from "framer-motion";
import dayjs from "dayjs";
import clsx from "clsx";
import { useDiaryStore } from "./Calender";
import { Button } from "../ui/button";
import { useDeleteDiary } from "../../api/queries/home/useDeleteDiary";

interface DiaryCardsProps {
    hasTodayDiary: boolean;
    todayDiary: any | null;
    diaryContent: any | null;
    isContentLoading: boolean;
    isContentError: boolean;
}

const sampleDiary = {
  id: "sample",
  title: "오늘 하루는 어땠나요? 일기를 작성해보세요."
};


const DiaryCards = ({
  hasTodayDiary,
  todayDiary,
  diaryContent,
  isContentLoading,
  isContentError,
}: DiaryCardsProps) => {
  const makePreview = (raw?: string, limit = 150) =>
    !raw ? "" : raw.replace(/\s+/g, " ").slice(0, limit) + (raw.length > limit ? "…" : "");

  const containerRef = useRef<HTMLDivElement>(null);

  // 카드 확장 상태 관리
  const token = localStorage.getItem("accessToken") || "";
  const { isExpanded, setIsExpanded } = useDiaryStore();
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  //삭제 mutaion 훅
  const deleteDiaryMutation = useDeleteDiary();

  /* 표시할 일기 결정 ─ */
  const displayDiary = hasTodayDiary ? todayDiary.todayDiaries[0] : sampleDiary;

  //일기 삭제 핸들러
  const handleDeleteDiary = () => {
    setShowDeleteConfirm(true);
  };

  //삭제 확인
  const handleConfirmDelete = async () => {
    if (!hasTodayDiary || !displayDiary?.diaryId) {
      toast.error("삭제할 일기를 찾을 수 없습니다.");
      return;
    }

    try {
      await deleteDiaryMutation.mutateAsync({
        token,
        diaryId: displayDiary.diaryId.toString(),
      });
      
      // 삭제 성공 시 모달 닫기
      setShowDeleteConfirm(false);
      setIsExpanded(false);
      
    } catch (error) {
      console.error("일기 삭제 중 오류 발생:", error);
    }
  };

  // 삭제 취소 핸들러
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  


  // 감정 매핑 함수
  const mapEmotionToColor = (emotion: string): keyof typeof baseColors => {
    const strongHappiness = new Set([
      "행복",
      "기쁨",
      "신남",
      "즐거움",
      "설렘",
      "유대",
      "신뢰",
      "존경",
      "뿌듯함",
    ]);
    const weakHappiness = new Set([
      "친밀",
      "자신감",
      "평온",
      "안정",
      "편안",
      "감사",
      "무난",
      "차분",
      "애정",
    ]);
    const strongUnhappiness = new Set([
      "시기",
      "서운",
      "불안",
      "실망",
      "속상",
      "상처",
      "긴장",
      "화남",
      "짜증",
      "무기력",
      "지침",
      "억울",
      "초조",
      "부담",
      "어색",
      "불편",
      "불쾌",
      "소외",
      "지루",
    ]);
    const weakUnhappiness = new Set(["외로움", "우울", "공허", "기대"]);

    if (strongHappiness.has(emotion)) return "yellow";
    if (weakHappiness.has(emotion)) return "green";
    if (strongUnhappiness.has(emotion)) return "red";
    if (weakUnhappiness.has(emotion)) return "blue";
    return "gray";
  };

  const baseColors = {
    yellow: "#ffe66d",
    green: "#4ecdc4",
    red: "#ff6b6b",
    blue: "#45b7d1",
    gray: "#c4c4c4",
  } as const;

  // 개별 인물의 대표 감정 색상 계산
  const getPersonEmotionColor = (emotionName: string) => {
    return mapEmotionToColor(emotionName);
  };

  // 인물과 감정 정보 추출 함수
  const getPeopleWithEmotions = () => {
    // todayDiary 구조로 변경
    if (!hasTodayDiary || !todayDiary?.todayDiaries?.[0]?.targets) return [];
    
    const firstDiary = todayDiary.todayDiaries[0];
    const targets = firstDiary.targets || [];
    const emotions = firstDiary.emotions || [];
    
    // targets 배열의 각 사람에게 기본 감정 색상 할당
    return targets.map((personName: string, index: number) => {
      // 해당 일기의 감정들 중 첫 번째를 기본으로 사용하거나 순환 할당
      const assignedEmotion = emotions[index % emotions.length] || "무난";
      const emotionColor = mapEmotionToColor(assignedEmotion);
      
      return {
        name: personName,
        emotionColor: emotionColor,
        dominantEmotion: assignedEmotion,
        emotionIntensity: 5, // 기본값
        name_similarity: 0
      };
    });
  };
  

  // 카드 클릭 핸들러
  const handleCardClick = () => {
    if (hasTodayDiary && diaryContent) {
      setIsExpanded(true);
    }
  };

  // 오버레이 클릭 시 닫기
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsExpanded(false);
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 부모 클릭 이벤트 방지
    setIsImageExpanded(true);
  };


  return (
    <>
      {/* 기본 카드 */}
      <AnimatePresence>
        {!isExpanded && hasTodayDiary && (
          <motion.div
            className="z-50 flex items-center justify-center p-4"
            variants={{
              hidden: {
                opacity: 0,
                scale: 0.8,
                transition: {
                  duration: 0.1, // 빠르게 사라짐
                  ease: "easeIn",
                },
              },
              visible: {
                opacity: 1,
                scale: 1,
                transition: {
                  duration: 1.2, // 천천히 나타남
                  delay: 0.5,
                  ease: "easeOut",
                },
              },
            }}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              ref={containerRef}
              className="card-container overflow-hidden cursor-pointer rounded-3xl shadow-xl"
              style={{ position: "relative" }}
              onClick={handleCardClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* 배경 이미지 컨테이너 */}
              <div
                className="absolute inset-0 w-full h-full rounded-3xl"
                style={{
                  backgroundImage: diaryContent?.photo_path 
                      ? `url(${diaryContent.photo_path})` 
                      : "none",
                    backgroundColor: diaryContent?.photo_path ? "transparent" : "#ffffff",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {/* 그라데이션 오버레이 - 배경 이미지가 있을 때만 표시 */}
                {diaryContent?.photo_path && (
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80 rounded-3xl" />
                )}
              </div>


              {/* 카드 컨텐츠 */}
              <div className="relative z-10 backdrop-blur-sm rounded-3xl p-4 shadow-black ">
                <div className="flex flex-col p-2">
                  

                  {/* 인물 태그 영역 */}
                  {getPeopleWithEmotions().length > 0 && (
                    <div className="mb-auto pt-6 pb-3">
                      <div className="flex flex-wrap gap-x-2 gap-y-5">
                        {getPeopleWithEmotions().map((person, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 rounded-full text-sm font-medium shadow-lg border-2"
                            style={{
                              backgroundColor: `${baseColors[person.emotionColor]}80`,
                              borderColor: baseColors[person.emotionColor],
                              color: "black",
                            }}
                          >
                            {person.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 컨텐츠 미리보기 */}
                  
                  <div className="mt-4">
                    {isContentLoading ? (
                      <div className="flex items-center gap-2 text-black/70 text-sm">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black/70"></div>
                        일기 내용을 불러오는 중...
                      </div>
                    ) : (
                      <div>
                        <p className="text-black/90 text-base leading-relaxed line-clamp-3">
                          {makePreview(todayDiary?.todayDiaries?.[0]?.content)}
                        </p>
                        <div className="text-black/50 text-xs mt-2 italic">
                          탭하여 전체 내용 보기
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 에러 처리 */}
                  {isContentError && hasTodayDiary && (
                    <div className="mt-4 p-3 bg-red-500/20 backdrop-blur-sm rounded-xl border border-red-500/30">
                      <div className="flex items-center gap-2 text-red-300 text-sm">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        일기 내용을 불러오는 중 오류가 발생했습니다.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 확장된 카드 모달 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="z-40 flex items-center justify-center "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleOverlayClick}
          >
            <motion.div
              className="z-50 flex items-center justify-center p-4"
              variants={{
                hidden: {
                  opacity: 0,
                  scale: 0.8,
                  transition: {
                    duration: 0.3, // 빠르게 사라짐
                    ease: "easeIn",
                  },
                },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: {
                    duration: 1, // 천천히 나타남
                    delay: 0.5,
                    ease: "easeOut",
                  },
                },
              }}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {/* 확장된 카드 내용 */}

              <div
                className="relative rounded-3xl overflow-hidden"
                style={{
                  backgroundSize: "cover",
                  backgroundColor: "#7e869a",
                }}
              >
                {/* 오버레이 */}
                <div className="absolute inset-0 " />

                {/* 닫기 버튼 */}
                <button
                  className="absolute top-4 right-4 z-20 text-black/80 hover:text-black bg-black/30 rounded-full p-2 backdrop-blur-sm"
                  onClick={() => setIsExpanded(false)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {/* 확장된 컨텐츠 */}
                <div className="relative z-10 p-4 mb-16">
                  {/* 날짜 정보 */}
                  {todayDiary?.todayDiaries?.[0] && (
                    <div className="text-black/70 text-sm mb-6">
                      {dayjs(todayDiary.todayDiaries[0].writtenDate).format(
                        "YYYY년 MM월 DD일"
                      )}
                    </div>
                  )}

                  {/* 인물 태그 */}
                  {getPeopleWithEmotions().length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-black/80 text-lg font-semibold mb-4">등장인물</h3>
                      <div className="flex flex-wrap gap-3">
                        {getPeopleWithEmotions().map((person, index) => (
                          <div key={index} className="relative group">
                            <span
                              className="px-4 py-2 rounded-full text-sm font-medium shadow-lg border-2 block"
                              style={{
                                backgroundColor: `${baseColors[person.emotionColor]}80`,
                                borderColor: baseColors[person.emotionColor],
                                color: "black",
                              }}
                            >
                              {person.name}
                              {person.dominantEmotion && (
                                <span className="ml-2 text-xs opacity-80">
                                  {person.dominantEmotion}
                                </span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 전체 일기 내용 */}

                  {/*사진*/}
                  {diaryContent?.photo_path && (
                    <div className="mb-6 ">
                      <motion.img
                        src={diaryContent.photo_path}
                        alt="일기 사진"
                        className="w-full h-64 object-cover rounded-xl cursor-pointer shadow-lg"
                        onClick={handleImageClick}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        onError={e => {
                          console.error("이미지 로드 실패:", diaryContent.photo_path);
                          // 이미지 로드 실패 시 숨기기
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <p className="text-black/50 text-xs mt-2 text-center">
                        이미지를 클릭하면 크게 볼 수 있습니다
                      </p>
                    </div>
                  )}

                  {/* 이미지 확대 모달 */}
                  <AnimatePresence>
                    {isImageExpanded && (
                      <motion.div
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.95)" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsImageExpanded(false)}
                      >
                        {/* 닫기 버튼 */}
                        <button
                          className="absolute top-4 right-4 z-[70] text-black/80 hover:text-black bg-black/50 rounded-full p-3 backdrop-blur-sm"
                          onClick={() => setIsImageExpanded(false)}
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>

                        {/* 확대된 이미지 */}
                        <motion.img
                          src={diaryContent?.photo_path}
                          alt="일기 사진 확대"
                          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                          onClick={e => e.stopPropagation()}
                        />

                        {/* 이미지 정보 */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-black/70 text-sm text-center">
                          <p>{displayDiary?.title}</p>
                          <p className="text-xs opacity-60">
                            {displayDiary &&
                              dayjs(displayDiary.createdAt ?? displayDiary.date).format(
                                "YYYY년 MM월 DD일"
                              )}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div
                    className="relative rounded-3xl overflow-hidden"
                    style={{
                      backgroundImage: displayDiary?.photo_path
                        ? `url(${displayDiary.photo_path})`
                        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  ></div>

                  <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6">
                    <h3 className="text-black/80 text-lg font-semibold mb-4">일기 내용</h3>
                    <div className="text-black/90 text-base leading-relaxed blackspace-pre-wrap">
                      {displayDiary?.content || "내용을 불러올 수 없습니다."}
                    </div>
                  </div>

                  {/* Todo 리스트 (있는 경우) */}
                  {displayDiary?.todos && displayDiary.todos.length > 0 && (
                    <div className="mt-6 bg-black/20 backdrop-blur-sm rounded-2xl p-6">
                      <h3 className="text-black/80 text-lg font-semibold mb-4">할 일</h3>
                      <ul className="space-y-2">
                        {displayDiary.todos.map((todo: any, index: number) => (
                          <li key={index} className="text-black/90 flex items-center gap-2">
                            <span className="w-2 h-2 bg-black/60 rounded-full"></span>
                            {todo.Todocontent}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div>
                    <Button 
                      className="mt-10"
                      onClick={handleDeleteDiary}
                      disabled={deleteDiaryMutation.isPending}
                      style={{
                        backgroundColor: "#e64545",
                        color: "#110303"
                      }}
                    >
                      {deleteDiaryMutation.isPending ? "삭제 중..." : "일기 삭제하기"}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 삭제 확인 모달 */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancelDelete}
          >
            <motion.div
              className="bg-black rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 아이콘 */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <svg 
                    className="w-8 h-8 text-red-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                    />
                  </svg>
                </div>
              </div>

              {/* 메시지 */}
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  정말 삭제하시겠습니까?
                </h3>
                <p className="text-gray-600 text-sm">
                  삭제 후엔 복구 할 수 없습니다.
                </p>
              </div>

              {/* 버튼들 */}
              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={handleCancelDelete}
                  disabled={deleteDiaryMutation.isPending}
                  style={{
                    borderColor: "#d1d5db",
                    color: "#6b7280"
                  }}
                >
                  취소
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleConfirmDelete}
                  disabled={deleteDiaryMutation.isPending}
                  style={{
                    backgroundColor: "#e64545",
                    color: "#ffffff"
                  }}
                >
                  {deleteDiaryMutation.isPending ? "삭제 중..." : "삭제하기"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
        <div className="z-40 flex justify-center ">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-5"> 하루뒤 시작하기</h1>
            <p className="text-xm text-stone-500"> 나만의 하루를 기록해 보세요.</p>
            <p className="text-xm text-stone-500"> 시작하려면 중앙의 '+' 버튼을 탭하세요.</p>
          </div>
        </div>
      </AnimatePresence>
    </>
  );
};

export default DiaryCards;