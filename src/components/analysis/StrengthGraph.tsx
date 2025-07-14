import React, {useState} from "react";
import '@/styles/radarChart.css'
import { ChevronRight, Trophy, Award, Medal } from "lucide-react";
import { useGetStrength } from "@/api/queries/aboutme/useGetStrength";
import type { DetailStrength } from "@/types/strength";

interface StrengthData {
  label: string;
  value: number;
}

interface StrengthGraphProps {
  userName?: string;
  currentData?: StrengthData[];
  averageData?: StrengthData[];
}

const API_TO_DISPLAY_LABEL_MAP: Record<string, string> = {
  지혜: "지혜",
  용기: "도전",
  정의: "정의",
  인애: "배려",
  절제: "절제",
  초월: "긍정",
};

const StrengthGraph: React.FC<StrengthGraphProps> = ({
  userName = "User Name",
  currentData,
  averageData = [
    { label: "지혜", value: 85 },
    { label: "도전", value: 65 },
    { label: "정의", value: 70 },
    { label: "배려", value: 90 },
    { label: "절제", value: 70 },
    { label: "긍정", value: 100 }
  ]
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data, isLoading, error } = useGetStrength();

  // API 데이터를 기반으로 강점 점수 계산
  const calculateStrengthScores = (detailCount: any): StrengthData[] => {
    const strengthScores: StrengthData[] = [];
    
    // API_TO_DISPLAY_LABEL_MAP의 각 항목에 대해 점수 계산
    Object.entries(API_TO_DISPLAY_LABEL_MAP).forEach(([apiKey, displayLabel]) => {
      const details = detailCount?.[apiKey];
      let totalScore = 0;
      
      if (details) {
        // 해당 카테고리의 모든 세부 항목 점수 합계
        totalScore = Object.values(details).reduce((sum: number, count: number) => sum + count, 0);
      }
      
      strengthScores.push({
        label: displayLabel,
        value: totalScore
      });
    });
    
    return strengthScores;
  };

  // API 데이터에서 계산된 점수 또는 기본값 사용
  const calculatedCurrentData = data?.detailCount 
    ? calculateStrengthScores(data.detailCount)
    : [
        { label: "지혜", value: 0 },
        { label: "도전", value: 0 },
        { label: "정의", value: 0 },
        { label: "배려", value: 0 },
        { label: "절제", value: 0 },
        { label: "긍정", value: 0 }
      ];

  const finalCurrentData = currentData || calculatedCurrentData;

  // API label → Display label 변환
  const apiToDisplay = (apiLabel: string) => API_TO_DISPLAY_LABEL_MAP[apiLabel];
  const displayToApi = (displayLabel: string) =>
    Object.entries(API_TO_DISPLAY_LABEL_MAP).find(([, d]) => d === displayLabel)?.[0] || "";
  
  const detailData: DetailStrength | null =
    selectedCategory && data?.detailCount
      ? (data.detailCount[displayToApi(selectedCategory)] ?? null)
      : null;

  // 1-3등 계산 함수
  const getTopThree = (data: StrengthData[]) => {
    return [...data]
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);
  };

  // 최대값을 기준으로 정규화 (0이 아닌 값들 중에서)
  const maxValue = Math.max(...finalCurrentData.map(d => d.value), 1);
  const normalizedCurrentData = finalCurrentData.map(item => ({
    ...item,
    value: maxValue > 0 ? (item.value / maxValue) * 100 : 0
  }));

  // 레이더 차트 좌표 계산 함수
  const calculateRadarPoints = (data: StrengthData[], centerX = 200, centerY = 200, maxRadius = 140) => {
    const angleStep = (2 * Math.PI) / 6;
    const startAngle = -Math.PI / 2; // 12시 방향부터 시작

    return data.map((item, index) => {
      const angle = startAngle + angleStep * index;
      const radius = (item.value / 100) * maxRadius;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      return { x, y, angle, radius };
    }).map(point => `${point.x},${point.y}`).join(' ');
  };

  // 축 라벨 좌표 계산
  const calculateAxisLabels = (data: StrengthData[], centerX = 200, centerY = 200, labelRadius = 190) => {
    const angleStep = (2 * Math.PI) / 6;
    const startAngle = -Math.PI / 2;

    return data.map((item, index) => {
      const angle = startAngle + angleStep * index;
      const x = centerX + labelRadius * Math.cos(angle);
      const y = centerY + labelRadius * Math.sin(angle);
      return { x, y, label: item.label };
    });
  };

  // 레이더 차트 좌표 계산 함수 (객체 배열 반환)
  const calculateRadarCoordinates = (data: StrengthData[], centerX = 200, centerY = 200, maxRadius = 140) => {
    const angleStep = (2 * Math.PI) / 6;
    const startAngle = -Math.PI / 2; // 12시 방향부터 시작

    return data.map((item, index) => {
      const angle = startAngle + angleStep * index;
      const radius = (item.value / 100) * maxRadius;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      return { x, y, value: item.value };
    });
  };

  const currentPoints = calculateRadarPoints(normalizedCurrentData);
  const averagePoints = calculateRadarPoints(averageData);
  const axisLabels = calculateAxisLabels(finalCurrentData);
  const topThree = getTopThree(finalCurrentData);

  return (
    <div className="w-full">
      {/* 메인 컨테이너 */}
      <div className="rounded-3xl shadow-xl bg-white">
        {/* 헤더 */}
        <div className="flex justify-between pt-3 ml-6 mr-5 mb-1">
          <h1 className="text-lg font-bold text-gray-900">
            {userName}의 강점 그래프
          </h1>
          <ChevronRight className="text-gray-400"/>
        </div>

        <hr className="mr-5 ml-5"/>

        <div className="flex justify-center">
          <div className="mb-3">
            {/* 차트 컨테이너 - 크기 확대 */}
            <div className="relative w-[250px] h-[280px]">
              <svg className="w-full h-full" viewBox="0 0 400 400">
                {/* 그리드 라인 */}
                <g className="grid">
                  <polygon className="grid-line" points="200.00,60.00 321.24,130.00 321.24,270.00 200.00,340.00 78.76,270.00 78.76,130.00"/>
                  <polygon className="grid-line" points="200.00,88.00 296.99,144.00 296.99,256.00 200.00,312.00 103.01,256.00 103.01,144.00"/>
                  <polygon className="grid-line" points="200.00,116.00 272.75,158.00 272.75,242.00 200.00,284.00 127.25,242.00 127.25,158.00"/>
                  <polygon className="grid-line" points="200.00,144.00 248.50,172.00 248.50,228.00 200.00,256.00 151.50,228.00 151.50,172.00"/>
                  <polygon className="grid-line" points="200.00,172.00 224.25,186.00 224.25,214.00 200.00,228.00 175.75,214.00 175.75,186.00"/>
                </g>

                {/* 축 라인 */}
                <g className="axes">
                  <line className="axis-line" x1="200" y1="200" x2="200" y2="60"/>
                  <line className="axis-line" x1="200" y1="200" x2="321.24" y2="130.00"/>
                  <line className="axis-line" x1="200" y1="200" x2="321.24" y2="270.00"/>
                  <line className="axis-line" x1="200" y1="200" x2="200.00" y2="340.00"/>
                  <line className="axis-line" x1="200" y1="200" x2="78.76" y2="270.00"/>
                  <line className="axis-line" x1="200" y1="200" x2="78.76" y2="130.00"/>
                </g>

                {/* 데이터 영역 */}
                <polygon
                  fill="rgba(0, 122, 255, 0.15)"
                  stroke="#007aff"
                  strokeWidth="2"
                  points={currentPoints}
                />
                <polygon
                  fill="rgba(255, 149, 0, 0.15)"
                  stroke="#ff9500"
                  strokeWidth="2"
                  points={averagePoints}
                />

                {/* 데이터 포인트 - 실제 데이터 (파란색) */}
                {calculateRadarCoordinates(normalizedCurrentData).map((point, index) => (
                  <g key={`current-${index}`}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="6"
                      className="data-point-current"
                    />
                    <text
                      x={point.x}
                      y={point.y - 15}
                      fontSize="14"
                      fontWeight="600"
                      fill="#007aff"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {finalCurrentData[index].value}
                    </text>
                  </g>
                ))}

                {/* 데이터 포인트 - 평균 (주황색) */}
                {calculateRadarCoordinates(averageData).map((point, index) => (
                  <g key={`average-${index}`}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="6"
                      className="data-point-average"
                    />
                    <text
                      x={point.x}
                      y={point.y + 20}
                      fontSize="14"
                      fontWeight="600"
                      fill="#ff9500"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {averageData[index].value}
                    </text>
                  </g>
                ))}

                {/* 축 라벨 */}
                {axisLabels.map((label, index) => (
                  <text
                    key={index}
                    x={label.x}
                    y={label.y}
                    fontSize="24"
                    fontWeight="500"
                    fill="#1d1d1f"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {label.label}
                  </text>
                ))}
              </svg>
            </div>

            {/* 범례 */}
            <div className="flex justify-left gap-8 ml-14">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-gray-900 text-xs">실제 데이터</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span className="text-gray-900 text-xs">평균</span>
              </div>
            </div>
          </div>  
        </div>
      </div>
    </div>
  );
};

export default StrengthGraph;
