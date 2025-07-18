import { useMentalData } from "@/api/queries/aboutme/useMentalData";
import ActivitySection from "@/components/aboutMe/Mental/ActivitySection";
import MentalChart from "@/components/aboutMe/Mental/MentalChart";
import PeopleSection from "@/components/aboutMe/Mental/PeopleSection";
import Title from "@/components/analysis/Title";

const Vitality = () => {
  const { data } = useMentalData("활력", 365);
  return (
    <div className="mb-10">
      <Title name="활력" isBackActive={true} back="/analysis" />
      <div className="pl-3 pr-3">
        <div className="bg-white rounded-3xl shadow-xl mb-4">
          <div className="text-xl font-bold p-3"> 일자별 활력 수치</div>
          <MentalChart type="활력" data={data?.date ?? []} />
        </div>
        <div className="bg-white rounded-3xl shadow-xl mb-4">
          <div className="text-xl font-bold pt-5 pl-5 pb-2"> 활력을 느낀 활동</div>
          <ActivitySection type="활력" data={data?.activities ?? []} />
          <div className="text-xl font-bold pt-5 pl-5 mt-10"> 활력에 영향을 준 사람들</div>
          <PeopleSection type="활력" data={data?.people ?? []} />
        </div>
      </div>
    </div>
  );
};
export default Vitality; 