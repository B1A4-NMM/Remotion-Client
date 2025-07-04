//Home.tsx
import { useGetTodayDiary } from '../api/queries/home/useGetHome';
import { motion } from 'framer-motion';
import React, { useState, useEffect, useRef} from 'react';
import { Link, useLocation } from "react-router-dom";
import { toast } from 'sonner';
import { Card, CardDescription, CardTitle, CardHeader, CardContent} from '../components/ui/card';
import clsx from 'clsx'; 


import '../styles/moodCircle.css';

const WeeklyCalender = () => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [dragX, setDragX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const today = new Date();

  // 특정 주의 날짜들 계산
  const getWeekDates = (weekOffset: number = 0) => {
    const dates = [];
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + (weekOffset * 7));
    
    const currentDay = targetDate.getDay();
    const startOfWeek = new Date(targetDate);
    startOfWeek.setDate(targetDate.getDate() - currentDay + 1);

    for(let i = 0; i < 7; i++){
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates(currentWeekOffset);
  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const handleDrag = (event: any, info: any) => {
    setDragX(info.offset.x);
  };

  const calculateConstraints = () => {
    const itemWidth = 80;
    const visibleItems = 4;
    const maxScroll = (weekDates.length - visibleItems) * itemWidth;
    
    return {
      left: -maxScroll,
      right: 0
    };
  };

  const handleDateClick = (date: Date) => {
    console.log('Selected date:', date.toDateString());
  };

  return (
    <div className="py-6">
      {/* 주차 네비게이션 */}
      <div className="flex justify-between items-center mb-4 px-4">
        <button 
          onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
          className="text-gray-400 hover:text-white"
        >
          ←
        </button>
        <span className="text-white font-medium">
          {weekDates[0].getMonth() + 1}월 {weekDates[0].getDate()}일 - {weekDates[6].getDate()}일
        </span>
        <button 
          onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
          className="text-gray-400 hover:text-white"
        >
          →
        </button>
      </div>

      {/* 스크롤 가능한 날짜 목록 */}
      <div 
        ref={containerRef}
        className="overflow-hidden"
        style={{ width: '320px', margin: '0 auto' }}
      >
        <motion.div
          drag="x"
          dragConstraints={calculateConstraints()}
          dragElastic={0.1}
          onDrag={handleDrag}
          className="flex gap-4 cursor-grab active:cursor-grabbing"
          style={{ x: dragX }}
        >
          {weekDates.map((date, index) => {
            const isToday = date.toDateString() === today.toDateString();
            const dayNumber = date.getDate();
            
            return (
              <motion.button
                key={`${currentWeekOffset}-${index}`}
                onClick={() => handleDateClick(date)}
                className="flex flex-col items-center min-w-[72px] p-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-gray-400 text-sm mb-2">
                  {dayLabels[index]}
                </span>
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center text-white font-medium transition-colors
                  ${isToday 
                    ? 'bg-gray-600' 
                    : 'bg-transparent hover:bg-gray-700'
                  }
                `}>
                  {dayNumber}
                </div>
                {/* 일기 작성 여부 표시 점 */}
                <div className={`
                  w-2 h-2 rounded-full mt-2
                  ${index % 2 === 0 ? 'bg-gray-500' : 'transparent'}
                `} />
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </div>
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
  gray1: '#c4c4c4',
  gray2: '#424242'
} as const;

type ColorKey = keyof typeof baseColors;


type ChangesProps = {
  hasTodayDiary?: boolean;
  onAlreadyWrote: () => void;
  children: React.ReactNode;
};


const Changes = ({ hasTodayDiary, onAlreadyWrote, children }: ChangesProps) =>
  hasTodayDiary ? (
    <div onClick={onAlreadyWrote}>
      {children}
    </div>
  ) : (
    <Link to="/diary" >{children}</Link>    
  );

const MoodCircle = ({ diaries }: {diaries?: any[] }) => {
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const hasTodayDiary = diaries && diaries.length > 0;
  
  /* 이미 작성했을 때 토스트만 표시 */
  const handleAlreadyWrote = () => {
    toast.error('오늘은 이미 일기를 작성했습니다', {
      description: '하루에 하나의 일기만 작성할 수 있습니다.',
      duration: 3000,
    });
  };


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

  // diaries에서 감정 데이터를 처리하는 함수
  const processDiariesEmotions = (diaries: any[]): Emotion[] => {
    if (!diaries || diaries.length === 0) {
      return [{ color: 'gray' as ColorKey, intensity: 1 }];
    }

    // 모든 일기의 감정을 하나의 배열로 합치기
    const allEmotions: string[] = [];
    diaries.forEach(diary => {
      if (diary.emotions && Array.isArray(diary.emotions)) {
        allEmotions.push(...diary.emotions);
      }
    });

    if (allEmotions.length === 0) {
      return [{ color: 'gray' as ColorKey, intensity: 1 }];
    }

    // 감정별 빈도 계산
    const emotionCount = new Map<string, number>();
    allEmotions.forEach(emotion => {
      emotionCount.set(emotion, (emotionCount.get(emotion) || 0) + 1);
    });

    // 색상별로 그룹화하고 강도 계산
    const colorMap = new Map<string, number>();
    emotionCount.forEach((count, emotion) => {
      const color = mapEmotionToColor(emotion);
      // 각 감정의 기본 강도를 5로 설정하고, 빈도만큼 곱하기
      const intensity = count * 5;
      colorMap.set(color, (colorMap.get(color) || 0) + intensity);
    });

    return Array.from(colorMap.entries()).map(([color, totalIntensity]) => ({
      color: color as ColorKey,
      intensity: Math.min(totalIntensity / 10, 1) // 0-1 범위로 정규화
    }));
  };
  

  useEffect(() => {
    const processedEmotions = processDiariesEmotions(diaries || []);
    setEmotions(processedEmotions);
  }, [diaries]);

  // emotions 상태를 사용하여 그라데이션 생성
  const generateGradient = (): string => {
    // 1. emotions가 없거나, 모두 gray만 있을 때
    if (
      emotions.length === 0 ||
      emotions.every(e => e.color === 'gray')
    ) {
      return `radial-gradient(ellipse at center, ${baseColors.gray1}, ${baseColors.gray2})`;
    }    
    
    // 2. 감정이 1개만 있을 때 (회색 아닌 경우)
    if (emotions.length === 1) return baseColors[emotions[0].color];
    
    // 3. 여러 감정이 있을 때
    const intensities = emotions.map(e => e.intensity);
    const maxIntensity = Math.max(...intensities);
    const normalizedIntensities = intensities.map(i => i / maxIntensity);
    
    const totalWeight = normalizedIntensities.reduce((sum, weight) => sum + weight, 0);
    let cumulative = 0;
    
    const colors = emotions.map((emotion, index) => {
      cumulative += normalizedIntensities[index];
      const position = (cumulative / totalWeight) * 100;
      return `${baseColors[emotion.color]} ${position.toFixed(1)}%`;
    });
    
    return `radial-gradient(ellipse at center, ${colors.join(', ')})`;
    
  };

  return (
    <div>
    <Changes hasTodayDiary={hasTodayDiary} onAlreadyWrote={handleAlreadyWrote}>
      <motion.div 
        className="mood-container flex justify-center mb-6"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        whileHover={{ scale: 0.95 }}    // 마우스 올릴 때 약간 작아짐
        whileTap={{ scale: 0.9 }}       // 클릭할 때 약간 작아짐
      >
        <div 
          className="mood-circle w-36 h-36 rounded-full"
          style={{ 
            background: generateGradient(),
            boxShadow: `0 0 40px ${emotions[0]?.color || '#4ecdc4'}40`
          }}
        />
      </motion.div>
    </Changes>
  </div>
  );
};

const DiaryCards = ({ diaries }: { diaries?: any[] }) => {

  const makePreview = (raw?: string, limit = 150) =>
    !raw ? '' : raw.replace(/\s+/g, ' ').slice(0, limit) + (raw.length > limit ? '…' : '');
  
  const sampleDiaries = [
    {
      id: 1,
      title: "오늘 하루는 어땠나요? 일기를 작성해 주세요.",
      peoples:["인물"],
      content_preview: "일기를 작성해주세요. 여기에는 일기 내용이 3줄까지 미리보기로 나타납니다."
    }
  ];

  const displayDiaries = diaries && diaries.length > 0 ? diaries : sampleDiaries;
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={containerRef}
      className="card-container overflow-hidden"
      style={{ minHeight: '100vh', position: 'relative' }}
    >
      <div className="space-y-4 px-4 py-8">
          {displayDiaries.map((diary, idx) => (
            <Card
              key={diary.id ?? idx}
              className="bg-gray-600 border-gray-600 text-2xl border-gray-700 p-6"
            >
              {/* 제목 */}
              <h1 className="text-white mb-4 leading-relaxed">"{diary.title}"</h1>

              {/* 등장 인물 */}
              <div className="flex flex-wrap gap-2 mb-4">
                {diary.peoples?.map((p: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm border border-gray-600"
                  >
                    {p}
                  </span>
                ))}
              </div>

              {/* ──▶ 3줄 미리보기 영역 ◀── */}
              <div className='bg-gray-800/70 backdrop-blur-sm px-6 py-6 rounded-2xl'>
                <p
                  className={clsx(
                    'text-gray-200 text-sm mb-4',
                    diary.content_preview ? 'line-clamp-3' : 'hidden'
                  )}
                >
                  {makePreview(diary.content_preview)}
                </p>
              </div>

            </Card>
          ))}
        </div>
    </div>
  );
};



const Home = () => {
  const token = localStorage.getItem('accessToken') || '';
  
  console.log(token);

  const { 
    data: todayData, 
    isLoading, 
    isError, 
    error,
    isSuccess
  } = useGetTodayDiary(token);


  //데이터가 로드되면 콘솔에 출력
  useEffect(() => {    
    if (isSuccess&&todayData) {
      console.log("=== 오늘의 일기 데이터 ===");
      
      // 안전한 접근 방법
      if (todayData.todayEmotions) {
        console.log("오늘의 감정들:", todayData.todayEmotions);
      } else {
        console.log("todayEmotions 키가 없습니다. 사용 가능한 키들:", Object.keys(todayData));
      }
      
      if (todayData.todayDiaries) {
        console.log("오늘의 일기들:", todayData.todayDiaries);
      } else {
        console.log("todayDiaries 키가 없습니다.");
      }
      
      console.log("=== 오늘의 일기 데이터 끝 ===");
    }
  }, [isSuccess, todayData]); // 의존성 배열 추가

  useEffect(() => {
    if (isError && error) {
      console.error("오늘의 일기 조회 실패", error);
    }
  }, [isError, error]);

  return (
    <div className='base'>
      {/* 상단 주간 캘린더*/}
      <WeeklyCalender />

      { /* MoodCircle */}
      <MoodCircle diaries={todayData?.todayDiaries}/>

      { /* 하단 일기 카드들 */ }
      <DiaryCards diaries={todayData?.todayDiaries}/>
    </div>
  );
};

export default Home;
