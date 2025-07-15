import { useGetEmotionAnalysis } from "@/api/queries/aboutme/useGetEmoanalysis";
import { ChevronRight } from "lucide-react";
import { data } from "react-router-dom";

interface EmotionData {
  emotion: string;
  intensity: number;
  count: number;
}

interface CardProps {
  data: EmotionData[];
}

const getEmotionStats = (data: EmotionData[] = []) => {
    const totalCount = data.reduce((sum, { count }) => sum + count, 0);
  
    // 총합이 0이면 바로 빈 배열 반환
    if (!totalCount) return [];
  
    // ▸ 백분율 내림차순 → intensity 내림차순
    const sorted = [...data].sort((a, b) => {
      const aPct = (a.count / totalCount) * 100;
      const bPct = (b.count / totalCount) * 100;
      if (aPct === bPct) return b.intensity - a.intensity;
      return bPct - aPct;
    });
  
    // ▸ 백분율 계산 후 반환
    return sorted.map(item => ({
      ...item,
      percentage: Math.round((item.count / totalCount) * 100), // 0‒100 정수
    }));
  };


const RelationCard = ({ data }: CardProps) => {
    const processedData = getEmotionStats(data);

  return (
    <div className="w-full mt-5">
      {/* 메인 컨테이너 */}
      <div className="rounded-3xl shadow-xl bg-white">
        {/* 헤더 */}
        <div className="flex justify-between pt-3 ml-6 mr-5 mb-1">
          <h1 className="text-lg font-bold text-gray-900">
            관계에 관한 20가지 감정
          </h1>
          <ChevronRight className="text-gray-400"/>
        </div>
        <hr className="mr-5 ml-5"/>
        
        {/* 감정 데이터 표시 */}
        <div className="p-6">
          <div className="grid grid-cols-3 grid-rows-2 gap-3">
            {processedData.slice(0, 6).map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              {/* 파란색 원 */}
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                <span className="text-lg font-bold text-blue-600">
                  {item.emotion}
                </span>
              </div>
              
              {/* 텍스트 정보 */}
              <div className="flex-1">
                <div className="text-lg font-bold text-gray-900">
                  {item.count}
                </div>
                <div className="text-xs text-gray-500">
                  {item.percentage}%
                </div>
              </div>
            </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SelfCard = ({ data }: CardProps) => {
    const processedData = getEmotionStats(data);

    return (
      <div className="w-full mt-5">
        {/* 메인 컨테이너 */}
        <div className="rounded-3xl shadow-xl bg-white">
          {/* 헤더 */}
          <div className="flex justify-between pt-3 ml-6 mr-5 mb-1">
            <h1 className="text-lg font-bold text-gray-900">
              username에 관한 12가지 감정
            </h1>
            <ChevronRight className="text-gray-400"/>
          </div>
          <hr className="mr-5 ml-5"/>
          
          {/* 감정 데이터 표시 */}
        <div className="p-6">
          <div className="grid grid-cols-3 grid-rows-2 gap-3">
            {processedData.slice(0, 6).map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              {/* 파란색 원 */}
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                <span className="text-lg font-bold text-blue-600">
                  {item.emotion}
                </span>
              </div>
              
              {/* 텍스트 정보 */}
              <div className="flex-1">
                <div className="text-lg font-bold text-gray-900">
                  {item.count}
                </div>
                <div className="text-xs text-gray-500">
                  {item.percentage}%
                </div>
              </div>
            </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    );
}

const StateCard = ({ data }: CardProps) => {
    const processedData = getEmotionStats(data);

    return (
      <div className="w-full mt-5">
        {/* 메인 컨테이너 */}
        <div className="rounded-3xl shadow-xl bg-white">
          {/* 헤더 */}
          <div className="flex justify-between pt-3 ml-6 mr-5 mb-1">
            <h1 className="text-lg font-bold text-gray-900">
              상황에 관한 24가지 감정
            </h1>
            <ChevronRight className="text-gray-400"/>
          </div>
          <hr className="mr-5 ml-5"/>
          
          {/* 감정 데이터 표시 */}
        <div className="p-6">
          <div className="grid grid-cols-3 grid-rows-2 gap-3">
            {processedData.slice(0, 6).map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              {/* 파란색 원 */}
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                <span className="text-lg font-bold text-blue-600">
                  {item.emotion}
                </span>
              </div>
              
              {/* 텍스트 정보 */}
              <div className="flex-1">
                <div className="text-lg font-bold text-gray-900">
                  {item.count}
                </div>
                <div className="text-xs text-gray-500">
                  {item.percentage}%
                </div>
              </div>
            </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    );
}

const EmotionCards=()=>{
    const token = localStorage.getItem("accessToken") || "";
    const { data } = useGetEmotionAnalysis(token);

    console.log(data);

    
    return(
        <div>
            <RelationCard data={data?.Relation} />
            <SelfCard data={data?.Self}/>
            <StateCard data={data?.State}/>
        </div>
    )
}

export default EmotionCards;