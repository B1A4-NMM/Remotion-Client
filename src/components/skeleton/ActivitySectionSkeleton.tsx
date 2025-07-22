import React from "react";

const ActivitySectionSkeleton = () => {
  return (
    <div
      className="w-full opacity-10"
      style={{ animation: "custom-pulse 2s ease-in-out infinite" }}
    >
      {/* Legend 스켈레톤 */}
      {/* <div className="absolute top-2 right-4 flex gap-3 z-10 bg-white/80 rounded-lg px-3 py-1 shadow text-xs">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
            <div className="w-8 h-3 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div> */}

      {/* 차트 영역 스켈레톤 */}
      <div className="relative w-full h-[55vh]">
        {/* Y축 라벨들 (왼쪽) */}
        <div className="absolute left-0 top-0 w-24 h-full flex flex-col justify-between py-10">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="w-20 h-4 bg-gray-200 rounded"></div>
          ))}
        </div>

        {/* 바 차트 영역 (오른쪽) */}
        <div className="ml-24 h-full flex flex-col justify-between py-10">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              {/* 바들 (스택 형태) */}
              <div className="flex h-6 space-x-1">
                <div
                  className="bg-gray-200 rounded"
                  style={{
                    width: `${Math.random() * 60 + 20}px`,
                  }}
                ></div>
                <div
                  className="bg-gray-300 rounded"
                  style={{
                    width: `${Math.random() * 80 + 30}px`,
                  }}
                ></div>
                <div
                  className="bg-gray-400 rounded"
                  style={{
                    width: `${Math.random() * 100 + 40}px`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* X축 스켈레톤 */}
        <div className="absolute bottom-0 left-24 right-0 h-8 flex items-center">
          <div className="w-full h-px bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
};

export default ActivitySectionSkeleton;
