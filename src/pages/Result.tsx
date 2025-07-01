import React, { useState, useEffect, useRef} from 'react';
import { Card, CardDescription, CardTitle, CardHeader} from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Clock, CirclePlus, Plus } from "lucide-react"
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import '../styles/moodCircle.css';
import '../styles/resultCard.css';
import '../styles/App.css';
 
interface Emotion {
  color: string;
  intensity: number;
}

const baseColors = {
  green: '#82e79f',
  red: '#fcbcba',
  yellow: '#f8e76c',
  blue: '#70cfe4'
} as const;


type ColorKey = keyof typeof baseColors;

const R: React.FC = () => {
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [dragY, setDragY] = useState(0);
  const [dragConstraints, setDragConstraints] = useState({top:0, bottom:0});
  const [isFullScreen, setIsFullscreen] =useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // 전환 임계값
  const FULLSCREEN_THRESHOLD = -150; // 위로 150px 드래그하면 전체화면
  const NORMAL_THRESHOLD = 100;      // 아래로 100px 드래그하면 일반모드



  // 랜덤한 색들을 선택하는 함수
  const generateRandomEmotions = (): Emotion[] => {
    const colorKeys = Object.keys(baseColors) as ColorKey[];
    const numberOfColors = Math.floor(Math.random() * 3) + 2; // 2-4개의 색상 선택
    
    // 랜덤하게 색상들을 선택 (중복 없이)
    const selectedColors = colorKeys
      .sort(() => Math.random() - 0.5)
      .slice(0, numberOfColors);
    
    // 각 색상에 대해 랜덤한 intensity 값 설정
    return selectedColors.map(colorKey => ({
      color: baseColors[colorKey],
      intensity: Math.random() * 0.4 + 0.5 // 0.5 ~ 0.9 사이의 값
    }));
  };

  // 컴포넌트 마운트 시 랜덤한 색상들 설정
  useEffect(() => {
    setEmotions(generateRandomEmotions());
  }, []);

  const generateGradient = (): string => {
    if (emotions.length === 0) return '#333';
    if (emotions.length === 1) return emotions[0].color;
    
    const colors = emotions.map((emotion, index) => {
      const position = (index / (emotions.length - 1)) * 100;
      return `${emotion.color} ${position}%`;
    }).join(', ');
    
    // 더 부드러운 원형 그라데이션
    return `radial-gradient(ellipse at center, ${colors})`;
  };

  const [emotionCards, setEmotionsCards]=useState([
    {id:1, title:"동코", emotions: ["감사","안정","당황","지침"]},
    {id:2, title: "진영", emotions:["기쁨","슬픔"]}
  ]);

  const addEmotionCard=()=>{
    setEmotionsCards(prev=>[...prev,{
      id:Date.now(),
      title: "새로운 인물",
      emotions:[]
    }]);
  }


  const StrCards = [
    {
      title: "학습애",
      count: "2번",
      description: "학습애란 배우고 익히고자 하는 열정을 의미합니다.",
      image: "/assets/img/study.jpg"
    },
    {
      title: "창의성",
      count: "3번", 
      description: "창의성이란 새로운 아이디어를 생각해내는 능력을 의미합니다.",
      image: "https://unsplash.it/501/501/"
    },
    {
      title: "협력성",
      count: "1번",
      description: "협력성이란 다른 사람과 함께 일하는 능력을 의미합니다.",
      image: "https://unsplash.it/502/502/"
    }
  ];

  const WeakCards = [
    {
      title: "충동성",
      count: "2번",
      description: "충동성이란 변덕에 따라 행동하는 경향을 의미합니다.",
      image: "https://unsplash.it/500/500/"
    },
    {
      title: "집중력 부족",
      count: "3번", 
      description: "집중력 부족은 어떤 일이나 대상에 주의를 기울여 몰두하는 능력을 의미합니다. ",
      image: "https://unsplash.it/501/501/"
    },
    {
      title: "판단력",
      count: "1번",
      description: "판단력은 옳고 그름이나 좋고 나쁨을 구별하고 합리적 결정을 내리는 능력입니다.",
      image: "https://unsplash.it/502/502/"
    }
  ];

  const TodoCards=["투두리스트","캘린더 기능 구현", "팀원들과 소통 개선", "의견 차이 관리 방법 연구"];

  const personalButton=[
    {
      title: "영상 추천",
      href: "/recommend"
    },
    {
      title: "심리 검사 받기",
      herf: "/test"
    },
    {
      title: "일과 추가 하기",
      herf: "/todo"
    }
  ];

  const handleCardClick = (e: React.ChangeEvent<any>) => {
    e.currentTarget.classList.toggle('hover');
  };

  const calculateConstraints = () => {
    if (containerRef.current && contentRef.current) {
      // DOM 업데이트 완료를 위한 지연
      requestAnimationFrame(() => {
        const containerHeight = containerRef.current!.clientHeight;
        const contentHeight = contentRef.current!.scrollHeight;
        
        console.log('=== Drag Constraints Calculation ===');
        console.log('Container height:', containerHeight);
        console.log('Content height:', contentHeight);
        console.log('Content overflow:', contentHeight - containerHeight);
        
        if (contentHeight > containerHeight) {
          // 더 넉넉한 스크롤 범위 제공
          const availableScroll = contentHeight - containerHeight;
          const topConstraint = -availableScroll - 200; // 추가 여유 공간
                    
          setDragConstraints({ 
            top: topConstraint,
            bottom: 50
          });
        } else {
          console.log('Content fits in container - no scroll needed');
          setDragConstraints({ top: 0, bottom: 0 });
        }
      });
    }
  };

  // 감정 분석 카드 변경 시에만 재계산
  useEffect(() => {
    const timer = setTimeout(calculateConstraints, 200); // 더 긴 지연
    return () => clearTimeout(timer);
  }, [emotionCards]); // emotionCards 변경 시에만

  // 초기 계산 (컴포넌트 마운트 시)
  useEffect(() => {
    const timer = setTimeout(calculateConstraints, 500); // 초기 로딩 후 계산
    return () => clearTimeout(timer);
  }, []);


  // 드래그 위치에 따른 mood-circle 크기 계산
  const getMoodCircleScale = () => {
      const maxDrag = 100;
      const minScale = 0.8;
      const maxScale = 1; // 아래로 드래그할 때 최대 크기
      
      if (dragY <= 0) {
        // 위로 드래그: 크기 감소 (1 → 0.5)
        return Math.max(minScale, 1 + dragY / maxDrag);
      } else {
        // 아래로 드래그: 크기 증가 (1 → 1.2)
        return Math.min(maxScale, 1 + (dragY / maxDrag));
      }
    };
    

  return (
    <div className='base px-4 overflow-hidden'>
      {/* 상단 뒤로가기 버튼 */}
      <div className="flex justify-start pt-6 pb-6">
        <Button variant="ghost" size="icon" className="text-white">
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>


      {/* 무드 컨테이너 - 고정 위치 & 드래그에 따라 크기 변경 */}
      <motion.div 
        className="mood-container flex justify-center mb-6"
        animate={{ 
          scale: getMoodCircleScale(),
          opacity: Math.max(0.5, getMoodCircleScale())
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div 
          className="mood-circle w-48 h-48 rounded-full"
          style={{ 
            background: generateGradient(),
            boxShadow: `0 0 40px ${emotions[0]?.color || '#4ecdc4'}40`
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
        <div ref={containerRef} className="h-[calc(100vh-200px)] overflow-hidden">
          <motion.div
            ref={contentRef}
            drag="y"
            dragConstraints={dragConstraints}
            dragElastic={0.1}
            onDrag={(event, info) => {
              setDragY(info.offset.y);
            }}
            className="cursor-grab active:cursor-grabbing"
            whileDrag={{ scale: 1.02 }}
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
                  <div className='flex flex-wrap gap-2'>
                    {card.emotions.map((emotion, index)=>(
                      <Button key={index} variant="outline" size="sm" className='rounded-full'>
                        {emotion}
                      </Button>
                    ))}
                    <Button variant="outline" size="sm" className='rounded-full w-8 h-8 p-0' onClick={()=>{/*감정 추가 로직*/}}>
                      <CirclePlus className='h-4 w-4'/>
                    </Button>
                  </div>
                </Card>
              ))}

              {/* 새 카드 추가 버튼*/}
              <Card className="bg-gray-100 border-gray-300 p-4">
                <div className="mb-3">
                  <Badge variant="secondary" className="bg-gray-600 text-white" onClick={addEmotionCard}>
                    <CirclePlus className="h-4 w-4" />
                  </Badge>
                </div>
              </Card>


              </div>
            </div>
            <hr />
            <br/>

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

            <br/>
            <hr/>
            <br/>
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

            <br/>
            <hr/>
            <br/>
            <h2 className="text-xl font-semibold mb-4 text-white">당신의 최근 스트레스 추이</h2>
            { /*스트레스 수치*/}



            <br/>
            <hr/>
            <br/>
            <h2 className="text-xl font-semibold mb-4 text-white">당신의 todoList </h2>

            {/* 투두 리스트 카드들 */}
            <div className="wrapper space-y-2">
              {TodoCards.map((card, index) => (
                <Card key={index} className="bg-gray-100 border-gray-300 p-4">
                    <span>{card}</span>
                  </Card>
              ))}
            </div>

            {/* 하단 버튼 */}
            <div className="card-container flex flex-wrap gap-4 justify-center mb-8">
                
            </div>

        </motion.div>
      </div>
    </div>
  );
};

export default R;
