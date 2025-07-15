// src/components/result/ResultView.tsx

import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

import ActivityCardSlider from "./ActivityCardSlider";
import Todos from "./Todo";
import WarningTestBox from "../WariningTestBox";
import TestModal from "../TestModal";
import PeopleCard from "../home/PeopleCard";
import IntensityChart from "./IntensityChart";
import BrainEmotionMap from "./BrainEmotionMap";
import TodoPreviewCard from "./TodoPreviewCard";
import ConflictAnalysisCard from "./ConflictAnalysisCard";
import RoutineRecommendCard from "./RoutineRecommendCard";

interface ResultViewProps {
  diaryContent: any | null;
}

const ResultView: React.FC<ResultViewProps> = ({ diaryContent }) => {
  const [scrollY, setScrollY] = useState(0);
  const [testType, setTestType] = useState<"stress" | "anxiety" | "depression" | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { id } = useParams<{ id: string }>();
  const period = 7;

  const handleDrag = (_: any, info: any) => {
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

  const activityAnalysis = diaryContent?.analysis?.activity_analysis ?? [];

  // 사람별 카드 데이터로 변환
  const peopleCardsData = activityAnalysis.flatMap((activityItem: any) =>
    (activityItem.peoples || []).map((person: any) => ({
      activity: activityItem.activity,
      person, // 해당 사람 객체 전체 전달
    }))
  );

  const todos = diaryContent?.analysis?.todos ?? [];

  // reflection에서 todo 데이터 추출
  const reflectionTodos = diaryContent?.analysis?.reflection?.todo ?? [];

  // recommendRoutine 데이터 추출
  const recommendRoutines = diaryContent?.recommendRoutine ?? [];

  // problem 데이터 추출 (모든 activity의 problem을 수집하고 null 체크)
  const allProblems = activityAnalysis.flatMap((activity: any) => activity.problem || []);

  // problem 중 하나라도 null 값이 있는지 확인
  const hasValidProblems = allProblems.some(
    (problem: any) =>
      problem &&
      problem.situation &&
      problem.approach &&
      problem.outcome &&
      problem.conflict_response_code &&
      problem.situation !== "None" &&
      problem.approach !== "None" &&
      problem.outcome !== "None" &&
      problem.conflict_response_code !== "None"
  );

  // beforeDiaryScores 데이터 추출
  const beforeDiaryScores = diaryContent?.beforeDiaryScores?.scores ?? [];

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

  // Pass peopleCardsData to PeopleCard
  return (
    <>
      <IntensityChart scores={beforeDiaryScores} />
      <PeopleCard data={peopleCardsData} />
      <BrainEmotionMap activityAnalysis={activityAnalysis} />

      {hasValidProblems && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mt-[60px] mb-[20px] px-4">
            마음 사건 리포트
          </h2>
          <div className="px-4">
            <ConflictAnalysisCard conflicts={allProblems} />
          </div>
        </div>
      )}

      {recommendRoutines && recommendRoutines.content && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mt-[60px] mb-[20px] px-4">
            나만의 감정 회복 루틴
          </h2>
          <div className="px-4">
            <RoutineRecommendCard routines={[recommendRoutines]} />
          </div>
        </div>
      )}

      {reflectionTodos.length > 0 && (
        <div className=" mb-6">
          {/* <h2 className="text-xl font-semibold text-gray-800 mt-[60px] mb-[20px]  px-4">
            오늘의 작은 실천
          </h2> */}
          <TodoPreviewCard todos={reflectionTodos} />
        </div>
      )}
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
        }}
      >
        {/* <ActivityCardSlider data={activityAnalysis} /> */}
        <Todos todos={todos} />
      </motion.div>

      {testType && (
        <TestModal
          type={convertWarningToTestType(testType)}
          onClose={() => setTestType(null)}
          onFinish={score => console.log(`${testType} 점수:`, score)}
        />
      )}
    </>
  );
};

export default ResultView;
