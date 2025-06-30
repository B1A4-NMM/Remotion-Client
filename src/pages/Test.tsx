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

  // 테스트 종류를 쿼리 파라미터나 state로 전달받음
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get("type");
  // 유효성 검사
  const isValidTestType = (value: string | null): value is TestType =>
    value === "phq9" || value === "gad7" || value === "stress";

  if (!isValidTestType(typeParam)) {
    return <div>잘못된 테스트 유형입니다.</div>;
  }

  const { title, questions, options } = testDataMap[typeParam];

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(null));

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

  const progress = ((step + 1) / questions.length) * 100;

  return (
    <div className="flex flex-col px-4 pt-6 pb-[80px] max-w-md mx-auto">
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-center">{title}</h2>

        <Progress value={progress} className="mb-4" />

        <Card className="p-4">
          <p className="font-semibold mb-2">{`${step + 1}. ${questions[step]}`}</p>
          <RadioGroup
            value={String(answers[step])}
            onValueChange={val => handleSelect(Number(val))}
            className="flex flex-col gap-2"
          >
            {options.map(opt => (
              <Label
                key={opt.value}
                className={`border rounded-md px-3 py-2 flex items-center justify-between cursor-pointer transition-all ${
                  String(opt.value) === String(answers[step])
                    ? "border-primary ring-2 ring-primary"
                    : "border-muted"
                }`}
              >
                <span>{opt.label}</span>
                <RadioGroupItem value={String(opt.value)} className="ml-2" />
              </Label>
            ))}
          </RadioGroup>
        </Card>
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={handlePrev} disabled={step === 0}>
          이전
        </Button>
        <Button onClick={handleNext} disabled={answers[step] === null}>
          {step === questions.length - 1 ? "결과 확인" : "다음"}
        </Button>
      </div>
    </div>
  );
};

export default Test;
