// components/TestModal.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Progress } from "../../ui/progress";
import { PHQ_QUESTIONS, PHQ_OPTIONS } from "../../../constants/phq-9";
import { GAD7_QUESTIONS, GAD7_OPTIONS } from "../../../constants/gad-7";
import { STRESS_QUESTIONS, STRESS_OPTIONS } from "../../../constants/pss";
import { TEST_INTRO } from "../../../constants/testIntro";
import { X } from "lucide-react";
import TestResult from "./TestResult";
import { postTestComplete } from "../../../api/services/test";

type IncomingType = "phq9" | "gad7" | "stress" | "depression" | "anxiety";

type TestType = "phq9" | "gad7" | "stress";
const mapType = (rawType: IncomingType): TestType => {
  switch (rawType) {
    case "depression":
      return "phq9";
    case "anxiety":
      return "gad7";
    default:
      return rawType;
  }
};
const testDataMap = {
  phq9: { title: "PHQ-9 우울 증상 자가검진", questions: PHQ_QUESTIONS, options: PHQ_OPTIONS },
  gad7: { title: "GAD-7 불안 자가검진", questions: GAD7_QUESTIONS, options: GAD7_OPTIONS },
  stress: { title: "PSS 스트레스 자가진단", questions: STRESS_QUESTIONS, options: STRESS_OPTIONS },
};

interface TestModalProps {
  type: IncomingType; // 변경
  onClose: () => void;
  onFinish: (score: number) => void;
}

const TestModal = ({ type, onClose, onFinish }: TestModalProps) => {
  const convertedType = mapType(type);
  const { title, questions, options } = testDataMap[convertedType];

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(null));
  const progress = ((step + 1) / questions.length) * 100;
  const [mode, setMode] = useState<"intro" | "question" | "result">("intro");
  const [score, setScore] = useState(0);
  console.log("✅ TestModal type 값:", type);
  console.log("✅ TestModal convertedType 값:", convertedType);
  const handleSelect = (value: number) => {
    const updated = [...answers];
    updated[step] = value;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(prev => prev + 1);
    } else {
      const total = answers.reduce((sum, val) => sum + (val ?? 0), 0);
      setScore(total);
      setMode("result");

      // 테스트 결과를 서버로 전송
      const apiTestType = type === "phq9" ? "depression" : type === "gad7" ? "anxiety" : "stress";
      console.log("🔍 handleNext에서 API 타입 결정:");
      console.log("  - 원본 type:", type);
      console.log("  - 결정된 apiTestType:", apiTestType);
      postTestComplete(apiTestType)
        .then(() => {
          console.log("테스트 완료 알림 전송 성공");
        })
        .catch(error => {
          console.error("테스트 완료 알림 전송 실패:", error);
        });

      onFinish(total);
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(prev => prev - 1);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-md overflow-y-auto bg-[#FAF6F4] dark:bg-[#4A3551] text-black dark:text-white rounded-t-xl p-6 pb-16"
          style={{ maxHeight: "calc(100vh - 3.5rem)", minHeight: "480px" }} // ✅ 추가
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex justify-end mb-2">
            <button onClick={onClose}>
              <X className="text-black dark:text-white hover:text-red-500 dark:hover:text-red-300" />
            </button>
          </div>

          {/* Intro 설명 */}
          {mode === "intro" && (
            <>
              <div className="w-full">
                <h2 className="text-xl font-bold text-center mb-4">{title}</h2>
                <div
                  className="overflow-y-auto text-base leading-relaxed text-foreground bg-card rounded-lg p-5 border border-border"
                  style={{ height: "70%" }}
                >
                  {TEST_INTRO[type]}
                </div>
                <div className="mt-6">
                  <Button
                    onClick={() => setMode("question")}
                    className="w-full bg-[#ef7c80] dark:bg-black text-white hover:bg-[#e06b6f] dark:hover:bg-gray-800"
                  >
                    검사 시작하기
                  </Button>
                </div>
              </div>
            </>
          )}

          {mode === "question" && (
            <>
              <h2 className="text-xl font-bold text-center mb-4">{title}</h2>
              <Progress
                value={progress}
                className="mb-4 bg-gray-200 dark:bg-gray-600 [&>div]:bg-green-500 dark:[&>div]:bg-green-900"
              />

              <Card className="p-4 bg-white dark:bg-[#2C2C2C] border border-gray-300 dark:border-gray-600">
                <p className="font-semibold mb-2 text-black dark:text-white">{`${step + 1}. ${questions[step]}`}</p>
                <RadioGroup
                  value={String(answers[step])}
                  onValueChange={val => handleSelect(Number(val))}
                  className="flex flex-col gap-2"
                >
                  {options.map(opt => (
                    <Label
                      key={opt.value}
                      className={`border rounded-md px-3 py-2 flex items-center justify-between cursor-pointer ${
                        String(opt.value) === String(answers[step])
                          ? "border-[#ef7c80] dark:border-purple-400 ring-2 ring-[#ef7c80] dark:ring-purple-400"
                          : "border-gray-300 dark:border-gray-500"
                      }`}
                    >
                      <span className="text-black dark:text-white">{opt.label}</span>
                      <RadioGroupItem
                        value={String(opt.value)}
                        className="ml-2 bg-transparent border-gray-400 dark:border-purple-400 data-[state=checked]:bg-[#ef7c80] dark:data-[state=checked]:bg-purple-400"
                      />
                    </Label>
                  ))}
                </RadioGroup>
              </Card>
              <div className="flex justify-between mt-6 gap-2">
                <Button
                  onClick={handlePrev}
                  disabled={step === 0}
                  variant="ghost"
                  className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  이전
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={answers[step] === null}
                  className="bg-[#ef7c80] dark:bg-black text-white hover:bg-[#e06b6f] dark:hover:bg-gray-800 disabled:opacity-50"
                >
                  {step === questions.length - 1 ? "결과 확인" : "다음"}
                </Button>
              </div>
            </>
          )}

          {mode === "result" && (
            <>
              {/* <h2 className="text-2xl font-bold text-center mb-4 text-black dark:text-white">
                검사 결과
              </h2> */}
              <TestResult type={mapType(type)} score={score} />
              <div className="mt-6">
                <Button
                  onClick={onClose}
                  className="w-full bg-[#ef7c80] dark:bg-black text-white hover:bg-[#e06b6f] dark:hover:bg-gray-800"
                >
                  닫기
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TestModal;
