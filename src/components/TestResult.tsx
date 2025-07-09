// components/TestResult.tsx
import { Card } from "@/components/ui/card";
import { PHQ_LEVELS } from "@/constants/phq-9";
import { GAD7_LEVELS } from "@/constants/gad-7";
import { STRESS_LEVELS } from "@/constants/pss";
import clsx from "clsx";

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
      <Card
        className={clsx("p-6 border-l-8 shadow-md", {
          "border-green-500": matched.tone === "green",
          "border-yellow-500": matched.tone === "yellow",
          "border-orange-500": matched.tone === "orange",
          "border-red-500": matched.tone === "red",
        })}
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-primary">
          {type.toUpperCase()} 결과
        </h2>
        <div className="space-y-3 text-center">
          <h3
            className={clsx("text-xl font-semibold", {
              "text-green-600": matched.tone === "green",
              "text-yellow-600": matched.tone === "yellow",
              "text-orange-600": matched.tone === "orange",
              "text-red-600": matched.tone === "red",
            })}
          >
            {matched.title}
          </h3>
          <p className="whitespace-pre-line text-gray-300">{matched.description}</p>
        </div>
      </Card>
    </div>
  );
};

export default TestResult;
