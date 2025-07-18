import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import dayjs from "dayjs";

import { useGetDiaryContentResult } from "../api/queries/home/useGetDiary";
import { useGetMemberSummary } from "../api/queries/result/useGetmemSummary";

import ResultHeader from "../components/result/ResultHeader";
import EmotionSummary from "../components/result/EmotionSummary";
import ResultToggle from "../components/result/ResultToggle";
import DiaryView from "../components/result/DiaryView";
import ResultView from "../components/result/ResultView";
import ActivityEmotionCard from "../components/result/ActivityEmotionCard";

import "../styles/resultCard.css";
import "../styles/App.css";
import PeopleCard from "@/components/home/PeopleCard";

// ✅ 안전한 샘플 데이터
const sampleDiary = {
  id: 102,
  writtenDate: "2025-07-14",
  photoPath: [],
  audioPath: null,
  content: "일기를 매일 쓰는거는 쉬운 일이 아니다...",
  latitude: null,
  longitude: null,
  analysis: {
    activity_analysis: [
      {
        activity: "농구하기",
        peoples: [
          {
            name: "도영",
            interactions: {
              emotion: ["string"],
              emotion_intensity: [0],
            },
            name_intimacy: "0.9",
          },
        ],
        self_emotions: {
          emotion: ["string"],
          emotion_intensity: [0],
        },
        state_emotions: {
          emotion: ["string"],
          emotion_intensity: [0],
        },
        problem: [
          {
            situation: "string",
            approach: "string",
            outcome: "string",
            decision_code: "string",
            conflict_response_code: "string",
          },
        ],
        strength: "string",
      },
    ],
    reflection: {
      achievements: ["string"],
      shortcomings: ["string"],
      todo: ["string"],
    },
  },
};

const Result: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const token = localStorage.getItem("accessToken") || "";
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const view = params.get("view") === "analysis" ? "analysis" : "record";

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
    const fadeFlag = sessionStorage.getItem('shouldFadeFromLoading');
    
    if (fadeFlag === 'true') {
      setShouldFade(true);
      // 플래그 제거
      sessionStorage.removeItem('shouldFadeFromLoading');
      
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

  const finalDiaryContent = diaryContent || sampleDiary;

  console.log(finalDiaryContent);

  return (
    <div
      className={`result-container px-4 h-screen text-foreground transition-opacity duration-1000 ${
        shouldFade ? 'fade-transition' : ''
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
      <ResultHeader writtenDate={finalDiaryContent.writtenDate || ""} />

      <div>
        {/* ✅ Emotion Summary */}
        <EmotionSummary diaryContent={finalDiaryContent} isLoading={isLoading} />

        {/* ✅ Toggle */}
        <ResultToggle view={view} />

        {/* ✅ View */}
        {view === "record" ? (
          <DiaryView diaryContent={finalDiaryContent} />
        ) : (
          <ResultView diaryContent={finalDiaryContent} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
};

export default Result;

/* CSS (글로벌 또는 모듈에 추가)
.animate-fade-in {
  animation: fade-in 1s ease;
}
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
*/
