import { useState, useRef, useEffect } from "react";
import EmotionSummaryCard from "@/components/analysis/EmotionSummaryCard";
import StrengthGraph from "@/components/analysis/StrengthGraph";
import { Select } from "@/components/ui/select";
import { ChevronRight, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "@/styles/select.css";

type PeriodType = "daily" | "weekly" | "monthly";

interface PeriodConfig {
  days: number;
  barCount: number;
  label: string;
}

const Analysis = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("daily");
  const [helpOpen, setHelpOpen] = useState(false);
  const helpRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 바깥 클릭 시 도움말 닫기
  useEffect(() => {
    if (!helpOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) {
        setHelpOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [helpOpen]);

  const periodConfigs: Record<PeriodType, PeriodConfig> = {
    daily: { days: 7, barCount: 7, label: "일간 (7일)" },
    weekly: { days: 60, barCount: 8, label: "주간 (2개월)" }, // 2개월 = 60일, 8주
    monthly: { days: 180, barCount: 6, label: "월간 (6개월)" }, // 6개월 = 180일, 6개월
  };

  const periodOptions = [
    { value: "daily", label: "일간" },
    { value: "weekly", label: "주간" },
    { value: "monthly", label: "월간" },
  ];

  const getPeriodConfig = (period: PeriodType): PeriodConfig => {
    return periodConfigs[period];
  };

  const onClickHandler = (type: string) => {
    navigate(`/analysis/${type}`);
  };

  return (
    <div className="px-4 py-8 text-foreground min-h-screen space-y-10">
      {/* 기간 선택 드롭다운 */}
      <div className="flex justify-between gap-10">
        <div className="w-full bg-white rounded-xl">
          <Select
            value={selectedPeriod}
            onValueChange={(value) => setSelectedPeriod(value as PeriodType)}
            options={periodOptions}
            placeholder="기간을 선택하세요"
            className="font-bold !text-2xl"
          />
        </div>
    {/* 도움말 버튼 */}
      <div ref={helpRef} className="relative">
          <button
            aria-label="도움말"
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center shadow text-gray-600 text-xl font-bold border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
            onClick={() => setHelpOpen((v) => !v)}
            type="button"
          >
            <HelpCircle className="w-6 h-6" />
          </button>
          {helpOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-50 text-gray-800 text-base animate-fade-in">
              <div className="font-semibold mb-2 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-gray-500" /> 도움말
              </div>
              <div>여기서는 일기에서 나타난 감정들의 상세 분석을 확인할 수 있어요. 업데이트까지는 시간이 조금 걸려요.</div>
            </div>
          )}
      </div>
      </div>

      {/* 부정적 감정 */}
      <section className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between mb-5">
          <h3 className="text-2xl font-semibold mb-2 text-gray-800">부정적 감정</h3>
          <div onClick={()=>onClickHandler("부정")} className="cursor-pointer">
            <ChevronRight className="text-gray-400" />
          </div>
        </div>
        <div className="overflow-x-auto pb-2">
          <EmotionSummaryCard 
            key={"부정"} 
            type={"부정"} 
            period={getPeriodConfig(selectedPeriod).days}
            barCount={getPeriodConfig(selectedPeriod).barCount}
          />
        </div>
      </section>

      {/* 긍정적 감정 */}
      <section className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between mb-5">
          <h3 className="text-2xl font-semibold mb-2 text-gray-800">긍정적 감정</h3>
          <div onClick={()=>onClickHandler("긍정")} className="cursor-pointer">
            <ChevronRight className="text-gray-400" />
          </div>
        </div>
        <div className="overflow-x-auto pb-2">
            <EmotionSummaryCard 
              key={"긍정"} 
              type={"긍정"} 
              period={getPeriodConfig(selectedPeriod).days}
              barCount={getPeriodConfig(selectedPeriod).barCount}
            />
        </div>
      </section>

      {/* 강점 */}
      <section className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between mb-5">
          <h3 className="text-2xl font-semibold mb-2 text-gray-800">강점 그래프</h3>
          <div onClick={()=>onClickHandler("Strength")} className="cursor-pointer">
            <ChevronRight className="text-gray-400" />
          </div>
        </div>
        <StrengthGraph/>
      </section>
    </div>
  );
};

export default Analysis;
