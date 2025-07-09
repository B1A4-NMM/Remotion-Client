import React, { useState, useEffect, useRef } from "react";
import { useGetDiaryContentResult } from "../api/queries/home/useGetDiary";
import { useGetMemberSummary } from "../api/queries/result/useGetmemSummary";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useGetDiaryHealth } from "../api/queries/result/useGetDiaryHealth"; // 경로는 실제 경로에 맞게 수정

import Todos from "../components/result/Todo";
import MoodCircle from "../components/result/MoodCircle";
import TestModal from "../components/TestModal";
import WarningTestBox from "../components/WariningTestBox"; // ✅ 추가
import ActivityCardSlider from "../components/result/ActivityCardSlider";
import StressTest from "../components/result/StressTest";
import "../styles/resultCard.css";
import "../styles/App.css";

// 샘플 일기 데이터 (없을 경우 대체용)
const sampleDiary = {
  activity_analysis: [
    {
      activity: "피드백 주고받기",
      peoples: [],
      self_emotions: {
        self_emotion: [],
        self_emotion_intensity: [],
      },
      state_emotions: {
        state_emotion: ["무난"],
        s_emotion_intensity: [4],
      },
      problem: [
        {
          situation: "None",
          approach: "None",
          outcome: "None",
          decision_code: "None",
          conflict_response_code: "None",
        },
      ],
      strength: "팀워크",
    },
  ],
  reflection: {
    achievements: [],
    shortcomings: [],
    todo: ["긍정적 태도 유지", "컨디션 관리"],
  },
};

interface DiaryCardsProps {
  diaryContent: any | null;
  memSummary: any | null;
}

/* ✅ 하위 카드 컴포넌트 */ const ResultCards = ({ diaryContent }: DiaryCardsProps) => {
  const [scrollY, setScrollY] = useState(0);
  const [testType, setTestType] = useState<"stress" | "anxiety" | "depression" | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { id } = useParams<{ id: string }>();
  const period = 7;

  // ✅ 감정 건강 데이터 가져오기
  const { data: healthData } = useGetDiaryHealth(id!, period);

  const handleDrag = (event: any, info: any) => {
    setScrollY(info.offset.y);
  };

  const calculateConstraints = () => {
    if (!contentRef.current) return { top: 0, bottom: 0 };
    const contentHeight = contentRef.current.scrollHeight;
    const viewHeight = window.innerHeight;
    const headerHeight = 400;
    return {
      top: -(contentHeight - viewHeight + headerHeight),
      bottom: 0,
    };
  };

  const todos = diaryContent?.reflection?.todo ?? [];

  // ✅ healthData에서 warning 값들 추출
  const showWarnings = [
    healthData?.stressWarning && "stress",
    healthData?.anxietyWarning && "anxiety",
    healthData?.depressionWarning && "depression",
  ].filter(Boolean) as ("stress" | "anxiety" | "depression")[];
  const convertWarningToTestType = (warning: "stress" | "anxiety" | "depression") => {
    switch (warning) {
      case "anxiety":
        return "gad7";
      case "depression":
        return "phq9";
      default:
        return "stress";
    }
  };
  return (
    <>
      <motion.div
        ref={contentRef}
        drag="y"
        dragConstraints={calculateConstraints()}
        dragElastic={0.1}
        onDrag={handleDrag}
        className="cursor-grab z-10 active:cursor-grabbing"
        style={{
          y: scrollY,
          borderRadius: scrollY < -100 ? "0px" : "24px 24px 0 0",
          minHeight: "100vh",
          backgroundColor: "#1e1e1e",
        }}
      >
        <ActivityCardSlider data={diaryContent} />

        <Todos todos={todos} />
        {showWarnings.map(type => (
          <WarningTestBox key={type} type={type} onClick={setTestType} />
        ))}
      </motion.div>

      {/* 🧪 심리테스트 모달 */}
      {testType && (
        <TestModal
          type={convertWarningToTestType(testType)} // 💡 변환해서 넘기기
          onClose={() => setTestType(null)}
          onFinish={score => {
            console.log(`${testType} 점수:`, score);
          }}
        />
      )}
    </>
  );
};
/* ✅ 메인 Result 페이지 */
const Result: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const token = localStorage.getItem("accessToken") || "";

  const {
    data: diaryContent,
    isLoading,
    isError,
  } = useGetDiaryContentResult(token, id || "sample");
  const { data: memsummary } = useGetMemberSummary(token);

  if (isLoading) {
    return (
      <div className="base flex items-center justify-center min-h-screen">
        <div className="text-white">일기 내용 로딩 중...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="base flex items-center justify-center min-h-screen">
        <div className="text-white text-center">
          <h2 className="text-xl mb-2">일기를 불러올 수 없습니다</h2>
          <p className="text-gray-300">
            {id ? `일기 ID ${id}를 찾을 수 없습니다.` : "일기 ID가 필요합니다."}
          </p>
        </div>
      </div>
    );
  }

  const finalDiaryContent = diaryContent || sampleDiary;

  return (
    <div className="base px-4 overflow-hidden">
      {/* ⬅️ 뒤로가기 */}
      <div className="relative z-50 flex justify-start pt-6 pb-6">
        <Button
          variant="ghost"
          size="icon"
          className="text-white"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>

      {/* 🎯 무드 서클 */}
      <MoodCircle diaryContent={finalDiaryContent} />

      {/* 📦 결과 카드들 */}
      <ResultCards diaryContent={finalDiaryContent} memSummary={memsummary} />
    </div>
  );
};

export default Result;
