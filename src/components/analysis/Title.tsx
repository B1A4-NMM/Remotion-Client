import React from "react";
import { ChevronLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import "@/styles/togle.css";

const Title = ({
  name,
  isBackActive = false,
  back = "/analysis",
}: {
  name: string;
  isBackActive: boolean;
  back: string;
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const onClickHandler = () => {
    navigate(back);
  };

  // name 길이에 따른 폰트 크기 계산 함수
  const getFontSizeClass = (nameLength: number) => {
    if (nameLength <= 4) return "text-3xl"; // 30px
    if (nameLength <= 6) return "text-2xl"; // 24px
    if (nameLength <= 8) return "text-xl"; // 20px
    if (nameLength <= 10) return "text-lg"; // 18px
    return "text-base"; // 16px
  };

  // 더 세밀한 조정이 필요한 경우 인라인 스타일 사용
  const getFontSize = (nameLength: number) => {
    const baseSize = 32; // text-3xl 기본 크기
    const minSize = 25; // 최소 크기

    if (nameLength <= 8) return baseSize;

    // 4글자 초과 시 1글자당 2px씩 감소
    const reducedSize = baseSize - (nameLength - 4) * 4;
    return Math.max(reducedSize, minSize);
  };

  const isRelation = location.pathname === "/relation";
  const isAnalysis = location.pathname === "/analysis";

  const handleTabClick = (tab: "analysis" | "relation") => {
    navigate(`/${tab}`);
  };

  return (
    <>
      <div className="sticky top-0 z-50 w-full rounded-2xl">
        {/* 메인 헤더 */}

        {isBackActive ? (
          <>
            <div className="flex justify-between items-center px-4 pt-8 pb-4">
              <button onClick={onClickHandler} className="flex items-center gap-1">
                <ChevronLeft className="size-8 text-gray-600" />
              </button>
              <h1
                className={`font-bold text-gray-900 ${getFontSizeClass(name.length)}`}
                style={{ fontSize: `${getFontSize(name.length)}px` }}
              >
                {name}
              </h1>
            </div>
            <h1
              className={`font-bold text-gray-900 ${getFontSizeClass(name.length)}`}
              style={{ fontSize: `${getFontSize(name.length)}px` }}
            >
              {name}
            </h1>
          </>
        ) : (
          <>
            <div className="w-full bg-[#FAF6F4] dark:bg-[#181718] px-4 pt-8 pb-4">
              <h1 className="font-bold text-gray-900 text-3xl">{name}</h1>
            </div>
            <div className="w-full">
              <div className="buttonContainer2 shadow-md mt-3">
                <button
                  className={`button ${isRelation ? "active" : ""}`}
                  onClick={() => handleTabClick("relation")}
                  aria-label="관계 분석"
                >
                  관계
                </button>
                <button
                  className={`button ${isAnalysis ? "active" : ""}`}
                  onClick={() => handleTabClick("analysis")}
                  aria-label="감정 분석"
                >
                  감정
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Title;
