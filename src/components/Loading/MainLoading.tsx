import { Canvas } from "@react-three/fiber";
import React, { useEffect, useState } from "react";
import LoadingBlob from "../Blob/Loading/LodingBlob";
import InSideLoading from "./InSideLoading";

const ANALYSIS_STEPS = [
  "AI가 당신의 일기를 펼치고 있어요...",
  "감정의 흐름을 따라가고 있습니다...",
  "오늘의 특별한 순간을 포착 중...",
  "곧 분석 결과를 보여드릴게요!",
];

const Loading7 = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step < ANALYSIS_STEPS.length - 1) {
      const t = setTimeout(() => setStep(step + 1), 1800);
      return () => clearTimeout(t);
    }
  }, [step]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-900 relative overflow-hidden">
      <div className="relative pointer-events-none mb-28 w-30 h-30">
        <Canvas camera={{ position: [0, 0, 15], fov: 20 }}>
          <LoadingBlob />
        </Canvas>
      </div>
      <div className="relative w-[350px] h-[200px] mb-30">
        <InSideLoading />
      </div>
    </div>
  );
};

export default Loading7;
