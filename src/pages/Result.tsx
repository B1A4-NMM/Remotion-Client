import React, { useState, useEffect, useRef} from 'react';
import { Card, CardDescription, CardTitle, CardHeader, CardContent} from '../components/ui/card';
import { ArrowLeft, Clock, CirclePlus, Plus, PlusCircle } from "lucide-react"
import { ChartContainer } from "../components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, LabelList, ResponsiveContainer } from "recharts"
import { toast } from 'sonner'
import { Link } from 'react-router-dom' // 또는 'next/link'
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import TestModal from '../components/TestModal';
import '../styles/moodCircle.css';
import '../styles/resultCard.css';
import '../styles/App.css';
 

const baseColors = {
  green: "#82e79f",
  red: "#fcbcba",
  yellow: "#f8e76c",
  blue: "#70cfe4",
} as const;

type ColorKey = keyof typeof baseColors;

interface Emotion {
  color: ColorKey; // 이제 'red', 'green' 등의 키만 허용
  intensity: number;
}

// 스트레스 데이터 (날짜 포함)
const stressData = [
  { date: "2025-06-31", stress: 237 },
  { date: "2025-06-31", stress: 73 },
  { date: "2025-07-01", stress: 209 },
  { date: "2025-07-02", stress: 214 },
];

// 차트 설정
const chartConfig = {
  stress: {
    label: "스트레스 수치",
    color: "#ff6b6b", // 빨간색
  },
} satisfies ChartConfig;

const formatDateToMD = (dateStr: string) => {
  // YYYY-MM-DD에서 MM/DD 추출
  const match = dateStr.match(/\d{4}-(\d{2})-(\d{2})/);
  return match ? `${match[1]}/${match[2]}` : dateStr;
};

// 커스텀 라벨 컴포넌트
const CustomLabel = (props: any) => {
  const { x, y, value } = props;
  return (
    <text x={x} y={y - 10} fill="#ffffff" textAnchor="middle" fontSize="12" fontWeight="500">
      {value}
    </text>
  );
};

