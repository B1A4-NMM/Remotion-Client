// Home.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useGetDiaryContent } from "../api/queries/home/useGetDiary";
import { useGetDiaryDate } from "../api/queries/home/useGetDiaryDate";
import { useGetHomeData } from "../api/queries/home/useGetHome";
import DiaryCards from "../components/home/DiaryCards";
import Title from "../components/home/Title";
import Index from "../components/home/Index";
import { useNavigate } from "react-router-dom";

import { Canvas } from "@react-three/fiber";

import "../styles/homeCard.css";
import dayjs from "dayjs";
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

  // 새로운 Home API 호출
  const { data: homeData, isLoading: homeLoading, error: homeError } = useGetHomeData(token);

  // 데이터 확인용 console.log
  console.log("=== Home API 데이터 확인 ===");
  console.log("homeData:", homeData);
  console.log("homeLoading:", homeLoading);
  console.log("homeError:", homeError);
  console.log("token:", token);

  if (homeData) {
    console.log("연속 기록:", homeData.continuousWritingDate);
    console.log("이 달의 감정:", homeData.emotionCountByMonth);
    console.log("누적 하루뒤:", homeData.totalDiaryCount);
    console.log("일기 목록:", homeData.diaries);
  }

  const todayDiary = todayData ? todayData : null;

  return (
    <div className="h-screen flex flex-col">
      <Title />

      <DiaryCards />

      {/* <Index className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" /> */}
    </div>
  );
};

export default Home;
