import React, { useState, useRef, useEffect } from "react";
import EmotionSummaryCard from "@/components/analysis/EmotionSummaryCard";
import EmotionSummaryCardSkeleton from "@/components/skeleton/EmotionSummaryCardSkeleton";
import StrengthGraph from "@/components/analysis/StrengthGraph";
import StrengthGraphSkeleton from "@/components/skeleton/StrengthGraphSkeleton";
import { Select } from "@/components/ui/select";
import { ChevronRight, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "@/styles/select.css";
import AnimalCard from "@/components/aboutMe/Emotion/AnimalCard";
import { useGetCharacter } from "@/api/queries/aboutme/useGetCharacter";
import { useGetAuthTest } from "@/api/queries/auth/useGetAuthTest";
import { useNegativeData, usePositiveData } from "@/api/queries/aboutme/useMentalData";
import { useGetStrengthPeriod } from "@/api/queries/aboutme/useGetStrength";
import Index from "@/components/home/Index";

type PeriodType = "daily" | "weekly" | "monthly";

interface PeriodConfig {
  days: number;
  barCount: number;
  label: string;
}

const Analysis = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("daily");
  const [helpOpen, setHelpOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const helpRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const { data: authData } = useGetAuthTest();
  const apiUser = authData?.user;
  const nickname = apiUser?.nickname || "하루뒤";

  const periodConfigs: Record<PeriodType, PeriodConfig> = {
    daily: { days: 7, barCount: 7, label: "일간 (7일)" },
    weekly: { days: 60, barCount: 8, label: "주간 (2개월)" }, // 2개월 = 60일, 8주
    monthly: { days: 180, barCount: 6, label: "월간 (6개월)" }, // 6개월 = 180일, 6개월
  };

  const getPeriodConfig = (period: PeriodType): PeriodConfig => {
    return periodConfigs[period];
  };

  // 데이터 가져오기
  const { data: negativeData, isLoading: isNegativeLoading } = useNegativeData(
    getPeriodConfig(selectedPeriod).days
  );
  const { data: positiveData, isLoading: isPositiveLoading } = usePositiveData(
    getPeriodConfig(selectedPeriod).days
  );
  // 현재 날짜를 기준으로 year, month 계산
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");

  const { data: strengthData, isLoading: isStrengthLoading } = useGetStrengthPeriod(
    currentYear,
    currentMonth
  );
  const { data: characterData, isLoading: isCharacterLoading } = useGetCharacter();

  // 데이터 존재 여부 확인
  const hasNegativeData =
    negativeData &&
    (negativeData.stressTarget?.length > 0 ||
      negativeData.depressionTarget?.length > 0 ||
      negativeData.anxietyTarget?.length > 0 ||
      negativeData.stressDate?.length > 0 ||
      negativeData.depressionDate?.length > 0 ||
      negativeData.anxietyDate?.length > 0);
  const hasPositiveData =
    positiveData &&
    (positiveData.stabilityTarget?.length > 0 ||
      positiveData.bondTarget?.length > 0 ||
      positiveData.vialityTarget?.length > 0 ||
      positiveData.stabilityDate?.length > 0 ||
      positiveData.bondDate?.length > 0 ||
      positiveData.vialityDate?.length > 0);
  const hasStrengthData = strengthData && Object.keys(strengthData.typeCount || {}).length > 0;
  const hasCharacterData =
    characterData?.character &&
    !["NONE", "none", "unknown", "UNKNOWN"].includes(characterData.character);

  // 모든 데이터가 없는지 확인
  const hasNoData = !hasNegativeData && !hasPositiveData && !hasStrengthData && !hasCharacterData;
  const isDataLoading =
    isNegativeLoading || isPositiveLoading || isStrengthLoading || isCharacterLoading;

  // 로딩 상태 시뮬레이션 (실제로는 API 호출 상태에 따라 결정)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [selectedPeriod]);

  // 바깥 클릭 시 도움말 닫기
  useEffect(() => {
    if (!helpOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) {
        setHelpOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [helpOpen]);

  const periodOptions = [
    { value: "daily", label: "일간" },
    { value: "weekly", label: "주간" },
    { value: "monthly", label: "월간" },
  ];

  const onClickHandler = (type: string) => {
    navigate(`/analysis/${type}`);
  };

  const data = useGetCharacter();
  const character = data.data?.character;

  // 모든 분석 데이터가 없으면 Index 컴포넌트 표시
  if (!isDataLoading && hasNoData) {
    return (
      <Index
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        title="분석할 하루가 부족해요 "
        subtitle="나만의 하루를 데이터로 돌아보세요."
        description="시작하려면 중앙의 ‘+’ 버튼을 탭하세요."
      />
    );
  }

  return (
    <div className="px-4 py-5 text-foreground min-h-screen space-y-6">
      {/* 기간 선택 드롭다운 - 감정 데이터가 있을 때만 표시 */}
      {(hasNegativeData || hasPositiveData) && (
        <div className="flex justify-between gap-10">
          <div className="w-80 bg-white rounded-xl z-40 ">
            <Select
              value={selectedPeriod}
              onValueChange={value => setSelectedPeriod(value as PeriodType)}
              options={periodOptions}
              placeholder="기간을 선택하세요"
              className="text-base h-10"
            />
          </div>
          {/* 도움말 버튼 */}
          <div ref={helpRef} className="relative">
            <button
              aria-label="도움말"
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center shadow text-gray-600 text-xl font-bold border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              onClick={() => setHelpOpen(v => !v)}
              type="button"
            >
              <HelpCircle className="w-6 h-6" />
            </button>
            {helpOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-50 text-gray-800 text-base animate-fade-in">
                <div className="font-semibold mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-gray-500" /> 도움말
                </div>
                <div>여기서는 일기에서 나타난 감정들의 상세 분석을 확인할 수 있어요.</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 부정적 감정 - 데이터가 있을 때만 표시 */}
      {hasNegativeData && (
        <section className="bg-white rounded-xl shadow p-5">
          <div className="flex justify-between mb-5">
            <h3 className="text-[21px] font-semibold mb-2 text-gray-800">부정적 감정</h3>
            <div onClick={() => onClickHandler("부정")} className="cursor-pointer">
              <ChevronRight className="text-gray-400" />
            </div>
          </div>
          <div className="overflow-x-auto ">
            {isLoading ? (
              <EmotionSummaryCardSkeleton />
            ) : (
              <EmotionSummaryCard
                key={"부정"}
                type={"부정"}
                period={getPeriodConfig(selectedPeriod).days}
                barCount={getPeriodConfig(selectedPeriod).barCount}
              />
            )}
          </div>
        </section>
      )}

      {/* 긍정적 감정 - 데이터가 있을 때만 표시 */}
      {hasPositiveData && (
        <section className="bg-white rounded-xl shadow p-5">
          <div className="flex justify-between mb-5">
            <h3 className="text-[21px] font-semibold mb-2 text-gray-800">긍정적 감정</h3>
            <div onClick={() => onClickHandler("긍정")} className="cursor-pointer">
              <ChevronRight className="text-gray-400" />
            </div>
          </div>
          <div className="overflow-x-auto pb-2">
            {isLoading ? (
              <EmotionSummaryCardSkeleton />
            ) : (
              <EmotionSummaryCard
                key={"긍정"}
                type={"긍정"}
                period={getPeriodConfig(selectedPeriod).days}
                barCount={getPeriodConfig(selectedPeriod).barCount}
              />
            )}
          </div>
        </section>
      )}

      {/* 강점 - 데이터가 있을 때만 표시 */}
      {hasStrengthData && (
        <section className="bg-white rounded-xl shadow p-5">
          <div className="flex justify-between mb-5">
            <h3 className="text-[21px] font-semibold mb-2 text-gray-800">강점 그래프</h3>
            <div onClick={() => onClickHandler("Strength")} className="cursor-pointer">
              <ChevronRight className="text-gray-400" />
            </div>
          </div>
          {isLoading ? <StrengthGraphSkeleton /> : <StrengthGraph />}
        </section>
      )}

      {/* 캐릭터 - 데이터가 있을 때만 표시 */}
      {hasCharacterData && (
        <section className="bg-white rounded-xl shadow pt-5 pl-5 pr-5">
          <div className="flex justify-between mb-5">
            <h3 className="text-[21px] font-semibold mb-2 text-gray-800">
              {nickname}님의 마음 속 동물
            </h3>
            <div onClick={() => onClickHandler("character")} className="cursor-pointer">
              <ChevronRight className="text-gray-400" />
            </div>
          </div>
          <AnimalCard animalType={character} script="" isMain={true} />
        </section>
      )}
    </div>
  );
};

export default Analysis;
