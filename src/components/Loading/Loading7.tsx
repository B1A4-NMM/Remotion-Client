import { Canvas } from "@react-three/fiber";
import SimpleBlob from "../Blob/Simple/SimpleBlob";
import React, { useEffect, useState } from "react";
import EmotionSummary from "../result/EmotionSummary";
import ResultToggle from "../result/ResultToggle";
import LoadingBlob from "../Blob/Loading/LodingBlob";

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

const Loading7 = ({ diary }: { diary: string; }) => {

  // 타이핑 애니메이션 (일기 앞부분)
  let typingSpeed = 100;
  // if(diary){
  //   if (diary.length <= 40) typingSpeed = 60;
  //   else if (diary.length <= 100) typingSpeed = 35;
  //   else if (diary.length <= 200) typingSpeed = 18;
  //   else typingSpeed = 8;
  // }
  const typing = useTypingEffect(diary || "", typingSpeed);

  return (
    <div className="result-container px-4 h-full flex flex-col items-center justify-center text-gray-900 relative overflow-hidden">
      {/* <EmotionSummary diaryContent={""} isLoading={true} />
      <ResultToggle view={"record"} />
      <div className="bg-white rounded-2xl shadow-lg w-full">
        <div className="m-6 whitespace-pre-wrap text-foreground leading-relaxed animate-typing">
          {typing || <span className="text-gray-300">일기 내용을 불러오는 중...</span>}
        </div>
      </div> */}
      <Canvas>
        <LoadingBlob/>
      </Canvas>
    </div>
  );
};

export default Loading7; 