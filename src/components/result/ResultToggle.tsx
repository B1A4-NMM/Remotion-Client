// src/components/result/ResultToggle.tsx

import React from "react";
import "@/styles/togle.css"

interface ResultToggleProps {
  view: "record" | "analysis";
  setView: (v: "record" | "analysis") => void;
}

const ResultToggle: React.FC<ResultToggleProps> = ({ view, setView }) => {
  // 현재 경로에 따라 활성 버튼 판단
  const isRecordActive = view === 'record';
  const isAnalysisActive = view === 'analysis';

  const handleRoutineClick = () => {
    if (!isRecordActive) {  // 이미 루틴 페이지라면 이동하지 않음
      setView('record');
    }
  };

  const handleContentsClick = () => {
    if (!isAnalysisActive) {  // 이미 컨텐츠 페이지라면 이동하지 않음
      setView('analysis');
    }
  };


  return (
    <div className="flex justify-center gap-2 mb-10 mt-10">

      <div className="buttonContainer w-fit">
        <button
          className={`button ${isRecordActive ? 'active' : ''}`}
          onClick={handleRoutineClick}
          aria-label="기록 버튼"
        >
          기록
        </button>
        <button
          className={`button ${isAnalysisActive ? 'active' : ''}`}
          onClick={handleContentsClick}
          aria-label="분석 버튼"
        >
          분석
        </button>
      </div>
    </div>
  );
};

export default ResultToggle;
