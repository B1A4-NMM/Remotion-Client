import { useMentalData } from "@/api/queries/aboutme/useMentalData";
import ActivitySection from "@/components/aboutMe/Mental/ActivitySection";
import MentalChart from "@/components/aboutMe/Mental/MentalChart";
import PeopleSection from "@/components/aboutMe/Mental/PeopleSection";
import Title from "@/components/analysis/Title";
import EmotionSummaryCard from "@/components/analysis/EmotionSummaryCard";

const Anxiety = () => {
  const period = 365; //최근
  const barCount = 12;
  const { data } = useMentalData("불안", period);
  return (
    <div className="mb-10">
      <Title name="불안" isBackActive={true} back="/analysis" />

      {/* Desktop: Grid layout for multiple boxes */}
      <div className="pl-3 pr-3 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4">
        <div className="bg-white rounded-3xl shadow-xl md:mb-0 mb-4">
          <div className="text-xl font-bold p-3"> 일자별 불안 수치</div>
          <MentalChart type="불안" data={data?.date ?? []} limit={barCount} />
        </div>

        <div className="bg-white rounded-3xl shadow-xl md:mb-0 mb-4">
          <div className="text-xl font-bold pt-5 pl-5 pb-2"> 불안을 느낀 활동</div>
          <ActivitySection type="불안" data={data?.activities ?? []} selectedPeriod="monthly" />
          <div className="text-xl font-bold pt-5 pl-5 mt-10"> 불안하게 한 사람들</div>
          <PeopleSection type="불안" data={data?.people ?? []} selectedPeriod="monthly" />
        </div>
      </div>

      <div className="text-2xl font-bold pt-10 pb-6 mb-3">다른 심리 상태 둘러보기</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:max-w-3xl md:mx-auto">
        <EmotionSummaryCard type={"스트레스"} period={period} barCount={barCount} />
        <EmotionSummaryCard type={"우울"} period={period} barCount={barCount} />
      </div>
    </div>
  );
};
export default Anxiety;
