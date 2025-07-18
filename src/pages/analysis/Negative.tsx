import { useMentalData } from "@/api/queries/aboutme/useMentalData";
import ActivitySection from "@/components/aboutMe/Mental/ActivitySection";
import MentalChart from "@/components/aboutMe/Mental/MentalChart";
import PeopleSection from "@/components/aboutMe/Mental/PeopleSection";
import Anxiety from "@/components/analysis/Anxiety";
import Depress from "@/components/analysis/Depress";
import EmotionSummaryCard from "@/components/analysis/EmotionSummaryCard";
import Title from "@/components/analysis/Title";
import LoadingAnimation from "@/components/Loading";
import { useState } from "react";

type MentalType = "스트레스" | "불안" | "우울";

const groupMap: Record<string, MentalType[]> = {
  부정: ["스트레스", "우울", "불안"],
};

const Negative=()=>{
    const period = 30; // 예시: 최근 7일
    const emotions: MentalType[] = ["스트레스", "우울", "불안"];
    const queries = emotions.map((emotion) => useMentalData(emotion, period));
    const isLoading = queries.some((q) => q.isLoading);
    // 날짜별 데이터는 모두 합쳐서 사용
    const dateData = queries.flatMap((q) => q.data?.date || []);
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
            <div className="pl-3 pr-3">
                <div className="bg-white rounded-3xl shadow-xl mb-4">
                    <div className="text-xl font-bold p-3"> 일자별 부정적 감정 수치</div>
                    {isLoading ? (
                    <LoadingAnimation />
                    ) : (
                    <MentalChart
                        type="부정"
                        data={dateData}
                        limit={10}/>
                    )}
                </div>
                <div className="bg-white rounded-3xl shadow-xl mb-4">
                    <div className="text-xl font-bold pt-5 pl-5 pb-2"> 부정적 감정별 활동 TOP 10</div>
                        <ActivitySection type="부정" data={allActivityData} />
                    <div className="text-xl font-bold pt-5 pl-5 mt-10"> 부정적 감정에 가장 큰 영향을 준 사람 TOP 3</div>
                        <PeopleSection type="부정" data={allPeopleData} />
                </div>
            </div>
        </div>
    )
}

export default Negative;