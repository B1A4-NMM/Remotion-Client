import { useMentalData } from "@/api/queries/aboutme/useMentalData";
import ActivitySection from "@/components/aboutMe/Mental/ActivitySection";
import MentalChart from "@/components/aboutMe/Mental/MentalChart";
import PeopleSection from "@/components/aboutMe/Mental/PeopleSection";
import EmotionSummaryCard from "@/components/analysis/EmotionSummaryCard";
import Title from "@/components/analysis/Title";

const Stable = () => {
  const { data } = useMentalData("안정", 365);
  return (
    <div className="mb-10">
      <Title name="안정" isBackActive={true} back="/analysis" />
      <div className="pl-3 pr-3">
        <div className="bg-white rounded-3xl shadow-xl mb-4">
          <div className="text-xl font-bold p-3"> 일자별 안정 수치</div>
          <MentalChart type="안정" data={data?.date ?? []} limit={10} />
        </div>
        <div className="bg-white rounded-3xl shadow-xl mb-4">
          <div className="text-xl font-bold pt-5 pl-5 pb-2"> 안정을 느낀 활동</div>
          <ActivitySection type="안정" data={data?.activities ?? []} />
          <div className="text-xl font-bold pt-5 pl-5 mt-10"> 안정을 준 사람들</div>
          <PeopleSection type="안정" data={data?.people ?? []} />
        </div>
          <div className="text-2xl font-bold pt-10 mb-3">다른 심리 상태 둘러보기</div>
          <div className="grid grid-cols-2 gap-3">
              <EmotionSummaryCard type={"안정"} color={"blue"}/>
              <EmotionSummaryCard type={"유대"} color={"blue"}/>
          </div>
      </div>
    </div>
  );
};
export default Stable; 