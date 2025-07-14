// src/components/result/ResultView.tsx

import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useGetDiaryHealth } from "../../api/queries/result/useGetDiaryHealth";

import ActivityCardSlider from "./ActivityCardSlider";
import Todos from "./Todo";
import WarningTestBox from "../WariningTestBox";
import TestModal from "../TestModal";

interface ResultViewProps {
  diaryContent: any | null;
  memSummary: any | null;
}

const ResultView: React.FC<ResultViewProps> = ({ diaryContent }) => {
  const [scrollY, setScrollY] = useState(0);
  const [testType, setTestType] = useState<"stress" | "anxiety" | "depression" | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { id } = useParams<{ id: string }>();
  const period = 7;

  const { data: healthData } = useGetDiaryHealth(id!, period);

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

  const todos = diaryContent?.reflection?.todo ?? [];

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

      {testType && (
        <TestModal
          type={convertWarningToTestType(testType)}
          onClose={() => setTestType(null)}
          onFinish={(score) => console.log(`${testType} 점수:`, score)}
        />
      )}
    </>
  );
};

export default ResultView;
