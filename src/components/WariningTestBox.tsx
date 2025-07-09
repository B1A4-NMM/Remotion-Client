// components/result/WarningTestBox.tsx
import { Button } from "./ui/button";

type WarningTestBoxProps = {
  type: "stress" | "anxiety" | "depression";
  onClick: (type: "stress" | "anxiety" | "depression") => void;
};

const typeToMessage: Record<string, string> = {
  stress: "최근 스트레스 지수가 높게 나타났어요.",
  anxiety: "불안도가 높아요. 마음의 긴장을 풀어볼까요?",
  depression: "우울감이 감지되었어요. 내 감정을 살펴봐요.",
};

const WarningTestBox = ({ type, onClick }: WarningTestBoxProps) => {
  return (
    <div className="bg-[#5c5b5b] p-4 mt-4 rounded-lg mb-4 text-white shadow-md">
      <p className="mb-3 text-sm">{typeToMessage[type]}</p>
      <Button onClick={() => onClick(type)} variant="secondary">
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
