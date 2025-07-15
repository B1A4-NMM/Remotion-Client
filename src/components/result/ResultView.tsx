// src/components/result/ResultView.tsx

import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

import ActivityCardSlider from "./ActivityCardSlider";
import Todos from "./Todo";
import WarningTestBox from "../WariningTestBox";
import TestModal from "../TestModal";
import PeopleCard from "../home/PeopleCard";

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
      <PeopleCard data={peopleCardsData} />
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
