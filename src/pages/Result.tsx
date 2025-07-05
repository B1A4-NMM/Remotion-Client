import React, { useState, useEffect, useRef } from "react";
import { useMutationState } from "@tanstack/react-query";

import { Card, CardDescription, CardTitle, CardHeader, CardContent } from "../components/ui/card";
import { ArrowLeft, Clock, CirclePlus, Plus, PlusCircle } from "lucide-react";
import { ChartContainer } from "../components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";
import { Link } from "react-router-dom"; // 또는 'next/link'
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";

import TestModal from "../components/TestModal";
import "../styles/moodCircle.css";
import "../styles/resultCard.css";
import "../styles/App.css";

interface DiaryCardsProps {
  hasTodayDiary: boolean;
  todayDiary: any | null;
  diaryContent: any | null;
  isContentLoading: boolean;
  isContentError: boolean;
}

const baseColors = {
  green: "#4ecdc4",
  red: "#ff6b6b",
  yellow: "#ffe66d",
  blue: "#45b7d1",
  gray: "#c4c4c4",
  gray1: "#c4c4c4",
  gray2: "#424242",
} as const;

type ColorKey = keyof typeof baseColors;

interface Emotion {
  color: string;
  intensity: number;
}

// 감정을 색상으로 매핑하는 함수
const mapEmotionToColor = (emotion: string): string => {
  const strongHappiness = new Set([
    "행복",
    "기쁨",
    "신남",
    "즐거움",
    "설렘",
    "유대",
    "신뢰",
    "존경",
  ]);
  const weakHappiness = new Set(["친밀", "자신감", "평온", "안정", "편안", "감사", "무난", "차분"]);
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
  ]); // 누락된 감정 추가
  const weakUnhappiness = new Set(["외로움", "우울", "공허", "기대"]);

  if (strongHappiness.has(emotion)) return "yellow";
  if (weakHappiness.has(emotion)) return "green";
  if (strongUnhappiness.has(emotion)) return "red";
  if (weakUnhappiness.has(emotion)) return "blue";
  return "gray"; // 알 수 없는 감정
};

{
  /* ==========무드 서클 ============== */
}
const MoodCircle = ({ hasTodayDiary, todayDiary, diaryContent }: DiaryCardsProps) => {
  const [emotions, setEmotions] = useState<Emotion[]>([]);

  // 일기 내용에서 감정 데이터를 처리하는 함수
  const processDiaryContentEmotions = (content: any): Emotion[] => {
    if (!content || !hasTodayDiary) {
      return [{ color: "gray1" as ColorKey, intensity: 1 }];
    }

    // 모든 감정을 하나의 배열로 수집
    const allEmotions: { type: string; intensity: number }[] = [];

    // selfEmotion 추가
    if (content.selfEmotion && Array.isArray(content.selfEmotion)) {
      content.selfEmotion.forEach((emotion: any) => {
        allEmotions.push({
          type: emotion.emotionType,
          intensity: emotion.intensity || 5,
        });
      });
    }

    // stateEmotion 추가
    if (content.stateEmotion && Array.isArray(content.stateEmotion)) {
      content.stateEmotion.forEach((emotion: any) => {
        allEmotions.push({
          type: emotion.emotionType,
          intensity: emotion.intensity || 5,
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
              intensity: (emotion.intensity || 5) * 0.5, // 다른 사람 감정은 가중치 낮게
            });
          });
        }
      });
    }
    if (allEmotions.length === 0) {
      return [{ color: "gray1" as ColorKey, intensity: 1 }];
    }

    // 색상별로 그룹화하고 강도 계산
    const colorMap = new Map<ColorKey, number>();
    allEmotions.forEach(({ type, intensity }) => {
      const color = mapEmotionToColor(type);
      colorMap.set(color, (colorMap.get(color) || 0) + intensity);
    });

    /* ① 다른 색이 있으면 gray* 제거  */
    if (colorMap.size > 1) {
      colorMap.delete("gray1");
      colorMap.delete("gray2");
    }

    // 정규화 및 결과 생성
    const maxIntensity = Math.max(...colorMap.values());

    return [...colorMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([color, total]) => ({
        color,
        intensity: +(total / maxIntensity).toFixed(3), // 0~1
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
    if (emotions.length === 0 || emotions.every(e => e.color === "gray1" || e.color === "gray2")) {
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

    return `radial-gradient(ellipse at center, ${colors.join(", ")})`;
  };

  return (
    <motion.div
      className="mood-container flex justify-center mb-6"
      animate={{
        scale: getMoodCircleScale(),
        opacity: Math.max(0.5, getMoodCircleScale()),
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div
        className="mood-circle w-36 h-36 rounded-full"
        style={{
          background: generateGradient(),
          boxShadow: `0 0 40px ${baseColors[emotions[0]?.color ?? "gray1"]}40`,
        }}
      />
    </motion.div>
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
  );
};

const Result: React.FC = () => {
  const postDiaryData = useMutationState({
    filters: { mutationKey: ["postDiary"] },
    select: mutation => {
      console.log("🔍 Mutation 상태:", mutation.state.status); // pending, success, error 등
      console.log("🔍 Mutation 데이터:", mutation.state.data);
      console.log("🔍 전체 mutation:", mutation);
      return mutation.state.data;
    },
  });

  console.log("📊 전체 postDiaryData:", postDiaryData);

  const latestDiaryData = postDiaryData[postDiaryData.length - 1];
  console.log("📌 latestDiaryData:", latestDiaryData);
  if (!latestDiaryData) {
    return <div>데이터를 불러올 수 없습니다. 다시 시도해 주세요.</div>;
  }

  const [showTestModal, setShowTestModal] = useState(false);

  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [scrollY, setScrollY] = useState(0);

  const contentRef = useRef<HTMLDivElement>(null);

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
      {/* <MoodCircle/> */}

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
        {/*스트레스 수치*/}
        <h2 className="text-xl font-semibold mb-4 text-white">당신의 최근 스트레스 추이</h2>

        <p className="text-sm text-gray-400">수치가 낮을수록 좋습니다</p>

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

export default Result;
