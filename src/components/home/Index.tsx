import React from "react";
import { Canvas } from "@react-three/fiber";
import Blob from "../Blob/Blob";

const Index = () => {
  return (
    <div>
      <div className="container">
        <Canvas>
          <Blob diaryContent={null} />
        </Canvas>
      </div>
      <div className="z-40 flex justify-center ">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-5"> 하루뒤 시작하기</h1>
          <p className="text-xm text-stone-500"> 나만의 하루를 기록해 보세요.</p>
          <p className="text-xm text-stone-500"> 시작하려면 중앙의 '+' 버튼을 탭하세요.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
