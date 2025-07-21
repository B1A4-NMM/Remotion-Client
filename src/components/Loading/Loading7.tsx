import { Canvas } from "@react-three/fiber";
import React, { useEffect, useState } from "react";
import LoadingBlob from "../Blob/Loading/LodingBlob";
import Loading6 from "./Loading6";

const ANALYSIS_STEPS = [
  "AI가 당신의 일기를 펼치고 있어요...",
  "감정의 흐름을 따라가고 있습니다...",
  "오늘의 특별한 순간을 포착 중...",
  "곧 분석 결과를 보여드릴게요!"
];
const APP_TIPS = [
  "빨간색은 강한 부정적인 감정을 의미해요. 예: 분노, 슬픔, 불안 등.",
  "파란색은 약한 부정적인 감정이에요. 예: 우울, 지침, 무기력 등.",
  "초록색은 강한 긍정적인 감정입니다. 예: 기쁨, 희망, 자신감 등.",
  "노란색은 약한 긍정 감정이에요. 예: 평온, 만족, 안정 등.",
  "감정의 색을 통해 오늘의 마음을 한눈에 볼 수 있어요!"
];

function useTypingEffect(text: string, speed = 30) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    if (!text) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(prev => prev + text[i]);
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return displayed;
}

const Loading7 = () => {
  // 랜덤 이모지
  // 단계 메시지
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (step < ANALYSIS_STEPS.length - 1) {
      const t = setTimeout(() => setStep(step + 1), 1800);
      return () => clearTimeout(t);
    }
  }, [step]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-900 relative overflow-hidden">
      <div className="relative pointer-events-none mb-28">
        <Canvas camera={{ position: [0, 0, 13], fov: 30 }}>
          <LoadingBlob />
        </Canvas>
      </div>
        <div className="relative w-[300px] h-[200px] mb-30">
          <Loading6/>
        </div>
    </div>
  );
};

export default Loading7; 