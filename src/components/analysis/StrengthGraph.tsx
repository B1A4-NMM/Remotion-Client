import React, { useState } from "react";
import "@/styles/radarChart.css";
import { ChevronRight, Trophy, Award, Medal } from "lucide-react";
import { useGetStrength, useGetStrengthPeriod } from "@/api/queries/aboutme/useGetStrength";
import type { DetailStrength } from "@/types/strength";
import { useNavigate } from "react-router-dom";
import RadarChart from "@/components/analysis/Strength/HexRadarChart";
import dayjs from "dayjs";

interface StrengthData {
  label: string;
  value: number;
}

interface StrengthGraphProps {
  userName?: string;
  currentData?: StrengthData[];
  averageData?: StrengthData[];
}

const API_TO_DISPLAY_LABEL_MAP: Record<string, string> = {
  지혜: "지혜",
  용기: "도전",
  정의: "정의",
  인애: "배려",
  절제: "절제",
  초월: "긍정",
};

const StrengthGraph: React.FC<StrengthGraphProps> = ({ userName = "User Name" }) => {
  const token = localStorage.getItem("accessToken") || "";

  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 현재 날짜 정보
  const now = dayjs();
  const currentYear = now.year();
  const currentMonth = now.month() + 1; // dayjs month는 0부터 시작하므로 +1

  // 지난 달 정보
  const lastMonthDate = now.subtract(1, "month");
  const lastYear = lastMonthDate.year();
  const lastMonth = lastMonthDate.month() + 1;

  // API 호출
  const {
    data: currentData,
    isLoading: currentLoading,
    error: currentError,
  } = useGetStrengthPeriod("2024", "09");

  const {
    data: lastData,
    isLoading: lastLoading,
    error: lastError,
  } = useGetStrengthPeriod("2024", "08");

  // 로딩 상태 체크
  if (currentLoading || lastLoading) {
    return <div>로딩 중...</div>;
  }

  // 에러 체크
  if (currentError || lastError) {
    return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
  }

  // ✅ onClickHandler 함수 올바르게 닫기
  const onClickHandler = () => {
    navigate("/analysis/strength");
  };

  // API label → Display label 변환
  const apiToDisplay = (apiLabel: string) => API_TO_DISPLAY_LABEL_MAP[apiLabel];
  const displayToApi = (displayLabel: string) =>
    Object.entries(API_TO_DISPLAY_LABEL_MAP).find(([, d]) => d === displayLabel)?.[0] || "";

  const lastDetailData: DetailStrength | null =
    selectedCategory && lastData?.detailCount
      ? (lastData.detailCount[displayToApi(selectedCategory)] ?? null)
      : null;

  const currentDetailData: DetailStrength | null =
    selectedCategory && currentData?.detailCount
      ? (currentData.detailCount[displayToApi(selectedCategory)] ?? null)
      : null;

  return (
    <div className="w-full">
      {/* 메인 컨테이너 */}
      <div className="rounded-3xl shadow-xl bg-white">
        {/* 헤더 */}
        <div className="flex justify-between pt-3 ml-6 mr-5 mb-1">
          <h1 className="text-lg font-bold text-gray-900">{userName}의 강점 그래프</h1>
          <div onClick={onClickHandler} className="cursor-pointer">
            <ChevronRight className="text-gray-400" />
          </div>
        </div>

        <hr className="mr-5 ml-5" />

        <div className="flex justify-center mt-2 pb-2">
          {currentLoading && <p className="text-white">로딩 중...</p>}
          {currentError && <p className="text-red-400">에러 발생: {`${currentError}`}</p>}

          {/* ✅ 데이터 존재 여부 확인 추가 */}
          {currentData && lastData && (
            <RadarChart
              lastTypeCount={lastData.typeCount}
              currentTypeCount={currentData.typeCount}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StrengthGraph;
