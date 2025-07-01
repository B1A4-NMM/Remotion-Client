import { useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { PHQ_LEVELS } from "@/constants/phq-9";
import { GAD7_LEVELS } from "@/constants/gad-7";
import { STRESS_LEVELS } from "@/constants/pss";

type TestType = "phq9" | "gad7" | "stress";

const LEVEL_MAP: Record<
  TestType,
  {
    max: number;
    title: string;
    description: string;
    tone: "green" | "yellow" | "orange" | "red";
  }[]
> = {
  phq9: PHQ_LEVELS,
  gad7: GAD7_LEVELS,
  stress: STRESS_LEVELS,
};

interface TestResultProps {
  type: TestType;
  score: number;
}

const TestResult = ({ type, score }: TestResultProps) => {
  const levels = LEVEL_MAP[type];
  const matched = levels.find(level => score <= level.max) ?? levels[levels.length - 1];

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Card className={`p-6 border-l-8 border-${matched.tone}-500 shadow-md`}>
        <h2 className="text-2xl font-bold mb-4 text-center text-primary">
          {type.toUpperCase()} 결과
        </h2>
        <div className="space-y-3 text-center">
          <h3 className={`text-xl font-semibold text-${matched.tone}-600`}>{matched.title}</h3>
          <p className="whitespace-pre-line text-gray-700">{matched.description}</p>
        </div>
      </Card>
    </div>
  );
};

export default TestResult;
