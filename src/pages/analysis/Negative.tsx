import { useMentalData } from "@/api/queries/aboutme/useMentalData";
import ActivitySection from "@/components/aboutMe/Mental/ActivitySection";
import MentalChart from "@/components/aboutMe/Mental/MentalChart";
import PeopleSection from "@/components/aboutMe/Mental/PeopleSection";
import Anxiety from "@/components/analysis/Anxiety";
import Depress from "@/components/analysis/Depress";
import EmotionSummaryCard from "@/components/analysis/EmotionSummaryCard";
import Title from "@/components/analysis/Title";
import LoadingAnimation from "@/components/Loading";
import { Select } from "@/components/ui/select";
import { useState } from "react";

type MentalType = "스트레스" | "불안" | "우울" | "활력" | "안정" | "유대";

const groupMap: Record<string, MentalType[]> = {
  부정: ["스트레스", "우울", "불안"],
  긍정: ["활력", "안정", "유대"],

};

type PeriodType = "daily" | "weekly" | "monthly";

interface PeriodConfig {
  days: number;
  barCount: number;
  label: string;
}


const Negative=()=>{
    const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("daily");
    const periodConfigs: Record<PeriodType, PeriodConfig> = {
        daily: { days: 7, barCount: 7, label: "일간" },
        weekly: { days: 60, barCount: 8, label: "주간" }, // 2개월 = 60일, 8주
        monthly: { days: 180, barCount: 6, label: "월간" }, // 6개월 = 180일, 6개월
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
    const barCount = getPeriodConfig(selectedPeriod).barCount
    const queries = groupMap["부정"].map((emotion: MentalType) => useMentalData(emotion, period));
    const isLoading = queries.some((q) => q.isLoading);
    const data = queries.flatMap((q) => q.data?.date || []);    
    // 모든 감정의 활동/사람 데이터 합치기
    const allActivityData = queries.flatMap((q) => q.data?.activities || []);
    const allPeopleData = queries.flatMap((q) => q.data?.people || []);

    return(
        <div className="mb-10">
            <Title
                name="부정적 감정"
                isBackActive={true}
                back="/analysis"
            />
        <div className="px-4 py-8 text-foreground min-h-screen space-y-10">
            
            {/* 기간 선택 드롭다운 */}
            <div className="flex justify-center mb-8">
                <div className="w-full bg-white rounded-xl">
                <Select
                    value={selectedPeriod}
                    onValueChange={(value) => setSelectedPeriod(value as PeriodType)}
                    options={periodOptions}
                    placeholder="기간을 선택하세요"
                    className="font-bold "
                    />
                </div>
            </div>


            <section className="bg-white rounded-xl shadow p-6">
                <div className="text-xl font-bold p-3"> {getPeriodConfig(selectedPeriod).label}별 부정적 감정 수치</div>
                    {isLoading ? (
                        <LoadingAnimation />
                    ) : (
                        <MentalChart type="부정" data={data} limit={barCount}/>
                    )}
            </section>
            <section className="bg-white rounded-3xl shadow-xl mb-4 pb-10">
                <div className="text-xl font-bold pt-5 pl-5 pb-2"> 부정적 감정별 활동 TOP 10</div>
                <hr className="ml-4 mr-4 mb-6"/>
                    {isLoading?(
                        <LoadingAnimation/>
                    ):(
                        <ActivitySection type="부정" data={allActivityData} selectedPeriod={selectedPeriod}/>
                    )}
            </section>
            <section className="bg-white rounded-3xl shadow-xl mb-4">
                <div className="text-xl font-bold p-3 pb-5 pl-5 mt-10"> 부정적 감정에 가장 큰 영향을 준 사람 TOP 3</div>
                <hr className="ml-4 mr-4 "/>
                    <PeopleSection type="부정" data={allPeopleData} selectedPeriod={selectedPeriod}/>
            </section>
        </div>
    </div>
    )
}

export default Negative;