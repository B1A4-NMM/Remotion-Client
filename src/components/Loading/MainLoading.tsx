import { Canvas } from "@react-three/fiber";
import React, { useState } from "react";
import LoadingBlob from "../Blob/Loading/LodingBlob";
import InSideLoading from "./InSideLoading";

const MainLoading = () => {
  const [isComplete, setIsComplete] = useState(false);
  const [shouldMoveBlob, setShouldMoveBlob] = useState(false);

  const handleLoadingComplete = (complete: boolean) => {
    setIsComplete(complete);
  };

  // 1초 후에 블롭 위치 이동
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShouldMoveBlob(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-[100vh] relative overflow-hidden ">
      {/* 블롭 컨테이너 - 중앙에서 시작해서 위쪽으로 이동 */}
      <div
        className={`pointer-events-none transition-all duration-1000 ease-in-out absolute ${
          shouldMoveBlob
            ? "top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            : "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-70 h-70"
        }`}
        style={{
          animation: "fadeIn 2s ease-out forwards",
        }}
      >
        <Canvas camera={{ position: [0, 0, 15], fov: 20 }}>
          <LoadingBlob isComplete={isComplete} />
        </Canvas>
      </div>

      {/* 텍스트 컨테이너 - 블롭 기준으로 위치 조정 */}
      <div className="absolute left-1/2 transform -translate-x-1/2 z-20 text-container ">
        <InSideLoading onComplete={handleLoadingComplete} />
      </div>

      <style>
        {`
          @keyframes fadeIn {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }
          
          /* 블롭 기준 위치 조정 */
          .text-container {

         
            left: 65%;
            height: 300px;
          }
          
          /* 모바일 - 블롭과 더 가깝게 */
          @media (max-width: 768px) {
            .text-container {
              top: 40%;
              width: 100%;
            }
          }
          
          /* 데스크탑 - 블롭과 더 멀게 */
          @media (min-width: 769px) {
            .text-container {
              top: 45%;
              width: 100%;
            }
          }
        `}
      </style>
    </div>
  );
};

export default MainLoading;
