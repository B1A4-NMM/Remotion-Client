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

const StrengthGraph: React.FC<StrengthGraphProps> = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 현재 날짜 정보
  const now = dayjs();
  const year = now.year();
  const currentMonth = now.month() + 1;

  // 지난 달 정보
  const lastMonthDate = now.subtract(1, "month");
  const lastMonth = lastMonthDate.month() + 1;

  // API 호출
  const {
    data: currentData,
    isLoading: currentLoading,
    error: currentError,
  } = useGetStrengthPeriod(year.toString(), currentMonth.toString());

  const {
    data: lastData,
    isLoading: lastLoading,
    error: lastError,
  } = useGetStrengthPeriod(year.toString(), lastMonth.toString());

  // 로딩 상태 처리
  if (currentLoading || lastLoading) {
    return (
      <div className="w-full flex justify-center items-center p-8">
        <p className="text-white">로딩 중...</p>
      </div>
    );
  }

  // 에러 상태 처리
  if (currentError || lastError) {
    return (
      <div className="w-full flex justify-center items-center p-8">
        <p className="text-red-400">
          에러 발생: {currentError?.message || lastError?.message}
        </p>
      </div>
    );
  }

  // 데이터 존재 여부 확인
  if (!currentData || !lastData) {
    return (
      <div className="w-full flex justify-center items-center p-8">
        <p className="text-white">데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="rounded-3xl">
        <div className="flex justify-center mt-2 pb-2">
          <RadarChart
            lastTypeCount={lastData?.typeCount || []}
            currentTypeCount={currentData?.typeCount || []}
          />
        </div>
      </div>
    </div>
  );
};


export default StrengthGraph;
