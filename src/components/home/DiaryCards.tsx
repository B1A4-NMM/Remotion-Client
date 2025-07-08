import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, delay } from "framer-motion";
import dayjs from "dayjs";
import clsx from "clsx";
import { useDiaryStore } from "./Calender";
import { Button } from "../ui/button";

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
  const { isExpanded, setIsExpanded } = useDiaryStore();
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  /* ─ 2. 표시할 일기 결정 ─ */
  const displayDiary = hasTodayDiary ? todayDiary.todayDiaries[0] : sampleDiary;

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

  const handleDeleteDiary = () => {
    const isConfirmed = window.confirm(
      '정말 삭제하시겠습니까?\n삭제 후엔 복구 할 수 없습니다.'
    );
    
    if (isConfirmed) {
      // 실제 삭제 로직 구현
      console.log('일기 삭제 실행');
      // API 호출 또는 삭제 함수 호출
      // deleteDiary(diaryId);
    }
  };
  

  return (
    <>
      {/* 기본 카드 */}
      <AnimatePresence>
        {!isExpanded && (
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
              className="card-container overflow-hidden cursor-pointer"
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
                    : "none", // 그라데이션 제거
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
              <div className="relative z-10 backdrop-blur-sm rounded-3xl p-4 shadow-white border border-white/20">
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
                              color: "white",
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
                    {isContentLoading && hasTodayDiary ? (
                      <div className="flex items-center gap-2 text-white/70 text-sm">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white/70"></div>
                        일기 내용을 불러오는 중...
                      </div>
                    ) : (
                      <p
                        className={clsx(
                          "text-white/90 text-base leading-relaxed",
                          diaryContent?.content || !hasTodayDiary ? "line-clamp-3" : "hidden"
                        )}
                      >
                        {hasTodayDiary
                          ? makePreview(todayDiary?.todayDiaries?.[0]?.content)  // content 필드 사용
                          : "일기를 작성해주세요. 여기에는 일기 내용이 3줄까지 미리보기로 나타납니다."}
                      </p>
                    )}

                    {/* 클릭 유도 텍스트 */}
                    {hasTodayDiary && diaryContent && (
                      <div className="text-white/50 text-xs mt-2 italic">탭하여 전체 내용 보기</div>
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
                  className="absolute top-4 right-4 z-20 text-white/80 hover:text-white bg-black/30 rounded-full p-2 backdrop-blur-sm"
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
                <div className="relative z-10 p-4">
                  {/* 날짜 정보 */}
                  {todayDiary?.todayDiaries?.[0] && (
                    <div className="text-white/70 text-sm mb-6">
                      {dayjs(todayDiary.todayDiaries[0].writtenDate).format(
                        "YYYY년 MM월 DD일"
                      )}
                    </div>
                  )}

                  {/* 인물 태그 */}
                  {getPeopleWithEmotions().length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-white/80 text-lg font-semibold mb-4">등장인물</h3>
                      <div className="flex flex-wrap gap-3">
                        {getPeopleWithEmotions().map((person, index) => (
                          <div key={index} className="relative group">
                            <span
                              className="px-4 py-2 rounded-full text-sm font-medium shadow-lg border-2 block"
                              style={{
                                backgroundColor: `${baseColors[person.emotionColor]}80`,
                                borderColor: baseColors[person.emotionColor],
                                color: "white",
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
                      <p className="text-white/50 text-xs mt-2 text-center">
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
                          className="absolute top-4 right-4 z-[70] text-white/80 hover:text-white bg-black/50 rounded-full p-3 backdrop-blur-sm"
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
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/70 text-sm text-center">
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
                    <h3 className="text-white/80 text-lg font-semibold mb-4">일기 내용</h3>
                    <div className="text-white/90 text-base leading-relaxed whitespace-pre-wrap">
                      {displayDiary?.content || "내용을 불러올 수 없습니다."}
                    </div>
                  </div>

                  {/* Todo 리스트 (있는 경우) */}
                  {displayDiary?.todos && displayDiary.todos.length > 0 && (
                    <div className="mt-6 bg-black/20 backdrop-blur-sm rounded-2xl p-6">
                      <h3 className="text-white/80 text-lg font-semibold mb-4">할 일</h3>
                      <ul className="space-y-2">
                        {displayDiary.todos.map((todo: any, index: number) => (
                          <li key={index} className="text-white/90 flex items-center gap-2">
                            <span className="w-2 h-2 bg-white/60 rounded-full"></span>
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
                    style={{
                      backgroundColor:"#e64545",
                      color:"#110303"
                    }}
                  >
                    일기 삭제하기
                  </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DiaryCards;