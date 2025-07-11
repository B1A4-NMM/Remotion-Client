// Home.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useGetDiaryContent } from "../api/queries/home/useGetDiary";
import { useGetDiaryDate } from "../api/queries/home/useGetDiaryDate";

import MonthlyCalendar from "../components/home/Calender";
import MoodCircle from "../components/home/MoodCircle";
import MoodBack from "../components/home/MoodBack";
import DiaryCards from "../components/home/DiaryCards";

import { useNavigate } from "react-router-dom";

import { Canvas } from "@react-three/fiber";

import "../styles/homeCard.css";
import "../styles/moodCircle.css";
import "../styles/moodback.css";
import dayjs from "dayjs";
import Waveback from "../components/home/WaveBack";
import Blob from "../components/home/Blob/Blob";

const Home = () => {
  const token = localStorage.getItem("accessToken") || "";
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState<Date>(dayjs().toDate());
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleDateSelect = useCallback((date: Date) => {
    const selected = dayjs(date);
    const current = dayjs();

    if (selected.isAfter(current, "day")) {
      setErrorMessage("해당 날짜로는 이동할 수 없습니다.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    setSelectedDate(date);
    setErrorMessage("");
  }, []);

  // API 호출 시 string 변환
  const { data: todayData, isLoading } = useGetDiaryDate(
    token,
    dayjs(selectedDate).format("YYYY-MM-DD")
  );

  const todayDiary = todayData ? todayData : null;

  const {
    data: diaryContent,
    isLoading: isContentLoading,
    isError: isContentError,
  } = useGetDiaryContent(token, todayDiary?.todayDiaries?.[0]?.diaryId?.toString() || "sample");

  const hasTodayDiary = todayDiary?.todayDiaries?.length ? true : false;

  if (isLoading) {
    return (
      <div className="base flex items-center justify-center min-h-screen">
        <div className="text-white">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="base">
      { /* 무드 배경 */}
      {/* <MoodBack diaryContent={diaryContent} /> */}

      {/* 오류 메시지 표시 */}
      {errorMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 bg-red-500 text-white rounded-lg shadow-lg animate-pulse">
          {errorMessage}
        </div>
      )}

      {/* 상단 주간 캘린더 */}
      <MonthlyCalendar onDateSelect={handleDateSelect} selectedDate={selectedDate} />

      {/* MoodCircle */}
      {/* <MoodCircle
        hasTodayDiary={hasTodayDiary}
        todayDiary={todayDiary}
        onClickWrite={() => {
          const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
          navigate(`/diary/${formattedDate}`);
        }}
        /> */}

      <div className="container">
        <Canvas>
          <Blob diaryContent={diaryContent}/>
        </Canvas>
      </div>


      {/* 하단 일기 카드들 */}
      {/* <DiaryCards
        hasTodayDiary={hasTodayDiary}
        todayDiary={todayDiary}
        diaryContent={diaryContent}
        isContentLoading={isContentLoading}
        isContentError={isContentError}
      /> */}
      {/* <Waveback diaryContent={diaryContent} /> */}
    </div>
  );
};

export default Home;
