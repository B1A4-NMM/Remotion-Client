//Home.tsx
import { useGetTodayDiary } from '../api/queries/home/useGetHome';
import { motion } from 'framer-motion';
import React, { useState, useEffect, useRef} from 'react';
import { Link, useLocation } from "react-router-dom";


import { Card, CardDescription, CardTitle, CardHeader, CardContent} from '../components/ui/card';
import { ArrowLeft, Clock, CirclePlus, Plus, PlusCircle } from "lucide-react"
import { Button } from '../components/ui/button';


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

const MoodCircle = ({ diaries }: {diaries?: any[] }) => {
  const [emotions, setEmotions] = useState<Emotion[]>([]);

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
    <div >
      <Link to="/diary" className='home-circle'>
        <motion.div 
          className="mood-container flex justify-center mb-6"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          whileHover={{ scale: 0.95 }}    // 마우스 올릴 때 약간 작아짐
          whileTap={{ scale: 0.9 }}       // 클릭할 때 약간 작아짐
        >
          <div 
            className="mood-circle w-48 h-48 rounded-full"
            style={{ 
              background: generateGradient(),
              boxShadow: `0 0 40px ${emotions[0]?.color || '#4ecdc4'}40`
            }}
          />
        </motion.div>
      </Link>
    </div>
  );
};

const DiaryCards = ({ diaries }: { diaries?: any[] }) => {
  const sampleDiaries = [
    {
      id: 1,
      title: "오늘 하루는 어땠나요? 일기를 작성해보세요.",
      emotions: ["기대"],
      time: "지금",
      writtenDate: new Date().toISOString().split('T')[0]
    }
  ];

  const displayDiaries = diaries && diaries.length > 0 ? diaries : sampleDiaries;

  const [scrollY, setScrollY] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDrag = (event: any, info: any) => {
    setScrollY(info.point.y);
  };

  const calculateConstraints = () => {
    if (!contentRef.current || !containerRef.current) return { top: 0, bottom: 0 };
    const contentHeight = contentRef.current.scrollHeight;
    const containerHeight = containerRef.current.clientHeight;
    // 컨텐츠가 컨테이너보다 작으면 드래그 불가
    if (contentHeight <= containerHeight) return { top: 0, bottom: 0 };
    return {
      top: -(contentHeight - containerHeight + 500),
      bottom: 0
    };
  };

  return (
    <div 
      ref={containerRef}
      className="card-container overflow-hidden"
      style={{ minHeight: '100vh', position: 'relative' }}
    >
      <motion.div
        ref={contentRef}
        drag="y"
        dragConstraints={calculateConstraints()}
        dragElastic={0.1}
        onDrag={handleDrag}
        className="cursor-grab active:cursor-grabbing"
        style={{
          y: scrollY,
          position: 'absolute',
          width: '100%',
        }}
      >
        <div className="space-y-4 px-4 py-8">
          {displayDiaries.map((diary, index) => (
            <Card key={diary.id || index} className="bg-gray-600 border-gray-600 border-gray-700 p-6">
              <div className="mb-4">
                <p className="text-white text-base leading-relaxed">
                  "{diary.title}"
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {diary.emotions.map((emotion: string, emotionIndex: number) => (
                  <span 
                    key={emotionIndex}
                    className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm border border-gray-600"
                  >
                    {emotion}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">{diary.time}</span>
                <div className="w-8 h-8 bg-gray-600 rounded-full" />
              </div>
            </Card>
          ))}
        </div>
      </motion.div>
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
