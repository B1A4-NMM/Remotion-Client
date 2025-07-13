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
import Blob from "../components/Blob/Blob";

const mockDiaries = [
  {
    id: 101,
    emotion: "sad",
    emotions: ["우울", "피곤", "불안"],
    targets: ["나"],
    activities: ["혼자 산책", "음악 듣기"],
    photoUrl: null,
    map: null,
    content: "오늘은 하루 종일 기운이 없었다. 혼자 산책을 하며 마음을 달래보았다.",
    date: "2024-07-01",
    keywords: ["산책", "휴식"],
    behaviors: ["걷기"],
    bookmarked: false,
  },
  {
    id: 102,
    emotion: "angry",
    emotions: ["분노", "짜증"],
    targets: ["상사"],
    activities: ["회의", "심호흡"],
    photoUrl: null,
    map: null,
    content: "회의 중에 상사와 의견 충돌이 있었다. 심호흡을 하며 진정하려고 노력했다.",
    date: "2024-07-02",
    keywords: ["회의", "감정조절"],
    behaviors: ["심호흡"],
    bookmarked: true,
  },

  {
    id: 106,
    emotion: "proud",
    emotions: ["자긍심", "뿌듯함"],
    targets: ["나"],
    activities: ["프로젝트 마무리"],
    photoUrl:
      "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=400&q=80",
    map: null,
    content: "긴 프로젝트를 드디어 마무리했다. 스스로에게 조금은 자랑스러운 하루였다.",
    date: "2024-07-06",
    keywords: ["성취", "완료"],
    behaviors: ["집중", "회고"],
    bookmarked: true,
  },

  {
    id: 108,
    emotion: "excited",
    emotions: ["설렘", "기대", "행복"],
    targets: ["친구", "가족", "동료", "선생님"],
    activities: ["여행", "사진찍기", "탐험", "맛집탐방"],
    photoUrl: [
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    ],
    map: null,
    content: "친구들과 여행을 가서 정말 신나고 즐거운 추억을 만들었다.",
    date: "2024-07-08",
    keywords: ["여행", "추억"],
    behaviors: ["사진찍기", "탐험"],
    bookmarked: true,
  },
];

// S3 → http 변환 (실제 CDN 도메인에 맞게 수정 필요)
const s3ToHttpUrl = (s3Path: string) =>
  s3Path.replace("s3://remotion-photo/", "https://cdn.example.com/");

// API 응답 → DiaryCards 변환
function mapApiDiaryToDiaryCard(apiDiary: any) {
  return {
    id: apiDiary.diaryId,
    emotion: apiDiary.emotions[0] || "",
    emotions: apiDiary.emotions,
    targets: apiDiary.targets,
    activities: apiDiary.activities,
    photoUrl: Array.isArray(apiDiary.photoPath)
      ? apiDiary.photoPath.map(s3ToHttpUrl)
      : apiDiary.photoPath
        ? [s3ToHttpUrl(apiDiary.photoPath)]
        : [],
    map:
      apiDiary.latitude && apiDiary.longitude
        ? { lat: apiDiary.latitude, lng: apiDiary.longitude }
        : null,
    content: apiDiary.content,
    date: apiDiary.writtenDate,
    keywords: [],
    behaviors: [],
    bookmarked: apiDiary.isBookmarked,
  };
}

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

  // DiaryCards용 데이터 변환
  const emotionCountByMonth = homeData?.item?.emotionCountByMonth ?? 0;
  const totalDiaryCount = homeData?.item?.totalDiaryCount ?? 0;
  const continuousWritingDate = homeData?.item?.continuousWritingDate ?? 0;
  const diaries = homeData?.item?.diaries?.map(mapApiDiaryToDiaryCard) || [];

  // 데이터 확인용 console.log
  console.log("=== Home API 데이터 확인 ===");
  console.log("homeData:", homeData);
  console.log("homeLoading:", homeLoading);
  console.log("homeError:", homeError);
  console.log("token:", token);

  const todayDiary = todayData ? todayData : null;

  return (
    <div className="h-screen flex flex-col">
      <Title
        emotionCountByMonth={emotionCountByMonth}
        totalDiaryCount={totalDiaryCount}
        continuousWritingDate={continuousWritingDate}
      />
      <DiaryCards diaries={diaries} />
      {/* <Index className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" /> */}
    </div>
  );
};

export default Home;
