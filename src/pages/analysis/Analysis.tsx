import Stress from "@/components/analysis/Stress";
import Anxiety from "@/components/analysis/Anxiety";
import Depress from "@/components/analysis/Depress";
import Vitality from "@/components/analysis/Vitality";
import Stable from "@/components/analysis/Stable";
import RelationBond from "@/components/analysis/RelationBond";
import StrengthGraph from "@/components/analysis/StrengthGraph";

const Analysis = () => {
  return (
    <div className="pl-3 pr-3 text-foreground min-h-screen">
      <h2 className="text-2xl font-bold mt-8 mb-4 text-center">나의 심리 상태 대시보드</h2>
      <div className="grid grid-cols-3 gap-4 grid-rows-2 mb-8">
        <Stress />
        <Anxiety />
        <Depress />!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        <Vitality />
        <Stable />
        <RelationBond />
      </div>
      <div className="my-8">
        <StrengthGraph userName="user Name" />
      </div>
    </div>
  );
};
export default Analysis; 