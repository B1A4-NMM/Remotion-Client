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
const APP_TIPS = [
  "빨간색은 강한 부정적인 감정을 의미해요. 예: 분노, 슬픔, 불안 등.",
  "파란색은 약한 부정적인 감정이에요. 예: 우울, 지침, 무기력 등.",
  "초록색은 강한 긍정적인 감정입니다. 예: 기쁨, 희망, 자신감 등.",
  "노란색은 약한 긍정 감정이에요. 예: 평온, 만족, 안정 등.",
  "감정의 색을 통해 오늘의 마음을 한눈에 볼 수 있어요!",
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
  const [tipIndex, setTipIndex] = useState(0);
  const [showTip, setShowTip] = useState(true);

  useEffect(() => {
    if (step < ANALYSIS_STEPS.length - 1) {
      const t = setTimeout(() => setStep(step + 1), 1800);
      return () => clearTimeout(t);
    }
  }, [step]);

  // 팁 로테이션 효과
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setShowTip(false);
      setTimeout(() => {
        setTipIndex(prev => (prev + 1) % APP_TIPS.length);
        setShowTip(true);
      }, 500); // 페이드 아웃 시간
    }, 3000); // 3초마다 팁 변경

    return () => clearInterval(tipInterval);
  }, []);

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

      {/* 팁 표시 영역 */}
      {/* <div className="relative w-[300px] h-[200px] mb-30">
        <div
          className={`text-sm text-gray-600 dark:text-gray-300 transition-opacity duration-500 ${
            showTip ? "opacity-100" : "opacity-0"
          }`}
        >
          {APP_TIPS[tipIndex]}
        </div>
      </div> */}
    </div>
  );
};

export default Loading7;
