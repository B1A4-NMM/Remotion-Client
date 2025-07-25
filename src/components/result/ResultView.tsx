// src/components/result/ResultView.tsx

import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

import ActivityCardSlider from "./ActivityCardSlider";
import Todos from "./Todo";
import WarningTestBox from "../WarningTestBox";
import TestModal from "./Test/TestModal";
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

  const titles = {
    emotionOfDay: "감정으로 보는 오늘 하루",
    eventReport: "오늘의 사건 리포트",
    emotionTimeline: "최근 감정 타임라인",
    recoveryRoutine: "나만의 감정 회복 루틴",
    relationshipChanges: "주변과의 관계 변화",
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
  const reflectionTodos = diaryContent?.analysis?.reflection?.todo ?? [];
  const recommendRoutines = diaryContent?.recommendRoutine ?? [];
  const allProblems = activityAnalysis.flatMap((activity: any) => activity.problem || []);
  const hasValidProblems = allProblems.some(
    (problem: any) => problem && problem.situation && problem.situation !== "None"
  );
  const beforeDiaryScores = diaryContent?.beforeDiaryScores?.scores ?? [];
  const diaryId = diaryContent?.id;
  const people = diaryContent?.people ?? [];
  const peopleWithChanges = people.filter((person: any) => person.changeScore !== 0);

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

  const getWarningType = () => {
    if (!diaryContent) return null;
    const { anxietyWarning, depressionWarning, stressWarning } = diaryContent;

    if (depressionWarning) return "depression";
    if (anxietyWarning) return "anxiety";
    if (stressWarning) return "stress";
    return null;
  };

  const warningType = getWarningType();

  const handleWarningClick = (type: "stress" | "anxiety" | "depression") => {
    setTestType(type);
  };

  const getNegativeEmotionType = () => {
    if (!diaryContent) return null;

    const emotions = activityAnalysis.flatMap((activity: any) => [
      ...(activity.self_emotions?.emotion || []),
      ...(activity.state_emotions?.emotion || []),
    ]);

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

  // 루틴 섹션에 포함될 컴포넌트들이 있는지 확인
  const hasRecoveryRoutineSection = 
    (reflectionTodos.length > 0) || 
    warningType || 
    (recommendRoutines && recommendRoutines.content) || 
    negativeEmotionType;

  if (isLoading) {
    return (
      <div className="space-y-8 p-6">
        <SkeletonBlock className="w-full h-32 mb-4" />
        <div className="flex space-x-4">
          <SkeletonBlock className="flex-1 h-40" />
          <SkeletonBlock className="flex-1 h-40" />
        </div>
        <SkeletonBlock className="w-2/3 h-6 mt-8" />
        <SkeletonBlock className="w-1/2 h-6" />
      </div>
    );
  }

  return (
    <div className="px-4">
      {/* ✅ CSS Grid 컨테이너로 모든 섹션을 감싸기 */}
      <div className="grid grid-cols-1 gap-8 auto-rows-max">
        
        {/* 1. 감정으로 보는 오늘 하루 섹션 */}
        {activityAnalysis.length > 0 && (
          <section className="grid-item">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 p-1">
              {titles.emotionOfDay}
            </h2>
            <ActivityAnalysisCard data={activityAnalysis} />
          </section>
        )}

        {/* 2. 주변과의 관계 변화 섹션 */}
        {peopleWithChanges.length > 0 && (
          <section className="grid-item">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 p-1">
              {titles.relationshipChanges}
            </h2>
            <RelationshipChangeCard people={peopleWithChanges} />
          </section>
        )}

        {/* 3. 오늘의 사건 리포트 섹션 */}
        {hasValidProblems && (
          <section className="grid-item">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 p-1">
              {titles.eventReport}
            </h2>
            <ConflictAnalysisCard conflicts={allProblems} />
          </section>
        )}

        {/* 4. 최근 감정 타임라인 섹션 (항상 표시) */}
        <section className="grid-item">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3 p-1">
            {titles.emotionTimeline}
          </h2>
          <IntensityChart scores={beforeDiaryScores} diaryId={diaryId} />
        </section>

        {/* 5. 나만의 감정 회복 루틴 섹션 */}
        {hasRecoveryRoutineSection && (
          <section className="grid-item">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 p-1">
              {titles.recoveryRoutine}
            </h2>
            
            {/* 루틴 섹션 내부도 Grid로 구성하여 일관된 간격 유지 */}
            <div className="grid grid-cols-1 gap-6 auto-rows-max">
              
              {/* 루틴 추천 카드 */}
              {recommendRoutines && recommendRoutines.content && (
                <div className="grid-item">
                  <div className="px-4">
                    <RoutineRecommendCard routines={[recommendRoutines]} />
                  </div>
                </div>
              )}

              {/* 경고 테스트 박스 */}
              {warningType && (
                <div className="grid-item">
                  <WarningTestBox type={warningType} onClick={handleWarningClick} />
                </div>
              )}

              {/* 부정적 감정 카드 */}
              {negativeEmotionType && (
                <div className="grid-item">
                  <NegativeEmotionCard emotionType={negativeEmotionType} />
                </div>
              )}

              {/* Todo 미리보기 카드 */}
              {reflectionTodos.length > 0 && (
                <div className="grid-item">
                  <TodoPreviewCard 
                    todos={reflectionTodos} 
                    writtenDate={diaryContent?.writtenDate} 
                  />
                </div>
              )}
              
            </div>
          </section>
        )}
        
      </div>

      {/* 테스트 모달 (Grid 외부에 위치) */}
      {testType && (
        <TestModal
          type={convertWarningToTestType(testType)}
          onClose={() => setTestType(null)} // 닫기 버튼 클릭 시에만 모달 닫기
          onFinish={(score) => {
            // 결과를 확인한 후 사용자가 "닫기" 버튼을 눌러야 모달이 닫힘
          }}
        />
      )}
    </div>
  );
};

export default ResultView;
