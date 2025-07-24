import React from "react";
import { Canvas } from "@react-three/fiber";
import Blob from "../Blob/Blob";

interface IndexProps {
  className?: string;
  title?: string;
  subtitle?: string;
  description?: string;
}

const Index = ({
  className = "",
  title = "하루뒤 시작하기",
  subtitle = "나만의 하루를 기록해 보세요.",
  description = "시작하려면 중앙의 '+' 버튼을 탭하세요.",
}: IndexProps) => {
  return (
    <div className={`h-full flex flex-col justify-center items-center text-center ${className}`}>
      {/* Blob 영역 */}
      <div className="w-30 h-30">
        <Canvas>
          <Blob diaryContent={null} />
        </Canvas>
      </div>

      {/* 설명 텍스트 */}
      <div>
        <h1 className="text-2xl font-bold mb-2 text-black dark:text-white">{title}</h1>
        <p className="text-sm text-stone-500 dark:text-white">{subtitle}</p>
        <p className="text-sm text-stone-500 dark:text-white">{description}</p>
      </div>
    </div>
  );
};

export default Index;
