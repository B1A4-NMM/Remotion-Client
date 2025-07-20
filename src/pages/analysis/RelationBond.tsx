import { useMentalData } from "@/api/queries/aboutme/useMentalData";
import ActivitySection from "@/components/aboutMe/Mental/ActivitySection";
import MentalChart from "@/components/aboutMe/Mental/MentalChart";
import PeopleSection from "@/components/aboutMe/Mental/PeopleSection";
import EmotionSummaryCard from "@/components/analysis/EmotionSummaryCard";
import Title from "@/components/analysis/Title";

const RelationBond = () => {
  const { data } = useMentalData("유대", 365);
  return (
    <div className="mb-10">
      <Title name="유대" isBackActive={true} back="/analysis" />
      <div className="pl-3 pr-3">
        <div className="bg-white rounded-3xl shadow-xl mb-4">
          <div className="text-xl font-bold p-3"> 일자별 유대 수치</div>
          <MentalChart type="유대" data={data?.date ?? []} limit={10} />
        </div>
        <div className="bg-white rounded-3xl shadow-xl mb-4">
          <div className="text-xl font-bold pt-5 pl-5 pb-2"> 유대를 느낀 활동</div>
          <ActivitySection type="유대" data={data?.activities ?? []} />
          <div className="text-xl font-bold pt-5 pl-5 mt-10"> 유대에 영향을 준 사람들</div>
          <PeopleSection type="유대" data={data?.people ?? []} />
          </div>
          <div className="text-2xl font-bold pt-10 mb-3">다른 심리 상태 둘러보기</div>
          <div className="grid grid-cols-2 gap-3">
              <EmotionSummaryCard type={"활력"} color={"blue"}/>
              <EmotionSummaryCard type={"안정"} color={"blue"}/>
          </div>
      </div>
    </div>
  );
};
export default RelationBond; 