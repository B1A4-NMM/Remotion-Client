import React from 'react';
import { useTheme } from './theme-provider';

const LoadingAnimation = () => {

  return (
    <div className="flex flex-col items-center justify-start h-full pt-4">
      {/* 원형 회전 애니메이션 */}
      <div className="relative w-12 h-12 mb-4">
        {/* 중심점 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1 h-1 bg-transparent rounded-full"></div>
        </div>
        
        {/* 회전하는 점들 */}
        <div className="absolute inset-0 animate-spin">
          {/* 12시 방향 */}
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-500 rounded-full transform -translate-x-1/2"></div>
          {/* 3시 방향 */}
          <div className="absolute top-1/2 right-0 w-2 h-2 bg-blue-400 rounded-full transform -translate-y-1/2"></div>
          {/* 6시 방향 */}
          <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-blue-300 rounded-full transform -translate-x-1/2"></div>
          {/* 9시 방향 */}
          <div className="absolute top-1/2 left-0 w-2 h-2 bg-blue-200 rounded-full transform -translate-y-1/2"></div>
        </div>
      </div>
      
      {/* 로딩 텍스트 */}
      <span className="text-gray-800 font-medium text-center">
        데이터를 분석하고 있습니다...
      </span>
    </div>
  );
};

export default LoadingAnimation;
