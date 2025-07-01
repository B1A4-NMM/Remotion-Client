import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { useNavigate, useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
// 질문, 옵션, 결과 텍스트를 외부에서 props로 받기 위한 형태로 변경
import { PHQ_QUESTIONS, PHQ_OPTIONS } from "./../constants/phq-9";
import { GAD7_QUESTIONS, GAD7_OPTIONS } from "./../constants/gad-7";
import { STRESS_QUESTIONS, STRESS_OPTIONS } from "./../constants/pss";
type TestType = "phq9" | "gad7" | "stress";

const testDataMap: Record<
  TestType,
  {
    title: string;
    questions: string[];
    options: { label: string; value: number }[];
  }
> = {
  phq9: { title: "PHQ-9 우울 증상 자가검진", questions: PHQ_QUESTIONS, options: PHQ_OPTIONS },
  gad7: { title: "GAD-7 불안 자가검진", questions: GAD7_QUESTIONS, options: GAD7_OPTIONS },
  stress: { title: "스트레스 자가진단", questions: STRESS_QUESTIONS, options: STRESS_OPTIONS },
};

const Test = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get("type");

  const isValidTestType = (value: string | null): value is TestType =>
    value === "phq9" || value === "gad7" || value === "stress";

  if (!isValidTestType(typeParam)) {
    return <div className="text-white">잘못된 테스트 유형입니다.</div>;
  }

  const { title, questions, options } = testDataMap[typeParam];
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(null));
  const progress = ((step + 1) / questions.length) * 100;

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
      navigate(`/test/result?type=${typeParam}`, { state: { total } });
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(prev => prev - 1);
  };

  return (
    <div className="flex flex-col px-4 pt-6 pb-[80px] max-w-md mx-auto bg-[#1E1E1E] text-white min-h-screen">
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-center text-white">{title}</h2>

        <Progress value={progress} className="mb-4 bg-gray-600 [&>div]:bg-gray-200" />

        <Card className="p-4 bg-[#2C2C2C] border border-gray-600">
          <p className="font-semibold mb-2 text-white">{`${step + 1}. ${questions[step]}`}</p>
          <RadioGroup
            value={String(answers[step])}
            onValueChange={val => handleSelect(Number(val))}
            className="flex flex-col gap-2"
          >
            {options.map(opt => (
              <Label
                key={opt.value}
                className={`border rounded-md px-3 py-2 flex items-center justify-between cursor-pointer transition-all text-white ${
                  String(opt.value) === String(answers[step])
                    ? "border-white ring-2 ring-white"
                    : "border-gray-500"
                }`}
              >
                <span>{opt.label}</span>
                <RadioGroupItem
                  value={String(opt.value)}
                  className="ml-2 bg-transparent border-white data-[state=checked]:bg-white data-[state=checked]:border-white"
                />
              </Label>
            ))}
          </RadioGroup>
        </Card>
      </div>

      <div className="flex justify-between mt-6 gap-2">
        <Button
          onClick={handlePrev}
          disabled={step === 0}
          className={`w-full border ${
            step === 0
              ? "border-white text-white"
              : "border-white text-white hover:bg-white hover:text-black"
          }`}
          variant="ghost"
        >
          이전
        </Button>

        <Button
          onClick={handleNext}
          disabled={answers[step] === null}
          className={`w-full ${
            answers[step] === null
              ? "bg-gray-400 text-black cursor-not-allowed"
              : "bg-white text-black hover:bg-gray-200"
          }`}
        >
          {step === questions.length - 1 ? "결과 확인" : "다음"}
        </Button>
      </div>
    </div>
  );
};

export default Test;
