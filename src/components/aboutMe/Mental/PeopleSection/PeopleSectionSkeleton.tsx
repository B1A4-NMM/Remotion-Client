import React from "react";

const PeopleSectionSkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      {/* 사람 리스트 */}
      <div className="space-y-4 px-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            {/* 순위 */}
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <div className="w-5 h-5 bg-gray-300 rounded"></div>
            </div>

            {/* 프로필 이미지 */}
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>

            {/* 사람 정보 */}
            <div className="flex-1 space-y-2">
              {/* 이름 */}
              <div className="w-24 h-5 bg-gray-200 rounded"></div>
              {/* 관계 */}
              <div className="w-32 h-4 bg-gray-200 rounded"></div>
            </div>

            {/* 영향도 */}
            <div className="text-right space-y-1">
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
              <div className="w-12 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 정보 */}
      <div className="mt-6 px-4">
        <div className="flex justify-between items-center">
          <div className="w-28 h-4 bg-gray-200 rounded"></div>
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default PeopleSectionSkeleton;
