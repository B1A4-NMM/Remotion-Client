import React from "react";

interface IntensityScore {
  diaryId: number;
  intensitySum: number;
  writtenDate: string;
}

interface IntensityChartProps {
  scores: IntensityScore[];
}

const IntensityChart: React.FC<IntensityChartProps> = ({ scores }) => {
  if (!scores || scores.length === 0) return null;

  // diaryId 기준으로 내림차순 정렬 후 최근 5개만 선택
  const processedScores = scores
    .sort((a, b) => b.diaryId - a.diaryId) // diaryId 큰 순서로 정렬
    .slice(0, 5); // 상위 5개 선택

  // 데이터 분석
  const positiveScores = processedScores.filter(s => s.intensitySum > 0);
  const negativeScores = processedScores.filter(s => s.intensitySum < 0);
  const zeroScores = processedScores.filter(s => s.intensitySum === 0);

  const positiveSum = positiveScores.reduce((sum, s) => sum + s.intensitySum, 0);
  const negativeSum = Math.abs(negativeScores.reduce((sum, s) => sum + s.intensitySum, 0));

  // 최대/최소값을 구해서 스케일 조정
  const maxPositive = Math.max(0, ...processedScores.map(s => s.intensitySum));
  const maxNegative = Math.min(0, ...processedScores.map(s => s.intensitySum));
  const maxValue = Math.max(...processedScores.map(s => Math.abs(s.intensitySum)));
  const scaleFactor = 0.8; // 스케일을 크게 해서 그래프가 적당한 크기로 보이게
  const chartHeight = 160;
  const topPadding = 60; // 위쪽 툴팁 공간
  const bottomPadding = 60; // 아래쪽 툴팁 공간

  // 적응적 중심선 위치 계산
  const calculateAdaptiveCenterY = () => {
    const positiveThreshold = 70; // 양수 임계치
    const negativeThreshold = -70; // 음수 임계치

    if (maxPositive > positiveThreshold && Math.abs(maxNegative) < positiveThreshold / 2) {
      // 양수가 크고 음수가 작으면 중심선을 아래로
      const shift = Math.min(70, (maxPositive - positiveThreshold) * 0.5);
      return topPadding + chartHeight / 2 + shift;
    } else if (maxNegative < negativeThreshold && maxPositive < Math.abs(negativeThreshold) / 2) {
      // 음수가 크고 양수가 작으면 중심선을 위로
      const shift = Math.min(70, (Math.abs(maxNegative) - Math.abs(negativeThreshold)) * 0.3);
      return topPadding + chartHeight / 2 - shift;
    }

    // 기본적으로는 가운데
    return topPadding + chartHeight / 2;
  };

  const centerY = calculateAdaptiveCenterY();
  const chartWidth = Math.max(350, processedScores.length * 50);
  const padding = 20;

  // 값을 Y 좌표로 변환하는 함수
  const getY = (value: number) => {
    const normalizedValue = value / maxValue;
    const maxBarHeight = chartHeight / 2; // 차트 높이의 절반까지 사용
    return centerY - normalizedValue * maxBarHeight * (1 / scaleFactor);
  };

  // X 좌표 계산
  const getX = (index: number) => {
    return padding + (index * (chartWidth - 2 * padding)) / (processedScores.length - 1);
  };

  // 부드러운 곡선 경로 생성 (베지어 곡선)
  const createSmoothPath = () => {
    if (processedScores.length === 0) return "";
    if (processedScores.length === 1)
      return `M ${getX(0)} ${getY(processedScores[0].intensitySum)}`;

    let path = `M ${getX(0)} ${getY(processedScores[0].intensitySum)}`;

    for (let i = 1; i < processedScores.length; i++) {
      const x1 = getX(i - 1);
      const y1 = getY(processedScores[i - 1].intensitySum);
      const x2 = getX(i);
      const y2 = getY(processedScores[i].intensitySum);

      const controlX1 = x1 + (x2 - x1) * 0.5;
      const controlY1 = y1;
      const controlX2 = x2 - (x2 - x1) * 0.5;
      const controlY2 = y2;

      path += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${x2} ${y2}`;
    }

    return path;
  };

  // 영역 채우기 경로 생성 (부드러운 곡선)
  const createSmoothAreaPath = (isPositive: boolean) => {
    if (processedScores.length === 0) return "";

    let path = `M ${getX(0)} ${centerY}`;

    // 선 그래프와 동일한 부드러운 곡선 생성
    for (let i = 0; i < processedScores.length; i++) {
      const value = processedScores[i].intensitySum;
      const x = getX(i);

      if (i === 0) {
        const y = (isPositive && value >= 0) || (!isPositive && value < 0) ? getY(value) : centerY;
        path += ` L ${x} ${y}`;
      } else {
        const currentY =
          (isPositive && value >= 0) || (!isPositive && value < 0) ? getY(value) : centerY;
        const prevX = getX(i - 1);
        const prevValue = processedScores[i - 1].intensitySum;
        const prevY =
          (isPositive && prevValue >= 0) || (!isPositive && prevValue < 0)
            ? getY(prevValue)
            : centerY;

        const controlX1 = prevX + (x - prevX) * 0.5;
        const controlY1 = prevY;
        const controlX2 = x - (x - prevX) * 0.5;
        const controlY2 = currentY;

        path += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${x} ${currentY}`;
      }
    }

    path += ` L ${getX(processedScores.length - 1)} ${centerY} Z`;
    return path;
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 px-4">오늘에 닿은 감정의 선</h2>
      <div className="rounded-2xl shadow-lg p-4" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="overflow-x-auto">
          <svg width={chartWidth} height={topPadding + chartHeight + bottomPadding}>
            {/* 그라데이션 정의 */}
            <defs>
              <linearGradient id="positiveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(134, 239, 172, 0.4)" />
                {/* <stop offset="100%" stopColor="rgba(134, 239, 172, 0.1)" /> */}
              </linearGradient>
              <linearGradient id="negativeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                {/* <stop offset="0%" stopColor="rgba(252, 165, 165, 0.1)" /> */}
                <stop offset="100%" stopColor="rgba(252, 165, 165, 0.4)" />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6B7280" />
                <stop offset="50%" stopColor="#9CA3AF" />
                <stop offset="100%" stopColor="#6B7280" />
              </linearGradient>

              {/* 부드러운 그림자 */}
              <filter id="softShadow">
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.15" />
              </filter>
            </defs>

            {/* 중심선 (0 기준선) */}
            <line
              x1={padding}
              y1={centerY}
              x2={chartWidth - padding}
              y2={centerY}
              stroke="#9CA3AF"
              strokeWidth="2"
              opacity="0.8"
            />

            {/* 0 표시 */}
            <circle cx={padding - 15} cy={centerY} r="6" fill="#E5E7EB" opacity="0.8" />
            <text
              x={padding - 15}
              y={centerY + 3}
              textAnchor="middle"
              className="text-xs font-medium"
              fill="#6B7280"
            >
              0
            </text>

            {/* 양수 영역 채우기 (연한 초록) */}
            <path d={createSmoothAreaPath(true)} fill="url(#positiveGradient)" stroke="none" />

            {/* 음수 영역 채우기 (연한 빨강) */}
            <path d={createSmoothAreaPath(false)} fill="url(#negativeGradient)" stroke="none" />

            {/* 부드러운 선 그래프 */}
            <path
              d={createSmoothPath()}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#softShadow)"
            />

            {/* 데이터 포인트 */}
            {processedScores.map((score, index) => {
              const x = getX(index);
              const y = getY(score.intensitySum);
              const isPositive = score.intensitySum >= 0;
              const tooltipY = isPositive ? y - 25 : y + 35; // 양수면 위에, 음수면 아래에 툴팁

              return (
                <g key={score.diaryId}>
                  {/* 포인트 글로우 효과 */}
                  <circle
                    cx={x}
                    cy={y}
                    r="6"
                    fill={
                      score.intensitySum >= 0
                        ? "rgba(134, 239, 172, 0.3)"
                        : "rgba(252, 165, 165, 0.3)"
                    }
                    className="animate-pulse"
                  />

                  {/* 메인 포인트 */}
                  <circle
                    cx={x}
                    cy={y}
                    r="3"
                    fill="white"
                    stroke={score.intensitySum >= 0 ? "#86EFAC" : "#FCA5A5"}
                    strokeWidth="2"
                    filter="url(#softShadow)"
                  />

                  {/* 예쁜 툴팁 */}
                  <g>
                    {/* 툴팁 배경 (둥근 모서리 + 그림자) */}
                    <rect
                      x={x - 22}
                      y={isPositive ? y - 50 : y + 20}
                      width="44"
                      height="24"
                      rx="12"
                      ry="12"
                      fill="rgba(255, 255, 255, 0.98)"
                      stroke="rgba(0, 0, 0, 0.08)"
                      strokeWidth="1"
                      filter="url(#softShadow)"
                    />

                    {/* 툴팁 화살표 */}
                    <path
                      d={
                        isPositive
                          ? `M ${x - 6} ${y - 26} L ${x} ${y - 16} L ${x + 6} ${y - 26} Z`
                          : `M ${x - 6} ${y + 44} L ${x} ${y + 34} L ${x + 6} ${y + 44} Z`
                      }
                      fill="rgba(255, 255, 255, 0.98)"
                      stroke="rgba(0, 0, 0, 0.08)"
                      strokeWidth="1"
                      filter="url(#softShadow)"
                    />

                    {/* 날짜 텍스트 */}
                    <text
                      x={x}
                      y={isPositive ? y - 32 : y + 38}
                      textAnchor="middle"
                      fontSize="12"
                      fill="rgba(51, 65, 85, 0.9)"
                      fontWeight="600"
                      fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
                    >
                      {score.writtenDate.slice(5).replace("-", "/")}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default IntensityChart;