const StressChart = () => {
  return (
    <div className="w-full h-64 rounded-lg p-4">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <LineChart data={stressData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          {/* 1. 연한 배경 라인 */}
          <CartesianGrid
            strokeDasharray="none"
            stroke="#525a6a"
            strokeWidth={1}
            horizontal={true}
            vertical={false}
          />

          {/* 2. X축에 날짜 표시 */}
          <XAxis
            dataKey="date"
            tickFormatter={formatDateToMD}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#ffffff", fontSize: 12 }}
            interval={0}
          />

          <YAxis hide />

          {/* 3. 라인과 점 위에 수치 표시 */}
          <Line
            type="monotone"
            dataKey="stress"
            stroke="var(--color-stress)"
            strokeWidth={2}
            dot={{ fill: "var(--color-stress)", strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, fill: "var(--color-stress)" }}
          >
            {/* 각 점 위에 수치 표시 */}
            <LabelList content={CustomLabel} />
          </Line>
        </LineChart>
      </ChartContainer>
    </div>
  );
};

const Todos = () => {
  const TodoCards = [
    "투두리스트",
    "캘린더 기능 구현",
    "팀원들과 소통 개선",
    "의견 차이 관리 방법 연구",
  ];

  const handleTodoAdd = (todoItem: string) => {
    toast.success(`"${todoItem}" 추가 완료!`, {
      description: "할일 목록에 성공적으로 추가되었습니다.",
      duration: 3000,
    });
  };

  return (
    <div className="wrapper space-y-2">
      {TodoCards.map((card, index) => (
        <Card key={index} className="bg-gray-100 border-gray-300 p-4">
          <div className="flex items-center justify-between">
            <span>{card}</span>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full w-8 h-8 p-0"
              onClick={() => handleTodoAdd(card)}
            >
              <CirclePlus className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}


const R: React.FC = () => {
  const [showTestModal, setShowTestModal] = useState(false);

  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [scrollY, setScrollY] = useState(0);

  const contentRef = useRef<HTMLDivElement>(null);

  const processEmotions = (colors: string[], intensities: number[]): Emotion[] => {
    const colorMap = new Map<string, number>();
    
    // colors 배열을 기준으로 반복
    colors.forEach((color, index) => {
      const intensity = intensities[index];
      colorMap.set(color, (colorMap.get(color) || 0) + intensity);
    });
    
    return Array.from(colorMap.entries()).map(([color, totalIntensity]) => ({
      color: color as ColorKey,
      intensity: totalIntensity / 10 // 0-1 범위로 정규화
    }));
  };

  useEffect(() => {
    const exEmotionColors = ['blue', 'blue', 'blue', 'yellow', 'red', 'green'];
    const exIntensities = [7, 3, 4, 6, 9, 1];
    const processedEmotions = processEmotions(exEmotionColors, exIntensities);
    setEmotions(processedEmotions);
  }, []); // 빈 의존성 배열로 한 번만 실행

  // emotions 상태를 사용하여 그라데이션 생성
  const generateGradient = (): string => {
    if (emotions.length === 0) return '#333';
    if (emotions.length === 1) return baseColors[emotions[0].color];
    
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

  const [emotionCards, setEmotionsCards] = useState([
    { id: 1, title: "동코", emotions: ["감사", "안정", "당황", "지침"] },
    { id: 2, title: "진영", emotions: ["기쁨", "슬픔"] },
  ]);

  const addEmotionCard = () => {
    setEmotionsCards(prev => [
      ...prev,
      {
        id: Date.now(),
        title: "새로운 인물",
        emotions: [],
      },
    ]);
  };

  const StrCards = [
    {
      title: "학습애",
      count: "2번",
      description: "학습애란 배우고 익히고자 하는 열정을 의미합니다.",
      image: "/assets/img/study.jpg",
    },
    {
      title: "창의성",
      count: "3번",
      description: "창의성이란 새로운 아이디어를 생각해내는 능력을 의미합니다.",
      image: "https://unsplash.it/501/501/",
    },
    {
      title: "협력성",
      count: "1번",
      description: "협력성이란 다른 사람과 함께 일하는 능력을 의미합니다.",
      image: "https://unsplash.it/502/502/",
    },
  ];

  const WeakCards = [
    {
      title: "충동성",
      count: "2번",
      description: "충동성이란 변덕에 따라 행동하는 경향을 의미합니다.",
      image: "https://unsplash.it/500/500/",
    },
    {
      title: "집중력 부족",
      count: "3번",
      description: "집중력 부족은 어떤 일이나 대상에 주의를 기울여 몰두하는 능력을 의미합니다. ",
      image: "https://unsplash.it/501/501/",
    },
    {
      title: "판단력",
      count: "1번",
      description: "판단력은 옳고 그름이나 좋고 나쁨을 구별하고 합리적 결정을 내리는 능력입니다.",
      image: "https://unsplash.it/502/502/",
    },
  ];

  const personalButton = [
    {
      title: "영상 추천",
      href: "/recommend",
    },
    {
      title: "심리 검사 받기",
      herf: "/test",
    },
    {
      title: "일과 추가 하기",
      herf: "/todo",
    },
  ];

  const handleCardClick = (e: React.ChangeEvent<any>) => {
    e.currentTarget.classList.toggle("hover");
  };

  // 드래그 위치에 따른 mood-circle 크기 계산
  const getMoodCircleScale = () => {
    const maxDrag = 100;
    const minScale = 0.8;
    const maxScale = 1; // 아래로 드래그할 때 최대 크기

    if (scrollY <= 0) {
      // 위로 드래그: 크기 감소 (1 → 0.5)
      return Math.max(minScale, 1 + scrollY / maxDrag);
    } else {
      // 아래로 드래그: 크기 증가 (1 → 1.2)
      return Math.min(maxScale, 1 + scrollY / maxDrag);
    }
  };

  const handleDrag = (event: any, info: any) => {
    setScrollY(info.offset.y);
  };

  const calculateConstraints = () => {
    if (!contentRef.current) return { top: 0, bottom: 0 };

    const contentHeight = contentRef.current.scrollHeight;
    const viewHeight = window.innerHeight;
    const headerHeight = 400; // 헤더 + 무드 서클 영역

    return {
      top: -(contentHeight - viewHeight + headerHeight),
      bottom: 0,
    };
  };

  return (
    <div className="base px-4 overflow-hidden">
      {/* 상단 뒤로가기 버튼 */}
      <div className="relative z-50 flex justify-start pt-6 pb-6">
        <Button variant="ghost" size="icon" className="text-white">
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>

      {/* 무드 컨테이너 - 고정 위치 & 드래그에 따라 크기 변경 */}
      <motion.div
        className="mood-container flex justify-center mb-6"
        animate={{
          scale: getMoodCircleScale(),
          opacity: Math.max(0.5, getMoodCircleScale()),
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div
          className="mood-circle w-48 h-48 rounded-full"
          style={{
            background: generateGradient(),
            boxShadow: `0 0 40px ${emotions[0]?.color || "#4ecdc4"}40`,
          }}
        />
      </motion.div>

      {/* 선택된 색상들 표시 (선택사항) */}
      {/* <div className="selected-colors">
                  <p>Current colors:</p>
                  {emotions.map((emotion, index) => (
                  <span 
                      key={index} 
                      style={{
                      display: 'inline-block',
                      width: '20px',
                      height: '20px',
                      backgroundColor: emotion.color,
                      margin: '2px',
                      borderRadius: '50%'
                      }}
                  ></span>
              ))}
          </div> */}

      {/* 드래그 가능한 카드 컨테이너 */}
      <motion.div
        ref={contentRef}
        drag="y"
        dragConstraints={calculateConstraints()}
        dragElastic={0.1}
        onDrag={handleDrag}
        className="cursor-grab active:cursor-grabbing"
        style={{
          y: scrollY,
          backgroundColor: scrollY < -100 ? "#1E1E1E" : "#1E1E1E",
          borderRadius: scrollY < -100 ? "0px" : "24px 24px 0 0",
          minHeight: "100vh",
        }}
      >
        {/* 상단 카드들 */}
        <div className="card-container flex gap-4 mb-8">
          <Card className="flex-1 bg-gray-600 border-gray-600">
            <CardHeader className="text-gray-300">
              <h2 className="text-xl font-semibold">일기 제목 예시</h2>
            </CardHeader>
          </Card>
        </div>

        {/* 대상별 감정 분석 섹션 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-white">대상별 감정 분석</h2>

          {/* 감정 분석 카드들 */}
          <div className="space-y-4 mb-10">
            {emotionCards.map((card, index) => (
              <Card key={index} className="bg-gray-100 border-gray-300 p-4">
                <div className="mb-3">
                  <Badge variant="secondary" className="bg-gray-600 text-white">
                    {card.title}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {card.emotions.map((emotion, index) => (
                    <Button key={index} variant="outline" size="sm" className="rounded-full">
                      {emotion}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full w-8 h-8 p-0"
                    onClick={() => {
                      /*감정 추가 로직*/
                    }}
                  >
                    <CirclePlus className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}

            {/* 새 카드 추가 버튼*/}
            <Card className="bg-gray-100 border-gray-300 p-4">
              <div className="mb-3">
                <Badge
                  variant="secondary"
                  className="bg-gray-600 text-white"
                  onClick={addEmotionCard}
                >
                  <CirclePlus className="h-4 w-4" />
                </Badge>
              </div>
            </Card>
          </div>
        </div>
        <hr />
        <br />

        {/* 분석 세션 */}
        <h2 className="text-xl font-semibold mb-4 text-white">일기에서 나타난 당신의 강점 </h2>

        {/* 강점 분석 카드들 */}
        <div className="wrapper">
          <div className="cols">
            {StrCards.map((card, index) => (
              <div
                key={index}
                className="col"
                onTouchStart={handleCardClick}
                onClick={handleCardClick}
              >
                <div className="container">
                  <div className="front" style={{ backgroundImage: `url(${card.image})` }}>
                    <div className="inner">
                      <p>{card.title}</p>
                      <span>{card.count}</span>
                    </div>
                  </div>
                  <div className="back">
                    <div className="inner">
                      <p>{card.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <br />
        <hr />
        <br />
        <h2 className="text-xl font-semibold mb-4 text-white">일기에서 나타난 당신의 약점 </h2>

        {/* 약점 분석 카드들 */}
        <div className="wrapper">
          <div className="cols">
            {WeakCards.map((card, index) => (
              <div
                key={index}
                className="col"
                onTouchStart={handleCardClick}
                onClick={handleCardClick}
              >
                <div className="container">
                  <div className="front" style={{ backgroundImage: `url(${card.image})` }}>
                    <div className="inner">
                      <p>{card.title}</p>
                      <span>{card.count}</span>
                    </div>
                  </div>
                  <div className="back">
                    <div className="inner">
                      <p>{card.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <br />
        <hr />
        <br />
        {/*스트레스 수치*/}
        <h2 className="text-xl font-semibold mb-4 text-white">당신의 최근 스트레스 추이</h2>

        <p className="text-sm text-gray-400">수치가 낮을수록 좋습니다</p>

        <StressChart />

        <div className="mt-4 flex justify-between text-sm text-gray-400">
          <span>최저: 73</span>
          <span>최고: 305</span>
          <span>
            평균:{" "}
            {Math.round(stressData.reduce((acc, cur) => acc + cur.stress, 0) / stressData.length)}
          </span>
        </div>

        <Card className="mt-5">
          <CardHeader>
            <p>근 3일간의 스트레스 수치가 높습니다.</p>
            <p>스트레스 검사로 더 자세한 결과를 받아보실 수 있습니다.</p>
          </CardHeader>

          <Button
            className="w-full"
            style={{
              backgroundColor: "#303030",
              color: "#ffffff",
              border: "none",
            }}
            onClick={() => setShowTestModal(true)}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#494949")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#303030")}
          >
            테스트 보러 가기
          </Button>
        </Card>

        <br />
        <hr />
        <br />
        <h2 className="text-xl font-semibold m-4 text-white">당신의 todoList </h2>

        {/* 투두 리스트 카드들 */}
        <Todos />
      </motion.div>
      {showTestModal && (
        <TestModal
          type="stress"
          onClose={() => setShowTestModal(false)}
          onFinish={score => {
            console.log("최종 점수:", score);
          }}
        />
      )}
    </div>
  );
};

export default R;
