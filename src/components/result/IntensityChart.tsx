import React from "react";

interface IntensityScore {
  diaryId: number;
  intensitySum: number;
  writtenDate: string;
}

interface IntensityChartProps {
  scores: IntensityScore[];
  diaryId?: number;
}

const IntensityChart: React.FC<IntensityChartProps> = ({ scores, diaryId }) => {
  if (!scores || scores.length === 0) return null;

  // diaryId 기준으로 내림차순 정렬 후 최근 5개만 선택
  const processedScores = [...scores].reverse(); // 원본 배열을 복사한 후 거꾸로 정렬

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
  const scaleFactor = 0.6; // 스케일을 더 작게 해서 그래프가 너무 크지 않게

  // 데이터 개수에 따른 동적 너비 계산
  const minWidth = 352; // 적절한 최소 너비
  const dataPointWidth = 70; // 적절한 데이터 포인트 너비
  const chartWidth = Math.max(minWidth, processedScores.length * dataPointWidth);

  // 데이터에 따른 동적 높이 계산
  const baseHeight = 150; // 기본 차트 높이
  const dataCount = processedScores.length;

  // 데이터 개수에 따른 높이 조정
  let dynamicChartHeight = baseHeight;
  if (dataCount <= 3) {
    dynamicChartHeight = 120; // 데이터가 적으면 높이 줄임
  } else if (dataCount >= 7) {
    dynamicChartHeight = 150; // 데이터가 많으면 높이 늘림
  }

  // 값의 범위에 따른 높이 조정
  const valueRange = maxValue;
  if (valueRange > 100) {
    dynamicChartHeight += 40; // 값이 크면 더 많은 공간 필요
  } else if (valueRange < 20) {
    dynamicChartHeight -= 20; // 값이 작으면 공간 줄임
  }

  const chartHeight = dynamicChartHeight;

  // 패딩도 데이터 개수에 따라 조정
  const padding = processedScores.length > 5 ? 35 : 25; // 적절한 패딩

  // 툴팁 높이를 고려한 동적 패딩 계산
  const tooltipHeight = 50; // 툴팁 높이
  const tooltipMargin = 20; // 툴팁 여백

  // 데이터의 최대/최소값에 따라 패딩 조정
  const hasHighValues = maxValue > 80; // 높은 값이 있으면 더 많은 공간 필요

  const topPadding = hasHighValues ? 100 : 80; // 위쪽 툴팁 공간 (동적 조정) - 더 늘림
  const bottomPadding = hasHighValues ? 100 : 80; // 아래쪽 툴팁 공간 (동적 조정) - 더 늘림

  // 적응적 중심선 위치 계산
  // 0의 위치를 직접 조절하는 함수
  const calculateAdaptiveCenterY = () => {
    // 기본 중심선 위치
    const baseCenterY = topPadding + chartHeight / 2;

    // intensitySum 값에 따른 manualOffset 계산
    const maxIntensity = Math.max(...processedScores.map(s => s.intensitySum));
    const minIntensity = Math.min(...processedScores.map(s => s.intensitySum));

    let manualOffset = 0; // 기본값 (가운데)

    // 상대적 임계값 계산 (maxValue의 60%를 기준으로)
    const relativeThreshold = maxValue * 0.6;
    const hasHighPositive = maxIntensity >= relativeThreshold;
    const hasLowNegative = minIntensity <= -relativeThreshold;

    if (hasHighPositive && hasLowNegative) {
      // 둘 다 있으면 가운데
      manualOffset = 0;
    } else if (hasHighPositive) {
      // 높은 양수만 있으면 아래로 (더 보수적으로)
      manualOffset = 40;
    } else if (hasLowNegative) {
      // 낮은 음수만 있으면 위로 (더 보수적으로)
      manualOffset = -40;
    } else {
      // 둘 다 없으면 가운데
      manualOffset = 0;
    }

    return baseCenterY + manualOffset;
  };

  const centerY = calculateAdaptiveCenterY();

  // 값을 Y 좌표로 변환하는 함수
  const getY = (value: number) => {
    const normalizedValue = value / maxValue;
    const maxBarHeight = chartHeight / 2; // 차트 높이의 절반까지 사용
    return centerY - normalizedValue * maxBarHeight * (1 / scaleFactor);
  };

  // X 좌표 계산
  const getX = (index: number) => {
    if (processedScores.length === 1) {
      // 데이터가 하나일 때는 가운데에 위치
      return chartWidth / 2;
    }
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
    <div className="mb-4 pt-4 overflow-visible">
      <div
        className="rounded-2xl shadow-lg p-4 overflow-visible bg-white dark:bg-gray-800"
      >
        <div className="overflow-visible">
          <svg width={chartWidth} height={topPadding + chartHeight + bottomPadding}>
            {/* 그라데이션 정의 */}
            <defs>
              <linearGradient id="positiveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(134, 239, 172, 0.9)" />
                {/* <stop offset="100%" stopColor="rgba(134, 239, 172, 0.1)" /> */}
              </linearGradient>
              <linearGradient id="negativeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                {/* <stop offset="0%" stopColor="rgba(252, 165, 165, 0.1)" /> */}
                <stop offset="100%" stopColor="rgba(252, 165, 165, 0.9)" />
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

            {/* 양수 영역 채우기 (연한 초록) - 투명도 증가 */}
            <path
              d={createSmoothAreaPath(true)}
              fill="url(#positiveGradient)"
              stroke="none"
              opacity="0.3"
            />

            {/* 음수 영역 채우기 (연한 빨강) - 투명도 증가 */}
            <path
              d={createSmoothAreaPath(false)}
              fill="url(#negativeGradient)"
              stroke="none"
              opacity="0.3"
            />

            {/* 등선들 - 채워진 영역에서는 숨김 */}
            {[-2, -1, 0, 1, 2].map(level => {
              const y = centerY - (level * chartHeight) / 4;
              return (
                <line
                  key={level}
                  x1={padding}
                  y1={y}
                  x2={chartWidth - padding}
                  y2={y}
                  stroke="#9CA3AF"
                  strokeWidth="1"
                  opacity="0.15"
                  strokeDasharray={level === 0 ? "none" : "2,2"}
                />
              );
            })}

            {/* 중심선 (0 기준선) - 채워진 영역에서는 숨김 */}
            <line
              x1={padding}
              y1={centerY}
              x2={chartWidth - padding}
              y2={centerY}
              stroke="#9CA3AF"
              strokeWidth="2"
              opacity="0.3"
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

            {/* 긍정/부정 뱃지 */}
            <g>
              {/* 긍정 뱃지 (왼쪽 위) */}
              <rect
                x={padding - 10}
                y={topPadding - 60}
                width="35"
                height="30"
                rx="15"
                ry="15"
                fill="#a5dfc1"
                stroke="#a5dfc1"
                strokeWidth="1"
              />
              <text
                x={padding + 8}
                y={topPadding - 40}
                textAnchor="middle"
                fontSize="12"
                fill="white"
                fontWeight="600"
                fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
                className="dark:fill-gray-800"
              >
                긍정
              </text>

              {/* 부정 뱃지 (왼쪽 아래) */}
              <rect
                x={padding - 15}
                y={topPadding + chartHeight + 30}
                width="40"
                height="30"
                rx="15"
                ry="15"
                fill="rgba(252, 165, 165, 0.9)"
                stroke="rgba(252, 165, 165, 1)"
                strokeWidth="1"
              />
              <text
                x={padding + 5}
                y={topPadding + chartHeight + 49}
                textAnchor="middle"
                fontSize="12"
                fill="white"
                fontWeight="600"
                fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
                className="dark:fill-gray-800"
              >
                부정
              </text>
            </g>

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
              const isCurrentDiary = diaryId && score.diaryId === diaryId;

              return (
                <g key={score.diaryId}>
                  {/* 포인트 글로우 효과 */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isCurrentDiary ? "16" : "6"}
                    fill={
                      score.intensitySum >= 0
                        ? "rgba(134, 239, 172, 0.3)"
                        : "rgba(252, 165, 165, 0.3)"
                    }
                    className={isCurrentDiary ? "animate-pulse" : "animate-pulse"}
                  />

                  {/* 메인 포인트 */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isCurrentDiary ? "4" : "3"}
                    fill="white"
                    stroke={score.intensitySum >= 0 ? "#86EFAC" : "#FCA5A5"}
                    strokeWidth={isCurrentDiary ? "3" : "2"}
                    filter="url(#softShadow)"
                    className={isCurrentDiary ? "animate-pulse" : ""}
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
                      fill={isCurrentDiary ? "#b5daff" : "rgba(255, 255, 255, 0.98)"}
                      stroke={isCurrentDiary ? "#b5daff" : "rgba(0, 0, 0, 0.08)"}
                      strokeWidth={isCurrentDiary ? "2" : "1"}
                      filter="url(#softShadow)"
                    />

                    {/* 툴팁 화살표 */}
                    <path
                      d={
                        isPositive
                          ? `M ${x - 5} ${y - 25} L ${x} ${y - 18} L ${x + 5} ${y - 25} Z`
                          : `M ${x - 5} ${y + 19} L ${x} ${y + 12} L ${x + 5} ${y + 19} Z`
                      }
                      fill={isCurrentDiary ? "#b5daff" : "rgba(255, 255, 255, 0.98)"}
                      stroke={isCurrentDiary ? "#b5daff" : "rgba(0, 0, 0, 0.12)"}
                      strokeWidth={isCurrentDiary ? "1.5" : "1"}
                      filter="url(#softShadow)"
                    />

                    {/* 날짜 텍스트 */}
                    <text
                      x={x}
                      y={isPositive ? y - 33 : y + 38}
                      textAnchor="middle"
                      fontSize="12"
                      fill={isCurrentDiary ? "rgba(51, 65, 85, 0.9)" : "rgba(51, 65, 85, 0.9)"}
                      fontWeight="600"
                      fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
                    >
                      {isCurrentDiary ? "현재" : score.writtenDate.slice(5).replace("-", "/")}
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
