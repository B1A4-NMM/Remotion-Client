import React from "react";

const DiaryCardsSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-[420px] mx-auto">
      {[1, 2, 3].map(index => (
        <div key={index} className="w-full bg-white rounded-lg shadow-md p-3 animate-pulse">
          <div className="grid grid-cols-3 gap-2 rounded-lg mb-2" style={{ height: "120px" }}>
            {/* Blob 스켈레톤 */}
            <div className="col-span-1 h-full">
              <div className="h-full w-full rounded-lg bg-gray-200 flex flex-col items-center justify-center py-2">
                <div className="w-16 h-16 rounded-full bg-gray-300 mb-2"></div>
                <div className="w-12 h-3 bg-gray-300 rounded mb-1"></div>
                <div className="w-16 h-3 bg-gray-300 rounded"></div>
              </div>
            </div>
            {/* 사진 스켈레톤 */}
            <div className="col-span-2 grid grid-cols-2 gap-1 h-full">
              <div className="bg-gray-200 rounded-lg"></div>
              <div className="bg-gray-200 rounded-lg"></div>
            </div>
          </div>
          {/* 텍스트 스켈레톤 */}
          <div className="space-y-2 mb-3">
            <div className="w-full h-4 bg-gray-200 rounded"></div>
            <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
            <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
          </div>
          {/* 하단 스켈레톤 */}
          <div className="flex items-center justify-between">
            <div className="w-20 h-3 bg-gray-200 rounded"></div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DiaryCardsSkeleton;
