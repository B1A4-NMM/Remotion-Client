// src/components/result/ResultView.tsx

import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

import ActivityCardSlider from "./ActivityCardSlider";
import Todos from "./Todo";
import WarningTestBox from "../WariningTestBox";
import TestModal from "../TestModal";
import PeopleCard from "../home/PeopleCard";
import ActivityAnalysisCard from "../home/ActivityAnalysisCard";
import IntensityChart from "./IntensityChart";
import BrainEmotionMap from "./BrainEmotionMap";
import TodoPreviewCard from "./TodoPreviewCard";
import ConflictAnalysisCard from "./ConflictAnalysisCard";
import RoutineRecommendCard from "./RoutineRecommendCard";
import RelationshipChangeCard from "./RelationshipChangeCard";
import NegativeEmotionCard from "./NegativeEmotionCard";

interface ResultViewProps {
  diaryContent: any | null;
  isLoading?: boolean;
}

const SkeletonBlock = ({ className = "" }) => (
  <motion.div
    className={`bg-gray-200 rounded-lg animate-pulse ${className}`}
    initial={{ opacity: 0.5 }}
    animate={{ opacity: 1 }}
    transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
  />
);

const ResultView: React.FC<ResultViewProps> = ({ diaryContent, isLoading }) => {
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

  // activity_analysis 전체를 ActivityAnalysisCard에 전달
  const peopleCardsData = {
    peoples: activityAnalysis.flatMap((activityItem: any) =>
      (activityItem.peoples || []).map((person: any) => ({
        name: person.name,
        feel: person.interactions.emotion.map((emotion: string, index: number) => ({
          emotionType: emotion,
          intensity: person.interactions.emotion_intensity[index] || 5,
        })),
        count: 1,
      }))
    ),
    selfEmotion: activityAnalysis.flatMap((activityItem: any) =>
      (activityItem.self_emotions?.emotion || []).map((emotion: string, index: number) => ({
        emotionType: emotion,
        intensity: activityItem.self_emotions?.emotion_intensity[index] || 5,
      }))
    ),
    stateEmotion: activityAnalysis.flatMap((activityItem: any) =>
      (activityItem.state_emotions?.emotion || []).map((emotion: string, index: number) => ({
        emotionType: emotion,
        intensity: activityItem.state_emotions?.emotion_intensity[index] || 5,
      }))
    ),
  };

  const todos = diaryContent?.analysis?.todos ?? [];

  // reflection에서 todo 데이터 추출
  const reflectionTodos = diaryContent?.analysis?.reflection?.todo ?? [];

  // recommendRoutine 데이터 추출
  const recommendRoutines = diaryContent?.recommendRoutine ?? [];

  // problem 데이터 추출 (모든 activity의 problem을 수집하고 null 체크)
  const allProblems = activityAnalysis.flatMap((activity: any) => activity.problem || []);

  // problem 중 하나라도 null 값이 있는지 확인
  const hasValidProblems = allProblems.some(
    (problem: any) => problem && problem.situation && problem.situation !== "None"
  );

  // beforeDiaryScores 데이터 추출
  const beforeDiaryScores = diaryContent?.beforeDiaryScores?.scores ?? [];

  // diaryId 추출
  const diaryId = diaryContent?.id;

  // people 데이터 추출
  const people = diaryContent?.people ?? [];

  // 변화가 있는 사람들만 필터링
  const peopleWithChanges = people.filter((person: any) => person.changeScore !== 0);

  // beforeDiaryScores 데이터 콘솔에 출력

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

  // 경고 데이터 확인
  const getWarningType = () => {
    if (!diaryContent) return null;
    const { anxietyWarning, depressionWarning, stressWarning } = diaryContent;

    // 우선순위: depression > anxiety > stress
    if (depressionWarning) return "depression";
    if (anxietyWarning) return "anxiety";
    if (stressWarning) return "stress";
    return null;
  };

  const warningType = getWarningType();

  const handleWarningClick = (type: "stress" | "anxiety" | "depression") => {
    setTestType(type);
  };

  // 부정적인 감정 감지 함수
  const getNegativeEmotionType = () => {
    if (!diaryContent) return null;

    // 감정 분석 데이터에서 부정적인 감정 확인
    const emotions = activityAnalysis.flatMap((activity: any) => [
      ...(activity.self_emotions?.emotion || []),
      ...(activity.state_emotions?.emotion || []),
    ]);

    // 부정적인 감정 키워드 매핑
    const negativeEmotionMap: Record<
      string,
      "stress" | "anxiety" | "depression" | "sadness" | "anger"
    > = {
      스트레스: "stress",
      불안: "anxiety",
      우울: "depression",
      슬픔: "sadness",
      화: "anger",
      분노: "anger",
      걱정: "anxiety",
      짜증: "anger",
      우울함: "depression",
      불안함: "anxiety",
    };

    // 감지된 부정적인 감정 찾기
    for (const emotion of emotions) {
      for (const [keyword, type] of Object.entries(negativeEmotionMap)) {
        if (emotion.includes(keyword)) {
          return type;
        }
      }
    }

    return null;
  };

  const negativeEmotionType = getNegativeEmotionType();

  if (isLoading) {
    // 스켈레톤 로딩 UI
    return (
      <div className="space-y-8 p-6">
        {/* 감정 차트 자리 */}
        <SkeletonBlock className="w-full h-32 mb-4" />
        {/* 카드 자리 */}
        <div className="flex space-x-4">
          <SkeletonBlock className="flex-1 h-40" />
          <SkeletonBlock className="flex-1 h-40" />
        </div>
        {/* 텍스트 자리 */}
        <SkeletonBlock className="w-2/3 h-6 mt-8" />
        <SkeletonBlock className="w-1/2 h-6" />
      </div>
    );
  }

  // Pass activityAnalysis to ActivityAnalysisCard
  return (
    <div className="px-4">
      <ActivityAnalysisCard data={activityAnalysis} />
      {/* <BrainEmotionMap activityAnalysis={activityAnalysis} /> */}
      {peopleWithChanges.length > 0 && (
        <>
          <RelationshipChangeCard people={peopleWithChanges} />
        </>
      )}
      {hasValidProblems && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mt-[30px] mb-[20px] px-4">
            오늘의 사건 리포트
          </h2>

          <ConflictAnalysisCard conflicts={allProblems} />
        </div>
      )}

      <IntensityChart scores={beforeDiaryScores} diaryId={diaryId} />
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
      {warningType && <WarningTestBox type={warningType} onClick={handleWarningClick} />}
      {negativeEmotionType && <NegativeEmotionCard emotionType={negativeEmotionType} />}
      {reflectionTodos.length > 0 && (
        <div className=" mb-6">
          {/* <h2 className="text-xl font-semibold text-gray-800 mt-[60px] mb-[20px]  px-4">
            오늘의 작은 실천
          </h2> */}
          <TodoPreviewCard todos={reflectionTodos} />
        </div>
      )}
      {/* <motion.div
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
      {/* <Todos todos={todos} /> */}
      {/* </motion.div> */}

      {testType && (
        <TestModal
          type={convertWarningToTestType(testType)}
          onClose={() => setTestType(null)}
        />
      )}
    </div>
  );
};

export default ResultView;
