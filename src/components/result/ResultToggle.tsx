// src/components/result/ResultToggle.tsx

import React from "react";
import { useNavigate, useParams } from "react-router-dom";

interface ResultToggleProps {
  view: "record" | "analysis";
}

const ResultToggle: React.FC<ResultToggleProps> = ({ view }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleTabClick = (tab: "record" | "analysis") => {
    if (id) {
      navigate(`/result/${id}?view=${tab}`);
    }
  };

  return (
    <div className="flex justify-center mb-8 mt-8">
      <div className="relative grid grid-cols-2 w-fit max-w-[400px] rounded-full bg-white p-1 shadow-lg">
        <button
          className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ease-in-out ${
            view === "record"
              ? "bg-black text-white border-2 border-white"
              : "bg-white text-black border-2 border-white"
          }`}
          onClick={() => handleTabClick("record")}
          aria-label="일기 버튼"
        >
          일기
        </button>
        <button
          className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ease-in-out ${
            view === "analysis"
              ? "bg-black text-white border-2 border-white"
              : "bg-white text-black border-2 border-white"
          }`}
          onClick={() => handleTabClick("analysis")}
          aria-label="분석 버튼"
        >
          분석
        </button>
      </div>
    </div>
  );
};

export default ResultToggle;
