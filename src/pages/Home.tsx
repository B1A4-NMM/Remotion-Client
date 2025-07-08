//Home.tsx
import { useGetTodayDiary } from "../api/queries/home/useGetHome";
import { useGetDiaryContent } from "../api/queries/home/useGetDiary";

import MonthlyCalendar from '../components/home/Calender';
import MoodCircle from '../components/home/MoodCircle';
import DiaryCards from '../components/home/DiaryCards';

import "../styles/homeCard.css";
import "../styles/moodCircle.css";


/* ─ 1. 샘플 일기 (작성 유도) ─ */
const sampleDiary = {
  id: "sample",
};


const Home = () => {
  const token = localStorage.getItem("accessToken") || "";

  const { data: todayData, isLoading} = useGetTodayDiary(token);

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
      {/* 상단 주간 캘린더 */}
      <MonthlyCalendar />

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
