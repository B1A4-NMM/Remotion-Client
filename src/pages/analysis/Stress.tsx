import { useMentalData } from "@/api/queries/aboutme/useMentalData";
import ActivitySection from "@/components/aboutMe/Mental/ActivitySection";
import MentalChart from "@/components/aboutMe/Mental/MentalChart";
import PeopleSection from "@/components/aboutMe/Mental/PeopleSection";
import EmotionSummaryCard from "@/components/analysis/EmotionSummaryCard";
import Title from "@/components/analysis/Title";

const Stress = () => {
  const period = 365; // 최근 1년
  const barCount = 12; // 12개월 표시
  const { data } = useMentalData("스트레스", period);
  return (
    <div className="mb-10">
      <Title name="스트레스" isBackActive={true} back="/analysis" />
      {/* Desktop: Grid layout for multiple boxes */}
      <div className="pl-3 pr-3 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4">
        <div className="bg-white rounded-3xl shadow-xl md:mb-0 mb-4">
          <div className="text-xl font-bold p-3"> 일자별 스트레스 수치</div>
          <MentalChart type="스트레스" data={data?.date ?? []} limit={barCount} />
        </div>

        <div className="bg-white rounded-3xl shadow-xl md:mb-0 mb-4">
          <div className="text-xl font-bold pt-5 pl-5 pb-2"> 스트레스를 유발한 활동</div>
          <ActivitySection type="스트레스" data={data?.activities ?? []} selectedPeriod="monthly" />
          <div className="text-xl font-bold pt-5 pl-5 mt-10"> 스트레스를 준 사람들</div>
          <PeopleSection type="스트레스" data={data?.people ?? []} selectedPeriod="monthly" />
        </div>
      </div>

      <div className="text-2xl font-bold pt-10 pb-6 mb-3">다른 심리 상태 둘러보기</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:max-w-3xl md:mx-auto">
        <EmotionSummaryCard type={"불안"} period={period} barCount={barCount} />
        <EmotionSummaryCard type={"우울"} period={period} barCount={barCount} />
      </div>
    </div>
  );
};
export default Stress;
