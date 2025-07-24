import { usePositiveActData, usePositiveData } from "@/api/queries/aboutme/useMentalData";
import ActivitySection from "@/components/aboutMe/Mental/ActivitySection";
import ActivitySectionSkeleton from "@/components/skeleton/ActivitySectionSkeleton";
import MentalChart from "@/components/aboutMe/Mental/MentalChart";
import MentalChartSkeleton from "@/components/skeleton/MentalChartSkeleton";
import PeopleSection from "@/components/aboutMe/Mental/PeopleSection";
import PeopleSectionSkeleton from "@/components/skeleton/PeopleSectionSkeleton";
import Title from "@/components/analysis/Title";
import { Select } from "@/components/ui/select";
import { useState } from "react";

type PeriodType = "daily" | "weekly" | "monthly";

interface PeriodConfig {
  days: number;
  barCount: number;
  label: string;
}

// 대상(사람) 데이터 추출 함수
const extractPeopleData = (data: any) => {
  if (!data) return [];

  return [
    ...(data.stabilityTarget || []),
    ...(data.bondTarget || []),
    ...(data.vitalityTarget || []),
  ];
};

// 날짜별 데이터 추출 함수
const extractDateData = (data: any) => {
  if (!data) return [];

  return [...(data.stabilityDate || []), ...(data.bondDate || []), ...(data.vitalityDate || [])];
};

// 활동 데이터 추출 함수
const extractActivityData = (data: any) => {
  if (!data) return [];

  return [...(data.stability || []), ...(data.bond || []), ...(data.vitality || [])];
};

const Positive = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("daily");

  const periodConfigs: Record<PeriodType, PeriodConfig> = {
    daily: { days: 7, barCount: 7, label: "일간" },
    weekly: { days: 60, barCount: 8, label: "주간" },
    monthly: { days: 180, barCount: 6, label: "월간" },
  };

  const periodOptions = [
    { value: "daily", label: "일간" },
    { value: "weekly", label: "주간" },
    { value: "monthly", label: "월간" },
  ];

  const getPeriodConfig = (period: PeriodType): PeriodConfig => {
    return periodConfigs[period];
  };

  const period = getPeriodConfig(selectedPeriod).days;
  const barCount = getPeriodConfig(selectedPeriod).barCount;

  // 한 번만 호출 - 모든 긍정적 감정 데이터 포함
  const positiveQuery = usePositiveData(period);
  const positiveActQuery = usePositiveActData(period);

  const isLoading = positiveQuery.isLoading || positiveActQuery.isLoading;

  // 데이터 추출
  const chartData = extractDateData(positiveQuery.data);
  const peopleData = extractPeopleData(positiveQuery.data);
  const activityData = extractActivityData(positiveActQuery.data);

  return (
    <div className="mb-10">
      <Title name="" isBackActive={true} back="/analysis" />
      <div className="px-4 py-8 text-foreground min-h-screen space-y-10">
        {/* 기간 선택 드롭다운 */}
        <div className="flex justify-center mb-8">
          <div className="w-full bg-white rounded-xl z-40">
            <Select
              value={selectedPeriod}
              onValueChange={value => setSelectedPeriod(value as PeriodType)}
              options={periodOptions}
              placeholder="기간을 선택하세요"
              className="font-bold"
            />
          </div>
        </div>

        <section className="bg-white rounded-xl shadow p-6">
          <div className="text-xl font-bold p-3">
            {getPeriodConfig(selectedPeriod).label}별 긍정적 감정 수치
          </div>
          {isLoading ? (
            <MentalChartSkeleton />
          ) : (
            <MentalChart type="긍정" data={chartData} limit={barCount} />
          )}
        </section>

        <section className="bg-white rounded-3xl shadow-xl mb-4 pb-10">
          <div className="text-xl font-bold pt-5 pl-5 pb-2">긍정적 감정별 활동 TOP 10</div>
          <hr className="ml-4 mr-4 mb-6" />
          {isLoading ? (
            <ActivitySectionSkeleton />
          ) : (
            <ActivitySection type="긍정" data={activityData} selectedPeriod={selectedPeriod} />
          )}
        </section>

        <section className="bg-white rounded-3xl shadow-xl mb-4">
          <div className="text-xl font-bold p-3 pb-5 pl-5 mt-3">
            <h1>긍정적 감정에 </h1>
            <h1>가장 큰 영향을 준 사람 TOP 3</h1>
          </div>
          <hr className="ml-4 mr-4" />
          {isLoading ? (
            <PeopleSectionSkeleton />
          ) : (
            <PeopleSection type="긍정" data={peopleData} selectedPeriod={selectedPeriod} />
          )}
        </section>
      </div>
    </div>
  );
};

export default Positive;
