import React from "react";

const MentalChartSkeleton = () => {
  return (
    <div
      className="w-full opacity-10"
      style={{ animation: "custom-pulse 2s ease-in-out infinite" }}
    >
      {/* 헤더 영역 */}
      <div className="flex justify-between items-center mb-4">
        <div className="w-32 h-6 bg-gray-200 rounded"></div>
        <div className="w-16 h-4 bg-gray-200 rounded"></div>
      </div>

      {/* 차트 영역 */}
      <div className="space-y-3">
        {/* 바 차트 영역 */}
        <div className="flex items-end justify-between h-32 px-2">
          {[20, 75, 45, 90, 30, 65, 40].map((height, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              {/* 바 */}
              <div
                className="w-8 bg-gray-200 rounded-t"
                style={{
                  height: `${height}%`,
                  minHeight: "16px",
                }}
              ></div>
              {/* 라벨 */}
              <div className="w-12 h-3 bg-gray-200 rounded text-xs"></div>
            </div>
          ))}
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
    </div>
  );
};

export default MentalChartSkeleton;
