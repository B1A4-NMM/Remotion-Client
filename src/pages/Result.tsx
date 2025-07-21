import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import { useGetDiaryContentResult } from "../api/queries/home/useGetDiary";
import { useGetMemberSummary } from "../api/queries/result/useGetmemSummary";
import { useDiaryOwnership } from "../hooks/useDiaryOwnership";

import ResultHeader from "../components/result/ResultHeader";
import EmotionSummary from "../components/result/EmotionSummary";
import ResultToggle from "../components/result/ResultToggle";
import DiaryView from "../components/result/DiaryView";
import ResultView from "../components/result/ResultView";
import ActivityEmotionCard from "../components/result/ActivityEmotionCard";

import "../styles/resultCard.css";
import "../styles/App.css";
import PeopleCard from "@/components/home/PeopleCard";

const Result: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const token = localStorage.getItem("accessToken") || "";
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const view = params.get("view") === "analysis" ? "analysis" : "record";
  const { validateAccess } = useDiaryOwnership();

  const [shouldFade, setShouldFade] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const {
    data: diaryContent,
    isLoading,
    isError,
  } = useGetDiaryContentResult(token, id || "sample");

  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
    };

    checkTouchDevice();
  }, []);

  // 일기 소유권 확인
  useEffect(() => {
    if (diaryContent && !isLoading) {
      const hasAccess = validateAccess(diaryContent);
      if (!hasAccess) {
        // 권한이 없으면 홈으로 리다이렉트
        return;
      }
    }
  }, [diaryContent, isLoading, validateAccess]);

  // 스크롤 상태 감지 (선택사항)
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    const container = document.querySelector(".result-container");
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
      clearTimeout(scrollTimeout);
    };
  }, []);

  useEffect(() => {
    // 페이드 효과 여부 확인
    const fadeFlag = sessionStorage.getItem("shouldFadeFromLoading");

    if (fadeFlag === "true") {
      setShouldFade(true);
      // 플래그 제거
      sessionStorage.removeItem("shouldFadeFromLoading");

      // 페이드 인 효과 시작
      setTimeout(() => {
        setIsVisible(true);
      }, 2000);
    } else {
      // 페이드 효과 없이 즉시 표시
      setIsVisible(true);
    }
  }, []);

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white text-center">
        <div>
          <h2 className="text-xl mb-2">일기를 불러올 수 없습니다</h2>
          <p className="text-gray-300">
            {id ? `일기 ID ${id}를 찾을 수 없습니다.` : "일기 ID가 필요합니다."}
          </p>
        </div>
      </div>
    );
  }

  const finalDiaryContent = diaryContent || null;

  return (
    <div
      className={`result-container  h-screen text-foreground transition-opacity duration-1000 ${
        shouldFade ? "fade-transition" : ""
      } ${isTouchDevice ? "overflow-y-auto scrollbar-hide touch-scroll" : "overflow-y-auto"} ${
        isScrolling ? "scrolling" : ""
      }`}
      style={{
        WebkitOverflowScrolling: isTouchDevice ? "touch" : "auto",
        scrollBehavior: "smooth",
        overscrollBehavior: "contain",
      }}
    >
      {/* ✅ Header - 원래 위치 유지 */}
      {finalDiaryContent && (
        <ResultHeader
          writtenDate={finalDiaryContent.writtenDate || ""}
          diaryId={Number(id)}
          isBookmarked={finalDiaryContent.isBookmarked || false}
        />
      )}

      <div>
        {/* ✅ Emotion Summary */}
        {isLoading ? (
          <div className="flex flex-col items-center text-center space-y-[16px] mb-4">
            <p className="text-sm text-gray-500">하루의 감정</p>
            <div className="w-[130px] h-[130px] bg-gray-200 rounded-full animate-pulse opacity-10"></div>
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse opacity-10"></div>
            <div className="w-24 h-5 bg-gray-200 rounded animate-pulse opacity-10"></div>
          </div>
        ) : finalDiaryContent ? (
          <EmotionSummary diaryContent={finalDiaryContent as any} />
        ) : null}

        {/* ✅ Toggle */}
        <ResultToggle view={view} />

        {/* ✅ View */}
        {view === "record" ? (
          finalDiaryContent ? (
            <DiaryView diaryContent={finalDiaryContent} />
          ) : null
        ) : finalDiaryContent ? (
          <ResultView diaryContent={finalDiaryContent as any} isLoading={isLoading} />
        ) : null}
      </div>
    </div>
  );
};

export default Result;
