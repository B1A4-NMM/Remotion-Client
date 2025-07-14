import React, { useState } from "react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

import { useGetDiaryContentResult } from "../api/queries/home/useGetDiary";
import { useGetMemberSummary } from "../api/queries/result/useGetmemSummary";

import ResultHeader from "../components/result/ResultHeader";
import EmotionSummary from "../components/result/EmotionSummary";
import ResultToggle from "../components/result/ResultToggle";
import DiaryView from "../components/result/DiaryView";
import ResultView from "../components/result/ResultView";

import "../styles/resultCard.css";
import "../styles/App.css";

// ✅ 안전한 샘플 데이터
const sampleDiary = {
  writtenDate: "2025-07-13T12:00:00Z",
  date: "2025-07-13T12:00:00Z",
  content: "샘플 일기 내용입니다. 실제 일기가 없을 때 기본으로 보여집니다.",

  activity_analysis: [
    {
      activity: "예시 활동",
      peoples: ["친구1", "친구2"],

      self_emotions: {
        self_emotion: ["기쁨"],
        self_emotion_intensity: [5],
      },

      state_emotions: {
        state_emotion: ["무난"],
        s_emotion_intensity: [3],
      },

      problem: [
        {
          situation: "예시 상황",
          approach: "예시 접근",
          outcome: "예시 결과",
          decision_code: "None",
          conflict_response_code: "None",
        },
      ],

      strength: "팀워크",
    },
  ],

  reflection: {
    achievements: ["오늘 목표 달성!"],
    shortcomings: ["조금 늦잠을 잤음"],
    todo: ["긍정적 태도 유지", "컨디션 관리"],
  },
};

const Result: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const token = localStorage.getItem("accessToken") || "";

  const { data: diaryContent, isLoading, isError } = useGetDiaryContentResult(token, id || "sample");
  const { data: memsummary } = useGetMemberSummary(token);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        일기 내용 로딩 중...
      </div>
    );
  }

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

  const [view, setView] = useState<"record" | "analysis">("record");
  const finalDiaryContent = diaryContent || sampleDiary;

  return (
    <div className="px-4 overflow-hidden">
      {/* ✅ Header */}
      <ResultHeader writtenDate={finalDiaryContent.writtenDate || ""} />

      {/* ✅ Emotion Summary */}
      <EmotionSummary diaryContent={finalDiaryContent} />

      {/* ✅ Toggle */}
      <ResultToggle view={view} setView={setView} />

      {/* ✅ View */}
      {view === "record" ? (
        <DiaryView diaryContent={finalDiaryContent} />
      ) : (
        <ResultView diaryContent={finalDiaryContent} memSummary={memsummary} />
      )}
    </div>
  );
};

export default Result;
