import React from "react";
import { Canvas } from "@react-three/fiber";
import Blob from "../Blob/Blob";

const Index = ({ className = "" }: { className?: string }) => {
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
        <h1 className="text-2xl font-bold mb-2 text-black dark:text-white">하루뒤 시작하기</h1>
        <p className="text-sm text-stone-500 dark:text-white">나만의 하루를 기록해 보세요.</p>
        <p className="text-sm text-stone-500 dark:text-white">
          시작하려면 중앙의 &apos;+&apos; 버튼을 탭하세요.
        </p>
      </div>
    </div>
  );
};

export default Index;
