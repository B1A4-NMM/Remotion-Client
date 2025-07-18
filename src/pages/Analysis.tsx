import Character from "@/components/analysis/Character";
import EmotionSummaryCard from "@/components/analysis/EmotionSummaryCard";
import StrengthGraph from "@/components/analysis/StrengthGraph";

const Analysis = () => {

  return (
    <div className="px-4 py-8 text-foreground min-h-screen space-y-10">

      {/* 부정적 감정 */}
      <section>
        <h3 className="text-lg font-semibold mb-2 text-gray-800 ml-3">부정적 감정</h3>
        <div className="pb-2 ">
          <EmotionSummaryCard type={"부정"} />
        </div>
      </section>

      {/* 긍정적 감정 */}
      <section>
        <h3 className="text-lg font-semibold mb-2 text-gray-800 ml-3">긍정적 감정</h3>
        <div className="pb-2">
          <EmotionSummaryCard type={"긍정"} />
        </div>
      </section>

      {/* 강점 */}
      <section className="rounded-xl shadow ">
        <StrengthGraph userName="user Name" />
      </section>
    </div>
  );
};

export default Analysis;
