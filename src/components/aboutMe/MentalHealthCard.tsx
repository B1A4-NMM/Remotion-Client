import { useState, useEffect } from "react";
import MentalChart from "../aboutMe/Mental/MentalChart";
import { Button } from "../ui/button";
import TypingText from "./Mental/TypingText";
import ActivitySection from "./Mental/ActivitySection";
import PeopleSection from "./Mental/PeopleSection"; // ✅ People 컴포넌트도 있다고 가정
import { motion, AnimatePresence } from "framer-motion";

export const peopleData = [
  {
    title: "스트레스를 유발한 사람들",
    skills: [
      {
        label: "임구철 - 지속적인 야근과 질책으로 스트레스를 유발함",
        level: 90,
      },
      {
        label: "정진영 - 업무 분담의 불균형으로 갈등이 생김",
        level: 70,
      },
      {
        label: "이하린 - 사소한 일로 자주 다투며 감정 소모가 큼",
        level: 60,
      },
      {
        label: "손채민 - 과도한 기대와 간섭으로 부담을 느낌",
        level: 75,
      },
    ],
  },
];

const MentalHealthCard = () => {
  const [currentType, setCurrentType] = useState<"stress" | "anxiety" | "depression">("stress");
  const [step, setStep] = useState<"chart" | "summary" | "activity">("chart");

  const [showPeoplePrompt, setShowPeoplePrompt] = useState(false);
  const [showPeopleSection, setShowPeopleSection] = useState(false);

  const buttons = [
    { type: "stress", label: "Stress" },
    { type: "anxiety", label: "Anxiety" },
    { type: "depression", label: "Depression" },
  ];

  useEffect(() => {
    setStep("chart");
    setShowPeoplePrompt(false);
    setShowPeopleSection(false);

    const timer = setTimeout(() => setStep("summary"), 800);
    return () => clearTimeout(timer);
  }, [currentType]);

  useEffect(() => {
    if (step === "activity") {
      const delay = setTimeout(() => {
        setShowPeoplePrompt(true);
      }, 2000);
      return () => clearTimeout(delay);
    }
  }, [step]);

  return (
    <div className="flex flex-col items-start gap-6 w-full pt-4 px-6">
      <h1 className="text-white text-2xl font-bold pt-6">Mental Health</h1>

      {/* 버튼 */}
      <div className="flex gap-4">
        {buttons.map(({ type, label }) => (
          <Button
            key={type}
            onClick={() => setCurrentType(type)}
            variant={currentType === type ? "default" : "outline"}
            className="px-4"
          >
            {label}
          </Button>
        ))}
      </div>

      {/* 그래프 */}
      <MentalChart type={currentType} />

      {/* 요약 */}
      {step === "summary" && (
        <TypingText
          textList={[
            `최근 3일간 ${
              currentType === "stress" ? "스트레스" : currentType === "anxiety" ? "불안" : "우울"
            } 수치가 높으시네요.`,
            "무슨 일 때문일까요?",
          ]}
          onComplete={() => setStep("activity")}
        />
      )}

      {/* 액티비티 */}
      {step === "activity" && (
        <AnimatePresence>
          <motion.div
            key="activity"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <ActivitySection type={currentType} />
          </motion.div>
        </AnimatePresence>
      )}

      {/* 2초 후: 메시지 */}
      {showPeoplePrompt && (
        <TypingText
          textList={[
            `일 때문에 ${currentType === "stress" ? "스트레스" : currentType === "anxiety" ? "불안" : "우울"}가 최고치네요.`,
            "혹시 스트레스를 주는 대상도 있었나요?",
          ]}
          onComplete={() => setShowPeopleSection(true)}
        />
      )}

      {/* 메시지 이후 PeopleSection 등장 */}
      <AnimatePresence>
        {showPeopleSection && (
          <motion.div
            key="people"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full"
          >
            <PeopleSection categories={peopleData} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MentalHealthCard;
