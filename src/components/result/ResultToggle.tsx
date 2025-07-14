// src/components/result/ResultToggle.tsx

import React from "react";
import { Button } from "../ui/button";

interface ResultToggleProps {
  view: "record" | "analysis";
  setView: (v: "record" | "analysis") => void;
}

const ResultToggle: React.FC<ResultToggleProps> = ({ view, setView }) => {
  return (
    <div className="flex justify-center gap-2 mb-6">
      <Button
        variant={view === "record" ? "default" : "secondary"}
        onClick={() => setView("record")}
      >
        기록
      </Button>
      <Button
        variant={view === "analysis" ? "default" : "secondary"}
        onClick={() => setView("analysis")}
      >
        분석
      </Button>
    </div>
  );
};

export default ResultToggle;
