// components/TestModal.tsx
import React, { useState, useEffect } from "react"; // ✅ useEffect 추가
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
  type: IncomingType;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shouldCallOnFinish, setShouldCallOnFinish] = useState(false); // ✅ 추가

  // ✅ mode가 "result"로 변경된 후 onFinish 호출을 위한 useEffect
  useEffect(() => {
    if (mode === "result" && shouldCallOnFinish && score > 0) {
      
      // 다음 렌더링 사이클에서 onFinish 호출 (렌더링 완료 후)
      const timer = setTimeout(() => {
        onFinish(score);
        setShouldCallOnFinish(false);
      }, 100); // 짧은 지연으로 렌더링 완료 보장

      return () => clearTimeout(timer);
    }
  }, [mode, shouldCallOnFinish, score, onFinish]);

  const handleSelect = (value: number) => {
    const updated = [...answers];
    updated[step] = value;
    setAnswers(updated);
    
  };

  const handleNext = async () => {
    if (step < questions.length - 1) {
      setStep(prev => prev + 1);
    } else {
      
      setIsSubmitting(true);
      
      try {
        const validAnswers = answers.filter(answer => answer !== null && answer !== undefined);
        
        if (validAnswers.length !== questions.length) {
          console.error("일부 답변이 누락되었습니다:", {
            totalQuestions: questions.length,
            answeredQuestions: validAnswers.length,
            answers: answers
          });
        }
        
        const total = answers.reduce((sum, val) => {
          const score = val !== null && val !== undefined ? val : 0;
          return sum + score;
        }, 0);
        
        
        // ✅ 상태 업데이트를 분리하여 처리
        setScore(total);
        setShouldCallOnFinish(true); // onFinish 호출 플래그 설정
        setMode("result"); // mode 변경
        
        
        // ✅ 서버 요청은 별도로 처리 (UI와 분리)
        setTimeout(async () => {
          try {
            const apiTestType = type === "phq9" ? "depression" : type === "gad7" ? "anxiety" : "stress";
            await postTestComplete(apiTestType);
          } catch (apiError) {
            console.error("테스트 완료 알림 전송 실패 (UI에는 영향 없음):", apiError);
          }
        }, 200); // 결과 화면 렌더링 후 서버 요청
        
      } catch (error) {
        console.error("검사 결과 처리 중 오류:", error);
        const total = answers.reduce((sum, val) => sum + (val || 0), 0);
        setScore(total);
        setShouldCallOnFinish(true);
        setMode("result");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  };

  const isCurrentAnswerSelected = () => {
    const currentAnswer = answers[step];
    return currentAnswer !== null && currentAnswer !== undefined;
  };

  const getNextButtonText = () => {
    if (isSubmitting) return "처리 중...";
    return step === questions.length - 1 ? "결과 확인" : "다음";
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
          style={{ maxHeight: "calc(100vh - 3.5rem)", minHeight: "480px" }}
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
                    onClick={() => {
                      setMode("question");
                    }}
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

              {process.env.NODE_ENV === 'development' && (
                <div className="text-xs text-gray-500 mb-2">
                  디버그: Step {step + 1}/{questions.length}, 선택된 답변: {answers[step]}, 
                  버튼 활성화: {isCurrentAnswerSelected() ? 'Y' : 'N'}
                </div>
              )}

              <Card className="p-4 bg-white dark:bg-[#2C2C2C] border border-gray-300 dark:border-gray-600">
                <p className="font-semibold mb-2 text-black dark:text-white">{`${step + 1}. ${questions[step]}`}</p>
                <RadioGroup
                  value={answers[step] !== null ? String(answers[step]) : ""}
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
                  disabled={!isCurrentAnswerSelected() || isSubmitting}
                  className="bg-[#ef7c80] dark:bg-black text-white hover:bg-[#e06b6f] dark:hover:bg-gray-800 disabled:opacity-50"
                >
                  {getNextButtonText()}
                </Button>
              </div>
            </>
          )}

          {mode === "result" && (
            <>
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
