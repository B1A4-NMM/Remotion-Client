// components/TestModal.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Progress } from "../components/ui/progress";
import { PHQ_QUESTIONS, PHQ_OPTIONS } from "../constants/phq-9";
import { GAD7_QUESTIONS, GAD7_OPTIONS } from "../constants/gad-7";
import { STRESS_QUESTIONS, STRESS_OPTIONS } from "../constants/pss";
import { TEST_INTRO } from "../constants/testIntro";
import { X } from "lucide-react";
import TestResult from "./TestResult";
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
  console.log("✅ type 값:", type);
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
          className="w-full max-w-md overflow-y-auto   text-foreground rounded-t-xl p-6 pb-16"
          style={{ maxHeight: "calc(100vh - 3.5rem)", minHeight: "480px" }} // ✅ 추가
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex justify-end mb-2">
            <button onClick={onClose}>
              <X className="text-white hover:text-red-300" />
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
                    className="w-full   text-foreground hover:bg-secondary"
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
              <Progress value={progress} className="mb-4 bg-gray-600 [&>div]:bg-blue-400" />

              <Card className="p-4 bg-[#2C2C2C] border border-gray-600">
                <p className="font-semibold mb-2 text-foreground">{`${step + 1}. ${questions[step]}`}</p>
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
                          ? "border-white ring-2 ring-white"
                          : "border-gray-500"
                      }`}
                    >
                      <span className="text-white">{opt.label}</span>
                      <RadioGroupItem
                        value={String(opt.value)}
                        className="ml-2 bg-transparent border-white data-[state=checked]:bg-white"
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
                  className="bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50"
                >
                  이전
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={answers[step] === null}
                  className="bg-white text-black hover:bg-gray-200 disabled:opacity-50"
                >
                  {step === questions.length - 1 ? "결과 확인" : "다음"}
                </Button>
              </div>
            </>
          )}

          {mode === "result" && (
            <>
              <h2 className="text-2xl font-bold text-center mb-4 text-white">검사 결과</h2>
              <TestResult type={mapType(type)} score={score} />
              <div className="mt-6">
                <Button onClick={onClose} className="w-full bg-white text-black hover:bg-gray-200">
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
