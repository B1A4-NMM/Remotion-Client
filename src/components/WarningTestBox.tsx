// components/result/WarningTestBox.tsx

import React from "react";
import { Button } from "./ui/button";

type WarningTestBoxProps = {
  type: "stress" | "anxiety" | "depression";
  onClick: (type: "stress" | "anxiety" | "depression") => void;
};

const typeToMessage: Record<string, string> = {
  stress: "최근 7일간 스트레스 지수가 지속적으로 높게 나타났어요.\n마음의 상태를 점검해보시겠어요?",
  anxiety: "최근 7일간 불안도가 높게 유지되고 있어요.\n마음의 긴장을 풀어볼까요?",
  depression: "최근 7일간 지속적으로 우울감이 감지되었어요.\n내 감정을 살펴봐요.",
};

const WarningTestBox = ({ type, onClick }: WarningTestBoxProps) => {
  return (
    <div className="bg-[#ffffff] dark:bg-[#4A3551] p-4 rounded-lg text-black dark:text-white shadow-md">
      <p className="mb-3 text-base whitespace-pre-line">{typeToMessage[type]}</p>
      <Button
        onClick={() => onClick(type)}
        className="bg-[#ef7c80] dark:bg-gray-700 text-white hover:bg-[#e06b6f] dark:hover:bg-gray-600"
      >
        {type === "stress"
          ? "스트레스 자가검진 "
          : type === "anxiety"
            ? "불안 자가검진 "
            : type === "depression"
              ? "우울 자가검진 "
              : "테스트 해보기"}
      </Button>
    </div>
  );
};

export default WarningTestBox;
