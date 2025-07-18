// Home.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useGetDiaryContent } from "../api/queries/home/useGetDiary";
import { useGetDiaryDate } from "../api/queries/home/useGetDiaryDate";
import { useGetHomeData } from "../api/queries/home/useGetHome";
import DiaryCards from "../components/home/DiaryCards";
import Title from "../components/home/Title";
import Index from "../components/home/Index";
import { useNavigate } from "react-router-dom";
import Map from "./Map";

import { Canvas } from "@react-three/fiber";

import "../styles/homeCard.css";
import dayjs from "dayjs";
import Blob from "../components/Blob/Blob";
import { useDeleteDiary } from "../api/queries/home/useDeleteDiary";
import { useInfiniteDiaries } from "../api/queries/home/useInfiniteDiaries";
import { useQueryClient } from "@tanstack/react-query";
import { usePatchDiaryBookmark } from "../api/queries/home/usePatchDiaryBookmark";
// import RecommendHome from "@/components/home/RecommendHome";
import RecommendHomeCard from "@/components/home/RecommendHomeCard";

// S3 → http 변환 (실제 CDN 도메인에 맞게 수정 필요)
const s3ToHttpUrl = (s3Path: string) =>
  s3Path.replace("s3://remotion-photo/", "https://cdn.example.com/");

// API 응답 → DiaryCards 변환
function mapApiDiaryToDiaryCard(apiDiary: any) {
  return {
    id: apiDiary.diaryId,
    emotion: apiDiary.emotions?.[0]?.emotionType || "",
    emotions: apiDiary.emotions || [], // [{emotionType, intensity}] 배열 그대로 전달
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
  const [selectedTab, setSelectedTab] = useState<"menu" | "location" | "search">("menu");

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

  const queryClient = useQueryClient();
  const deleteDiaryMutation = useDeleteDiary();
  const patchBookmark = usePatchDiaryBookmark();

  const handleDeleteDiary = (diaryId: number) => {
    const token = localStorage.getItem("accessToken") || "";
    deleteDiaryMutation.mutate(
      { token, diaryId: String(diaryId) },
      {
        onSuccess: () => {
          // useInfiniteDiaries의 query key와 동일하게 맞춤
          queryClient.invalidateQueries({ queryKey: ["infiniteDiaries"] });
        },
      }
    );
  };

  const handleToggleBookmark = (diaryId: number) => {
    const token = localStorage.getItem("accessToken") || "";
    const diary = infiniteDiaries.find(d => d.id === diaryId);
    if (!diary) return;
    patchBookmark.mutate(
      { token, diaryId, isBookmarked: !diary.bookmarked },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["infiniteDiaries"] });
        },
      }
    );
  };

  // 무한스크롤용 react-query
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteDiaries();
  // observer ref
  const observer = useRef<IntersectionObserver | null>(null);
  const lastDiaryRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );
  // 무한스크롤 diaries
  const infiniteDiaries =
    data?.pages.flatMap(page => page.item.diaries.map(mapApiDiaryToDiaryCard)) ?? [];

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

  const todayDiary = todayData ? todayData : null;

  return (
    <div className="flex flex-col px-4 text-foreground min-h-screen">
      <Title
        emotionCountByMonth={emotionCountByMonth}
        totalDiaryCount={totalDiaryCount}
        continuousWritingDate={continuousWritingDate}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      {selectedTab === "menu" && (
        <>
          {homeData?.item?.diaries && homeData.item.diaries.length > 0 ? (
            <>
              <RecommendHomeCard />
              <DiaryCards
                diaries={infiniteDiaries}
                onDeleteDiary={handleDeleteDiary}
                onToggleBookmark={handleToggleBookmark}
                lastItemRef={lastDiaryRef}
              />
            </>
          ) : (
            <Index className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          )}
        </>
      )}
      {selectedTab === "location" && (
        <Map
          continuousWritingDate={continuousWritingDate}
          emotionCountByMonth={emotionCountByMonth}
          totalDiaryCount={totalDiaryCount}
        />
      )}
    </div>
  );
};

export default Home;
