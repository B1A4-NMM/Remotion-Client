//Home.tsx
import { useGetTodayDiary } from '../api/queries/home/useGetHome';
import { useGetDiaryContent } from '../api/queries/home/useGetDiary';
import { motion, AnimatePresence, delay } from 'framer-motion';
import React, { useState, useEffect, useRef} from 'react';
import { Link, useLocation } from "react-router-dom";
import { create } from 'zustand';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import clsx from 'clsx'; 

import '../styles/homeCard.css';
import '../styles/moodCircle.css';

interface DiaryStore {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
}

export const useDiaryStore = create<DiaryStore>((set) => ({
  isExpanded: false,
  setIsExpanded: (value: boolean) => set({ isExpanded: value }),
}));

interface MonthlyCalendarProps {
  onDateSelect?: (date: Date) => void;
}

const MonthlyCalendar = ({ onDateSelect }: MonthlyCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false); // 월 전환 상태
  const containerRef = useRef<HTMLDivElement>(null);
  const today = dayjs();

  // 현재 월의 모든 날짜 가져오기
  const getMonthDates = (month: dayjs.Dayjs) => {
    const dates = [];
    const daysInMonth = month.daysInMonth();
    
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(month.date(i));
    }
    return dates;
  };

  const monthDates = getMonthDates(currentMonth);
  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // 드래그 제약사항 계산
  const calculateDragConstraints = () => {
    const itemWidth = 70; // 각 날짜 버튼 너비
    const containerWidth = typeof window !== 'undefined' ? window.innerWidth : 400;
    const visibleItems = Math.floor(containerWidth / itemWidth);
    const maxScroll = Math.max(0, (monthDates.length*(1.43) - visibleItems) * itemWidth);
    
    return {
      left: -maxScroll,
      right: 0
    };
  };

  // 드래그 종료 시 월 변경
  const handleDragEnd = (event: any, info: any) => {
    const threshold = 700; 
    
    if (info.offset.x > threshold) {
      // 오른쪽으로 드래그 - 이전 달
      setIsTransitioning(true);
      setCurrentMonth(prev => prev.subtract(1, 'month'));
      
      // 짧은 지연 후 전환 상태 해제
      setTimeout(() => setIsTransitioning(false), 300);
    } else if (info.offset.x < -threshold) {
      // 왼쪽으로 드래그 - 다음 달
      setIsTransitioning(true);
      setCurrentMonth(prev => prev.add(1, 'month'));
      
      setTimeout(() => setIsTransitioning(false), 300);
    }
    // setDragX(0) 제거!
  };

  // 날짜 클릭 핸들러
  const handleDateClick = (date: dayjs.Dayjs) => {
    console.log('Selected date:', date.format('YYYY-MM-DD'));
    onDateSelect?.(date.toDate());
    setIsCalendarOpen(false);
  };

  // 큰 캘린더용 전체 달력 생성
  const generateFullCalendar = (month: dayjs.Dayjs) => {
    const firstDay = month.startOf('month');
    const lastDay = month.endOf('month');
    const startDate = firstDay.startOf('week').add(1, 'day'); // 월요일 시작
    const endDate = lastDay.endOf('week').add(1, 'day');
    
    const weeks = [];
    let currentWeek = [];
    let current = startDate;
    
    while (current.isBefore(endDate) || current.isSame(endDate, 'day')) {
      currentWeek.push(current);
      
      if (currentWeek.length === 7) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
      
      current = current.add(1, 'day');
    }
    
    return weeks;
  };

  return (
    <>
      <div className="absolute top-3 left-0 right-0 z-10">
        {/* 상단 네비게이션 */}
        <div className="flex justify-between items-center mb-4 px-4">
          {/* 오늘 날짜 */}
          <div className="text-white font-medium">
            <div className="text-lg">{today.format('MM월 DD일')}</div>
            <div className="text-sm text-gray-400">{today.format('YYYY년')}</div>
          </div>
          
          {/* 현재 월 표시 */}
          <span className="text-white font-medium">
            {currentMonth.format('YYYY년 MM월')}
          </span>
          
          {/* 캘린더 버튼 */}
          <button 
            onClick={() => setIsCalendarOpen(true)}
            className="text-gray-400 hover:text-white p-2"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
              <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
              <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
              <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        {/* 스크롤 가능한 날짜 목록 */}
         <div className="w-full overflow-hidden">
          <motion.div
            key={currentMonth.format('YYYY-MM')} // 월이 바뀔 때마다 새로운 컴포넌트
            ref={containerRef}
            drag="x"
            dragConstraints={calculateDragConstraints()}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            className="flex gap-2 px-4 pb-2 cursor-grab active:cursor-grabbing"
            style={{ 
              width: 'max-content',
              minWidth: '200%'
            }}
            // 월 전환 시에만 애니메이션 적용
            initial={isTransitioning ? { opacity: 0, x: 0 } : false}
            animate={isTransitioning ? { opacity: 1, x: 0 } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {monthDates.map((date, index) => {
              const isToday = date.isSame(today, 'day');
              const dayNumber = date.date();
              const dayOfWeek = date.day();
              
              return (
                <motion.button
                  key={`${currentMonth.format('YYYY-MM')}-${index}`}
                  onClick={() => handleDateClick(date)}
                  className="flex flex-col items-center flex-shrink-0 p-2"
                  style={{ minWidth: '60px' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-gray-400 text-xs mb-1">
                    {dayLabels[dayOfWeek === 0 ? 6 : dayOfWeek - 1]}
                  </span>
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center text-white font-medium transition-colors text-sm
                    ${isToday 
                      ? 'bg-blue-600 shadow-lg' 
                      : 'bg-transparent hover:bg-gray-700'
                    }
                  `}>
                    {dayNumber}
                  </div>
                  <div className={`
                    w-1.5 h-1.5 rounded-full mt-1
                    ${index % 3 === 0 ? 'bg-green-400' : 'transparent'}
                  `} />
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* 전체 캘린더 모달 */}
      <AnimatePresence>
        {isCalendarOpen && (
          <motion.div
            className="inset-0 z-50 bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCalendarOpen(false)}
          >
            <motion.div
              className="absolute top-0 left-0 right-0 bg-gray-900 rounded-b-3xl shadow-2xl"
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 캘린더 헤더 */}
              <div className="flex justify-between items-center p-6 border-b border-gray-700">
                <button
                  onClick={() => setCurrentMonth(prev => prev.subtract(1, 'month'))}
                  className="text-gray-400 hover:text-white p-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                <h2 className="text-white text-xl font-bold">
                  {currentMonth.format('YYYY년 MM월')}
                </h2>
                
                <button
                  onClick={() => setCurrentMonth(prev => prev.add(1, 'month'))}
                  className="text-gray-400 hover:text-white p-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* 요일 헤더 */}
              <div className="grid grid-cols-7 gap-1 p-4 pb-2">
                {dayLabels.map((day, index) => (
                  <div key={index} className="text-center text-gray-400 text-sm font-medium py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* 캘린더 그리드 */}
              <div className="p-4 pt-0 pb-8 z-40">
                {generateFullCalendar(currentMonth).map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-cols-7 gap-1 mb-2">
                    {week.map((date, dayIndex) => {
                      const isCurrentMonth = date.isSame(currentMonth, 'month');
                      const isToday = date.isSame(today, 'day');
                      
                      return (
                        <motion.button
                          key={`${weekIndex}-${dayIndex}`}
                          onClick={() => handleDateClick(date)}
                          className={`
                            h-12 rounded-lg flex items-center justify-center text-sm font-medium transition-colors
                            ${isCurrentMonth ? 'text-white' : 'text-gray-600'}
                            ${isToday ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-gray-700'}
                          `}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {date.date()}
                        </motion.button>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* 닫기 버튼 */}
              <div className="flex justify-center pb-6">
                <button
                  onClick={() => setIsCalendarOpen(false)}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-colors"
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

interface Emotion {
  color: string;
  intensity: number;
}

const baseColors = {
  green: '#4ecdc4',
  red: '#ff6b6b',
  yellow: '#ffe66d',
  blue: '#45b7d1',
  gray: '#c4c4c4',
  gray1: '#c4c4c4',
  gray2: '#424242'
} as const;

// 감정을 색상으로 매핑하는 함수
const mapEmotionToColor = (emotion: string): string => {
  const strongHappiness = new Set(["행복", "기쁨", "신남", "즐거움", "설렘", "유대", "신뢰", "존경"]);
  const weakHappiness = new Set(["친밀", "자신감", "평온", "안정", "편안", "감사", "무난", "차분"]);
  const strongUnhappiness = new Set(["시기", "서운", "불안", "실망", "속상", "상처", "긴장", "화남", "짜증", "무기력", "지침", "억울", "초조", "부담", "어색", "불편", "불쾌", "소외", "지루"]); // 누락된 감정 추가
  const weakUnhappiness = new Set(["외로움", "우울", "공허", "기대"]); 
  
  if (strongHappiness.has(emotion)) return "yellow";
  if (weakHappiness.has(emotion)) return "green";  
  if (strongUnhappiness.has(emotion)) return "red";
  if (weakUnhappiness.has(emotion)) return "blue";
  return "gray"; // 알 수 없는 감정
};

type ColorKey = keyof typeof baseColors;

type ChangesProps = {
  hasTodayDiary?: boolean;
  onAlreadyWrote: () => void;
  children: React.ReactNode;
};

interface DiaryCardsProps {
  hasTodayDiary: boolean;
  todayDiary: any | null;
  diaryContent: any | null;
  isContentLoading: boolean;
  isContentError: boolean;
}

/* ─ 1. 샘플 일기 (작성 유도) ─ */
const sampleDiary = {
  id: 'sample',
};


{/* ==========무드 서클 ============== */}

const Changes = ({ hasTodayDiary, onAlreadyWrote, children }: ChangesProps) =>
  hasTodayDiary ? (
    <div onClick={onAlreadyWrote}>{children}</div>
  ) : (
    <Link to="/diary">{children}</Link>
);

const MoodCircle = ({
  hasTodayDiary, 
  todayDiary, 
  diaryContent,  }: DiaryCardsProps) => {
  /* ─ 1. 토스트 콜백 ─ */
  const handleAlreadyWrote = () => {
    toast.success('오늘은 이미 일기를 작성했습니다', {
      description: '하루에 하나의 일기만 작성할 수 있습니다.',
      duration: 3000,
    });
  };
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const { isExpanded, setIsExpanded } = useDiaryStore();

  /* ─ 2. 표시할 일기 결정 ─ */
  const displayDiary = hasTodayDiary ? todayDiary : sampleDiary;


// 일기 내용에서 감정 데이터를 처리하는 함수
const processDiaryContentEmotions = (content: any): Emotion[] => {
  if (!content || !hasTodayDiary) {
    return [{ color: 'gray1' as ColorKey, intensity: 1 }];
  }

  // 모든 감정을 하나의 배열로 수집
  const allEmotions: { type: string; intensity: number }[] = [];

  // selfEmotion 추가
  if (content.selfEmotion && Array.isArray(content.selfEmotion)) {
    content.selfEmotion.forEach((emotion: any) => {
      allEmotions.push({
        type: emotion.emotionType,
        intensity: emotion.intensity || 5
      });
    });
  }

  // stateEmotion 추가
  if (content.stateEmotion && Array.isArray(content.stateEmotion)) {
    content.stateEmotion.forEach((emotion: any) => {
      allEmotions.push({
        type: emotion.emotionType,
        intensity: emotion.intensity || 5
      });
    });
  }

  // people의 감정도 포함 (가중치 낮게)
  if (content.people && Array.isArray(content.people)) {
    content.people.forEach((person: any) => {
      if (person.feel && Array.isArray(person.feel)) {
        person.feel.forEach((emotion: any) => {
          allEmotions.push({
            type: emotion.emotionType,
            intensity: (emotion.intensity || 5) * 0.5 // 다른 사람 감정은 가중치 낮게
          });
        });
      }
    });
  }

  if (allEmotions.length === 0) {
    return [{ color: 'gray1' as ColorKey, intensity: 1 }];
  }

  // 색상별로 그룹화하고 강도 계산
  const colorMap = new Map<ColorKey, number>();

  allEmotions.forEach(({ type, intensity }) => {
    const color = mapEmotionToColor(type);
    colorMap.set(color, (colorMap.get(color) || 0) + intensity);
  });

  /* ① 다른 색이 있으면 gray* 제거  */
  if (colorMap.size > 1) {
    colorMap.delete('gray1');
    colorMap.delete('gray2');
  }

  // 정규화 및 결과 생성
  const maxIntensity = Math.max(...colorMap.values());

  return [...colorMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([color, total]) => ({
      color,
      intensity: +(total / maxIntensity).toFixed(3) // 0~1
  }));
};

// diaryContent가 변경될 때마다 감정 분석 실행
useEffect(() => {
  const processedEmotions = processDiaryContentEmotions(diaryContent);
  setEmotions(processedEmotions);
}, [diaryContent, hasTodayDiary]);

// emotions 상태를 사용하여 그라데이션 생성
const generateGradient = (): string => {
  // 1. emotions가 없거나, 모두 gray만 있을 때
  if (
    emotions.length === 0 ||
    emotions.every(e => e.color === 'gray1' || e.color === 'gray2')
  ) {
    return `radial-gradient(ellipse at center, ${baseColors.gray1}, ${baseColors.gray2})`;
  }    
  
  // 2. 감정이 1개만 있을 때
  if (emotions.length === 1) {
    return baseColors[emotions[0].color];
  } 
  
  // 3. 여러 감정이 있을 때
  const intensities = emotions.map(e => e.intensity);
  const maxIntensity = Math.max(...intensities);
  const normalizedIntensities = intensities.map(i => i / maxIntensity);
  
  const totalWeight = normalizedIntensities.reduce((sum, weight) => sum + weight, 0);
  let cumulative = 0;
  
  const colors = emotions.map(({ color, intensity }, idx) => {
    cumulative += intensity;
    const pos = (cumulative / totalWeight) * 100;
    return `${baseColors[color]} ${pos.toFixed(1)}%`;
  });
  
  return `radial-gradient(ellipse at center, ${colors.join(', ')})`;
};

  return (
    <AnimatePresence>
    {!isExpanded && (
      <motion.div
      className="z-30 flex items-center justify-center pt-20"
      variants={{
        hidden: { 
          opacity: 0, 
          scale: 0.8,
          transition: { 
            duration: 0.06,    // 빠르게 사라짐
            ease: "easeIn" 
          }
        },
        visible: { 
          opacity: 1, 
          scale: 1,
          transition: { 
            duration: 1.2,    // 천천히 나타남
            delay: 0.5,
            ease: "easeOut" 
          }
        }
      }}
      initial="hidden"
      animate="visible" 
      exit="hidden"
    >
      <Changes hasTodayDiary={hasTodayDiary} onAlreadyWrote={handleAlreadyWrote}>
        <motion.div
          className="flex justify-center mb-6 mt-8"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div
            className="mood-circle w-36 h-36 rounded-full"
            style={{
              background: (() => {
                const gradient = generateGradient();
                return gradient;
              })(),
              boxShadow: `0 0 40px ${baseColors[emotions[0]?.color ?? 'gray1']}40`,
            }}
          />
        </motion.div>
      </Changes>
    </motion.div>
    )}
    </AnimatePresence>  
  );
};

{/* ==========다이어리 카드============== */}


const DiaryCards = ({ 
  hasTodayDiary, 
  todayDiary, 
  diaryContent, 
  isContentLoading, 
  isContentError 
}: DiaryCardsProps) => {
  const makePreview = (raw?: string, limit = 150) =>
    !raw ? '' : raw.replace(/\s+/g, ' ').slice(0, limit) + (raw.length > limit ? '…' : '');
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 카드 확장 상태 관리
  const { isExpanded, setIsExpanded } = useDiaryStore();
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  /* ─ 2. 표시할 일기 결정 ─ */
  const displayDiary = hasTodayDiary ? todayDiary : sampleDiary;

  // 감정 매핑 함수
  const mapEmotionToColor = (emotion: string): keyof typeof baseColors => {
    const strongHappiness = new Set(["행복", "기쁨", "신남", "즐거움", "설렘", "유대", "신뢰", "존경", "뿌듯함"]);
    const weakHappiness = new Set(["친밀", "자신감", "평온", "안정", "편안", "감사", "무난", "차분", "애정"]);
    const strongUnhappiness = new Set(["시기", "서운", "불안", "실망", "속상", "상처", "긴장", "화남", "짜증", "무기력", "지침", "억울", "초조", "부담", "어색", "불편", "불쾌", "소외", "지루"]);
    const weakUnhappiness = new Set(["외로움", "우울", "공허", "기대"]);

    if (strongHappiness.has(emotion)) return "yellow";
    if (weakHappiness.has(emotion)) return "green";  
    if (strongUnhappiness.has(emotion)) return "red";
    if (weakUnhappiness.has(emotion)) return "blue";
    return "gray";
  };

  const baseColors = {
    yellow: '#ffe66d',
    green: '#4ecdc4',    
    red: '#ff6b6b',      
    blue: '#45b7d1',     
    gray: '#c4c4c4'     
  } as const;

  // 개별 인물의 대표 감정 색상 계산
  const getPersonEmotionColor = (person: any) => {
    if (!person.feel || person.feel.length === 0) return "gray";
    
    const dominantEmotion = person.feel.reduce((prev: any, current: any) => 
      (current.intensity > prev.intensity) ? current : prev
    );
    
    return mapEmotionToColor(dominantEmotion.emotionType);
  };

  // 인물과 감정 정보 추출 함수
  const getPeopleWithEmotions = () => {
    if (!hasTodayDiary || !diaryContent?.people) return [];
    
    return diaryContent.people.map((person: any) => ({
      name: person.name,
      emotionColor: getPersonEmotionColor(person),
      dominantEmotion: person.feel && person.feel.length > 0 
        ? person.feel.reduce((prev: any, current: any) => 
            (current.intensity > prev.intensity) ? current : prev
          ).emotionType
        : null,
      emotionIntensity: person.feel && person.feel.length > 0
        ? person.feel.reduce((prev: any, current: any) => 
            (current.intensity > prev.intensity) ? current : prev
          ).intensity
        : 0
    }));
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
        {!isExpanded && (
           <motion.div
           className="z-30 flex items-center justify-center p-4"
           variants={{
             hidden: { 
               opacity: 0, 
               scale: 0.8,
               transition: { 
                 duration: 0.1,    // 빠르게 사라짐
                 ease: "easeIn" 
               }
             },
             visible: { 
               opacity: 1, 
               scale: 1,
               transition: { 
                 duration: 1.2,    // 천천히 나타남
                 delay: 0.5,
                 ease: "easeOut" 
               }
             }
           }}
           initial="hidden"
           animate="visible" 
           exit="hidden"
         >
        <motion.div 
          ref={containerRef}
          className="card-container overflow-hidden cursor-pointer"
          style={{ position: 'relative' }}
          onClick={handleCardClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* 배경 이미지 컨테이너 */}
          <div 
            className="absolute inset-0 w-full h-full rounded-3xl"
            style={{
              backgroundImage: diaryContent?.photo_path ? `url(${diaryContent.photo_path})` : 'linear-gradient(135deg,rgb(106, 120, 180) 0%, #764ba2 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* 그라데이션 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80 rounded-3xl" />
          </div>

          {/* 카드 컨텐츠 */}
          <div className='relative z-10 backdrop-blur-sm rounded-3xl p-4 shadow-white border border-white/20'>
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
                          color: 'white'
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
                  <p className={clsx(
                    'text-white/90 text-base leading-relaxed',
                    (diaryContent?.content || !hasTodayDiary) ? 'line-clamp-3' : 'hidden'
                  )}>
                    {hasTodayDiary 
                      ? makePreview(diaryContent?.content) 
                      : "일기를 작성해주세요. 여기에는 일기 내용이 3줄까지 미리보기로 나타납니다."
                    }
                  </p>
                )}
                
                {/* 클릭 유도 텍스트 */}
                {hasTodayDiary && diaryContent && (
                  <div className="text-white/50 text-xs mt-2 italic">
                    탭하여 전체 내용 보기
                  </div>
                )}
              </div>

              {/* 에러 처리 */}
              {isContentError && hasTodayDiary && (
                <div className="mt-4 p-3 bg-red-500/20 backdrop-blur-sm rounded-xl border border-red-500/30">
                  <div className="flex items-center gap-2 text-red-300 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
            exit={{ opacity: 0}}
            onClick={handleOverlayClick}
          >
          <motion.div
           className="z-40 flex items-center justify-center p-4"
           variants={{
             hidden: { 
               opacity: 0, 
               scale: 0.8,
               transition: { 
                 duration: 0.3,    // 빠르게 사라짐
                 ease: "easeIn" 
               }
             },
             visible: { 
               opacity: 1, 
               scale: 1,
               transition: { 
                 duration: 1,    // 천천히 나타남
                 delay: 0.5,
                 ease: "easeOut" 
               }
             }
            }}
            initial="hidden"
            animate="visible" 
            exit="hidden"
            >
              {/* 확장된 카드 내용 */}

              <div 
                className="relative rounded-3xl overflow-hidden"
                style={{
                  backgroundSize: 'cover',
                  backgroundColor: "#c5f1e9"
                }}
              >
                {/* 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />
                
                {/* 닫기 버튼 */}
                <button
                  className="absolute top-4 right-4 z-20 text-white/80 hover:text-white bg-black/30 rounded-full p-2 backdrop-blur-sm"
                  onClick={() => setIsExpanded(false)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* 확장된 컨텐츠 */}
                <div className="relative z-10 p-4">

                  {/* 날짜 정보 */}
                  {todayDiary && (
                    <div className="text-white/70 text-sm mb-6">
                      {dayjs(todayDiary.createdAt ?? todayDiary.date).format('YYYY년 MM월 DD일 HH:mm')}
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
                                color: 'white'
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
                        onError={(e) => {
                          console.error("이미지 로드 실패:", diaryContent.photo_path);
                          // 이미지 로드 실패 시 숨기기
                          e.currentTarget.style.display = 'none';
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
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
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
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                            damping: 30 
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />

                        {/* 이미지 정보 */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/70 text-sm text-center">
                          <p>{diaryContent?.title}</p>
                          <p className="text-xs opacity-60">
                            {todayDiary && dayjs(todayDiary.createdAt ?? todayDiary.date).format('YYYY년 MM월 DD일')}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div 
                    className="relative rounded-3xl overflow-hidden"
                    style={{
                      backgroundImage: diaryContent?.photo_path ? `url(${diaryContent.photo_path})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  ></div>

                  <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6">
                    <h3 className="text-white/80 text-lg font-semibold mb-4">일기 내용</h3>
                    <div className="text-white/90 text-base leading-relaxed whitespace-pre-wrap">
                      {diaryContent?.content || "내용을 불러올 수 없습니다."}
                    </div>
                  </div>

                  {/* Todo 리스트 (있는 경우) */}
                  {diaryContent?.todos && diaryContent.todos.length > 0 && (
                    <div className="mt-6 bg-black/20 backdrop-blur-sm rounded-2xl p-6">
                      <h3 className="text-white/80 text-lg font-semibold mb-4">할 일</h3>
                      <ul className="space-y-2">
                        {diaryContent.todos.map((todo: any, index: number) => (
                          <li key={index} className="text-white/90 flex items-center gap-2">
                            <span className="w-2 h-2 bg-white/60 rounded-full"></span>
                            {todo.Todocontent}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};


const Home = () => {
  const token = localStorage.getItem('accessToken') || '';
  
  const { 
    data: todayData, 
    isLoading, 
    isError, 
    error,
    isSuccess
  } = useGetTodayDiary(token);

  /* ─ 1. 오늘 일기 필터링 ─ */
  const isToday = (dateStr: string) => dayjs(dateStr).isSame(dayjs(), 'day');
  const todayDiaries = todayData?.todayDiaries?.filter(diary => 
    isToday(diary.createdAt ?? diary.date)
  ) || [];
  const hasTodayDiary = todayDiaries.length > 0;
  const todayDiary = hasTodayDiary ? todayDiaries[0] : null;

  /* ─ 2. 오늘 일기 상세 내용 가져오기 ─ */
  const {
    data: diaryContent,
    isLoading: isContentLoading,
    isError: isContentError
  } = useGetDiaryContent(
    token,
    todayDiary?.diaryId?.toString() || 'sample'
  );

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="base flex items-center justify-center min-h-screen">
        <div className="text-white">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className='base'>
      {/* 상단 주간 캘린더 */}
      <MonthlyCalendar />

      {/* MoodCircle - diaryContent도 전달 */}
      <MoodCircle 
        hasTodayDiary={hasTodayDiary}
        todayDiary={todayDiary}
        diaryContent={diaryContent}
      />
      {/* 하단 일기 카드들 */}
      <DiaryCards 
        hasTodayDiary={hasTodayDiary}
        todayDiary={todayDiary}
        diaryContent={diaryContent}
        isContentLoading={isContentLoading}
        isContentError={isContentError}
      />
    </div>
  );
};

export default Home;
