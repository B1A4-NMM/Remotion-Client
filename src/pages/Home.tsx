// Home.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useGetDiaryContent } from "../api/queries/home/useGetDiary";
import { useGetDiaryDate } from "../api/queries/home/useGetDiaryDate";

import DiaryCards from "../components/home/DiaryCards";
import Title from "../components/home/Title";
import Index from "../components/home/Index";
import { useNavigate } from "react-router-dom";

import { Canvas } from "@react-three/fiber";

import "../styles/homeCard.css";
import dayjs from "dayjs";
import Blob from "../components/Blob/Blob";

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

  if (isLoading) {
    return (
      <div className="base flex items-center justify-center min-h-screen">
        <div className="text-white">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="base">
      <Title />

      <Index />
    </div>
  );
};

export default Home;
