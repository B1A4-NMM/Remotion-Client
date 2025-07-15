import React,{useState} from "react";
import HexRadarChart from "@/components/analysis/Strength/HexRadarChart";
import StrengthBarChart from "@/components/analysis/strength/StrengthBarChart";
import { useGetStrength } from "@/api/queries/aboutme/useGetStrength";
import type { DetailStrength } from "@/types/strength";
import Title from "@/components/analysis/Title";


const LABELS = ["지혜", "도전", "정의", "배려", "절제", "긍정"];
const PASTEL_COLORS = ["#a8d5ba", "#ffd3b6", "#ffaaa5", "#d5c6e0", "#f8ecc9", "#c1c8e4"];
const API_TO_DISPLAY_LABEL_MAP: Record<string, string> = {
  지혜: "지혜",
  용기: "도전",
  정의: "정의",
  인애: "배려",
  절제: "절제",
  초월: "긍정",
};

const Strength=()=>{
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const { data, isLoading, error } = useGetStrength();

    // API label → Display label 변환
    const apiToDisplay = (apiLabel: string) => API_TO_DISPLAY_LABEL_MAP[apiLabel];
    const displayToApi = (displayLabel: string) =>
    Object.entries(API_TO_DISPLAY_LABEL_MAP).find(([, d]) => d === displayLabel)?.[0] || "";

    const detailData: DetailStrength | null =
    selectedCategory && data?.detailCount
        ? (data.detailCount[displayToApi(selectedCategory)] ?? null)


        : null;
    return(
        <div className="mb-10">
            <Title name={"Strength"} isBackActive={true}/>
            <div className="text-gray-400 text-right mb-6">
            <p>VIA (Values in Action)는 긍정 심리학의 연구 결과를 바탕으로 개발된 성격 강점 모델로, 개인의 강점을 파악하고 이를 통해 삶의 만족도와 웰빙을 향상시키는 데 활용됩니다.</p>
            <p> VIA 강점은 타고난 재능뿐만 아니라 노력으로 개발된 역량까지 포함하며, 6가지 핵심 덕목 아래 24가지 성격 강점으로 분류됩니다. </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl mb-4">
                <HexRadarChart 
                    totalTypeCount={data.typeCount} 
                    monthlyTypeCount={data.typeCount} 
                    onSelectCategory={setSelectedCategory} />

            </div>
            <div className="bg-white rounded-3xl shadow-xl">
            {detailData && selectedCategory ? (
                
            <StrengthBarChart 
                totalData={detailData}
                monthlyData={detailData}
                selectedCategory={selectedCategory}
            />
            ) : (
                <div className="flex justify-center p-20">
                    <span className="text-gray-400 p-15">그래프의 라벨을 클릭 해 보세요.</span>
                </div>
            )}
            </div>
        </div>
    )

}


export default Strength;