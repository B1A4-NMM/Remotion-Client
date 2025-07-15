// src/components/result/ResultToggle.tsx

import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "@/styles/togle.css";

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
    <div className="flex justify-center gap-2 mb-10 mt-10">
      <div className="buttonContainer w-fit">
        <button
          className={`button ${view === "record" ? "active" : ""}`}
          onClick={() => handleTabClick("record")}
          aria-label="기록 버튼"
        >
          기록
        </button>
        <button
          className={`button ${view === "analysis" ? "active" : ""}`}
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
