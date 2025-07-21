import React from "react";

const StrengthGraphSkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      {/* 헤더 영역 */}
      <div className="flex justify-between items-center mb-4">
        <div className="w-32 h-6 bg-gray-200 rounded"></div>
        <div className="w-16 h-4 bg-gray-200 rounded"></div>
      </div>

      {/* 레이더 차트 영역 */}
      <div className="relative w-full h-64 flex items-center justify-center">
        {/* 중앙 원형 영역 */}
        <div className="absolute w-48 h-48 border-2 border-gray-200 rounded-full"></div>
        <div className="absolute w-36 h-36 border-2 border-gray-200 rounded-full"></div>
        <div className="absolute w-24 h-24 border-2 border-gray-200 rounded-full"></div>
        <div className="absolute w-12 h-12 border-2 border-gray-200 rounded-full"></div>

        {/* 축 라인들 */}
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="absolute w-px h-24 bg-gray-200 origin-center"
            style={{
              transform: `translate(-50%, -50%) rotate(${index * 60}deg)`,
              left: "50%",
              top: "50%",
            }}
          />
        ))}

        {/* 데이터 포인트들 */}
        {Array.from({ length: 6 }).map((_, index) => {
          const angle = index * 60 * (Math.PI / 180);
          const radius = (Math.random() * 0.6 + 0.2) * 48; // 20% ~ 80% of radius
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <div
              key={index}
              className="absolute w-3 h-3 bg-gray-300 rounded-full"
              style={{
                transform: "translate(-50%, -50%)",
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
              }}
            />
          );
        })}

        {/* 축 라벨들 */}
        {Array.from({ length: 6 }).map((_, index) => {
          const angle = index * 60 * (Math.PI / 180);
          const x = Math.cos(angle) * 110; // 48 + 62
          const y = Math.sin(angle) * 110;

          return (
            <div
              key={index}
              className="absolute w-16 h-4 bg-gray-200 rounded"
              style={{
                transform: "translate(-50%, -50%)",
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
              }}
            />
          );
        })}
      </div>

      {/* 하단 정보 */}
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
          <div className="w-20 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="w-24 h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default StrengthGraphSkeleton;
