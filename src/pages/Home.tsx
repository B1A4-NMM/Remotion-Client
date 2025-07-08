//Home.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useGetDiaryContent } from "../api/queries/home/useGetDiary";

import MonthlyCalendar from '../components/home/Calender';
import MoodCircle from '../components/home/MoodCircle';
import DiaryCards from '../components/home/DiaryCards';

import {useGetDiaryDate} from '../api/queries/home/useGetDiaryDate'

import "../styles/homeCard.css";
import "../styles/moodCircle.css";
import dayjs from "dayjs";


/* ─ 1. 샘플 일기 (작성 유도) ─ */
const sampleDiary = {
  id: "sample",
};


const Home = () => {
  const token = localStorage.getItem("accessToken") || "";

  const [selectedDate, setSelectedDate] = useState<Date>(dayjs().toDate());  
  const [errorMessage , setErrorMessage] = useState<string>("");

  const handleDateSelect = useCallback((date: Date) => {
    const selectedDate = dayjs(date);
    const currentDate = dayjs();
  
    if (selectedDate.isAfter(currentDate, 'day')) {
      setErrorMessage("해당 날짜로는 이동할 수 없습니다.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
  
    setSelectedDate(date);  // Date 객체 그대로 저장
    setErrorMessage("");
  }, []);
  
  // API 호출 시 string 변환
  const { data: todayData, isLoading } = useGetDiaryDate(
    token, 
    dayjs(selectedDate).format("YYYY-MM-DD")  // 🔥 사용 시점에 변환
  );

  const todayDiary = todayData? todayData : null;


  /* ─ 2. 오늘 일기 상세 내용 가져오기 ─ */
  const {
    data: diaryContent,
    isLoading: isContentLoading,
    isError: isContentError,
  } = useGetDiaryContent(
    token,
    todayDiary?.todayDiaries?.[0]?.diaryId?.toString() || "sample");

  const hasTodayDiary= todayDiary?.todayDiaries?.length? true: false;


  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="base flex items-center justify-center min-h-screen">
        <div className="text-white">로딩 중...</div>
      </div>
    );
  }


  return (
    <div className="base">

      {/* 오류 메시지 표시 */}
      {errorMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 bg-red-500 text-white rounded-lg shadow-lg animate-pulse">
          {errorMessage}
        </div>
      )}
      {/* 상단 주간 캘린더 */}
      <MonthlyCalendar onDateSelect={handleDateSelect} selectedDate={selectedDate}/>

      {/* MoodCircle*/}
      <MoodCircle
        hasTodayDiary={hasTodayDiary}
        todayDiary={todayDiary}
      />
      {/* 하단 일기 카드들 */}
      <DiaryCards
        hasTodayDiary={hasTodayDiary}
        todayDiary={todayDiary}
        diaryContent={diaryContent}
        isContentLoading={isContentLoading}
        isContentError={isContentError}
      />
    </div>
  );
};

export default Home;
