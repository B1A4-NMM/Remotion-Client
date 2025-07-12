import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';  // React Router import 추가
import "../../styles/recommend-button.css";  // 수정된 CSS 파일로 변경

const Title = () => {
  const navigate = useNavigate();
  const location = useLocation();  // 현재 경로 확인용

  // 현재 경로에 따라 활성 버튼 판단
  const isRoutineActive = location.pathname === '/routine';
  const isContentsActive = location.pathname === '/contents';

  const handleRoutineClick = () => {
    if (!isRoutineActive) {  // 이미 루틴 페이지라면 이동하지 않음
      navigate('/routine');
    }
  };

  const handleContentsClick = () => {
    if (!isContentsActive) {  // 이미 컨텐츠 페이지라면 이동하지 않음
      navigate('/contents');
    }
  };

  return (
    <div className="absolute top-10 left-0 w-full z-50">
      {/* 메인 헤더 */}
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-4xl font-bold text-gray-900 ml-2">추천</h1>
      </div>

      {/* 버튼 위치 - 두 개의 버튼으로 변경 */}
      <div className="buttonContainer">
        <button
          className={`button ${isRoutineActive ? 'active' : ''}`}
          onClick={handleRoutineClick}
          aria-label="루틴 버튼"
        >
          루틴
        </button>
        <button
          className={`button ${isContentsActive ? 'active' : ''}`}
          onClick={handleContentsClick}
          aria-label="컨텐츠 버튼"
        >
          컨텐츠
        </button>
      </div>
    </div>
  );
};

export default Title;
