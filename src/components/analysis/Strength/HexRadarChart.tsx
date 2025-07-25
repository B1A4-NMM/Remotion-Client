import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useTheme } from "@/components/theme-provider";

type RadarChartProps = {
  lastTypeCount: Record<string, number>; // 저번 달 데이터
  currentTypeCount: Record<string, number>; // 이번 달 데이터
  onSelectCategory?: (label: string) => void;
};

const LABELS = ["지혜", "도전", "정의", "배려", "절제", "긍정"];
const LAST_COLOR = "#007aff"; // 저번 달 데이터 - 파란색
const CURRENT_COLOR = "#ff9500"; // 이번 달 데이터 - 주황색

const API_TO_DISPLAY_LABEL_MAP: Record<string, string> = {
  지혜: "지혜",
  용기: "도전",
  인애: "배려",
  정의: "협력",
  절제: "절제",
  초월: "긍정",
};

const RadarChart = ({ lastTypeCount, currentTypeCount, onSelectCategory }: RadarChartProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const numAxes = LABELS.length;
  const maxValue = 5;
  const width = 300;
  const height = 300;
  const radius = 100;
  const centerX = width / 2;
  const centerY = height / 2;
  const angleSlice = (Math.PI * 2) / numAxes;

  // 데이터 유효성 검증 함수
  const isValidData = (typeCount: Record<string, number>): boolean => {
    if (!typeCount || typeof typeCount !== "object") return false;

    // 데이터가 빈 객체이거나 모든 값이 0이면 유효하지 않음
    const entries = Object.entries(typeCount);
    if (entries.length === 0) return false;

    // 유효한 값이 하나라도 있으면 true
    return entries.some(
      ([key, value]) =>
        key &&
        typeof key === "string" &&
        key in API_TO_DISPLAY_LABEL_MAP &&
        typeof value === "number" &&
        value > 0
    );
  };

  // 데이터 정제 함수
  const cleanTypeCount = (typeCount: Record<string, number>) => {
    if (!typeCount) return {};

    return Object.fromEntries(
      Object.entries(typeCount).filter(
        ([key, value]) =>
          key &&
          typeof key === "string" &&
          key in API_TO_DISPLAY_LABEL_MAP &&
          typeof value === "number"
      )
    );
  };

  // 값 계산 함수
  const calculateValues = (typeCount: Record<string, number>) => {
    if (!typeCount) return Array(LABELS.length).fill(0);

    const cleanedTypeCount = cleanTypeCount(typeCount);
    return LABELS.map(displayLabel => {
      const apiLabel = Object.entries(API_TO_DISPLAY_LABEL_MAP).find(
        ([, mappedLabel]) => mappedLabel === displayLabel
      )?.[0];
      return apiLabel && cleanedTypeCount[apiLabel] !== undefined ? cleanedTypeCount[apiLabel] : 0;
    });
  };

  // 데이터 유효성 검증
  const hasLastData = isValidData(lastTypeCount);
  const hasCurrentData = isValidData(currentTypeCount);

  // 정규화 함수
  function normalizeRadarValues(values: number[], maxAllowed: number) {
    const maxValue = Math.max(...values, 0);
    if (maxValue > maxAllowed) {
      return values.map(v => (v / maxValue) * maxAllowed);
    }
    return values;
  }

  let lastValues = hasLastData ? calculateValues(lastTypeCount) : Array(LABELS.length).fill(0);
  let currentValues = hasCurrentData
    ? calculateValues(currentTypeCount)
    : Array(LABELS.length).fill(0);

  //정규화 전에 원본 값 저장해야 소숫점 안나옴
  const originalLastValues = [...lastValues];
  const originalCurrentValues = [...currentValues];

  // 정규화: 최댓값이 5를 넘으면 비율로 축소
  const maxAllowed = 5;
  lastValues = normalizeRadarValues(lastValues, maxAllowed);
  currentValues = normalizeRadarValues(currentValues, maxAllowed);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg.attr("width", width).attr("height", height);

    // SVG 필터 정의 (그림자 효과)
    const defs = svg.append("defs");
    const filter = defs
      .append("filter")
      .attr("id", "drop-shadow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");

    filter
      .append("feDropShadow")
      .attr("dx", 2)
      .attr("dy", 2)
      .attr("stdDeviation", 3)
      .attr("flood-color", "#00000040");

    // 🌀 배경 그리드
    for (let level = 1; level <= maxValue; level++) {
      const r = (radius / maxValue) * level;
      const points = d3.range(numAxes).map(i => {
        const angle = angleSlice * i;
        return [
          centerX + r * Math.cos(angle - Math.PI / 2),
          centerY + r * Math.sin(angle - Math.PI / 2),
        ];
      });
      svg
        .append("polygon")
        .attr("points", points.map(p => p.join(",")).join(" "))
        .attr("fill", "none")
        .attr("stroke", isDark ? "#ccc" : "#999")
        .attr("stroke-dasharray", "3 2")
        .attr("opacity", isDark ? 0.3 : 0.4);
    }

    // 🧭 축선과 라벨
    const axisGroup = svg.append("g");

    LABELS.forEach((label, i) => {
      const angle = angleSlice * i;
      const x = centerX + radius * Math.cos(angle - Math.PI / 2);
      const y = centerY + radius * Math.sin(angle - Math.PI / 2);
      const labelX = centerX + (radius + 30) * Math.cos(angle - Math.PI / 2);
      const labelY = centerY + (radius + 30) * Math.sin(angle - Math.PI / 2);

      axisGroup
        .append("line")
        .attr("x1", centerX)
        .attr("y1", centerY)
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke", isDark ? "#aaa" : "#888")
        .attr("stroke-width", 1.5)
        .style("opacity", isDark ? 0.6 : 0.6);

      const group = axisGroup
        .append("g")
        .attr("transform", `translate(${labelX},${labelY})`)
        .style("cursor", "pointer")
        .on("click", () => {
          setSelectedIndex(i);
          onSelectCategory?.(label);
        });

      // ✅ const text 변수 제거하고 직접 체이닝으로 처리
      group
        .append("text")
        .text(label)
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .style("font-size", "14px")
        .attr("fill", isDark ? "#ffffff" : "#333333");
    });

    // 데이터 포인트 계산 함수
    const calculateDataPoints = (values: number[], originalValues: number[]) => {
      return values.map((v, i) => {
        const angle = angleSlice * i;
        const rawScaled = (v / maxValue) * radius;
        const scaled = Math.min(Math.max(rawScaled, 8), radius);
        return {
          x: centerX + scaled * Math.cos(angle - Math.PI / 2),
          y: centerY + scaled * Math.sin(angle - Math.PI / 2),
          value: v, // 정규화된 값 (좌표 계산용)
          originalValue: originalValues[i], // 원본 값 (텍스트 표시용)
        };
      });
    };

    // ✅ 저번 달 데이터가 있을 때만 그래프 그리기
    if (hasLastData) {
      const lastDataPoints = calculateDataPoints(lastValues, originalLastValues);

      // 📈 저번 달 데이터 영역 (파란색)
      const lastArea = svg
        .append("polygon")
        .attr("points", lastDataPoints.map(() => `${centerX},${centerY}`).join(" "))
        .attr("fill", LAST_COLOR)
        .attr("opacity", 0.4)
        .attr("stroke", LAST_COLOR)
        .attr("stroke-width", 2);

      lastArea
        .transition()
        .duration(1000)
        .ease(d3.easeCubicOut)
        .attr("points", lastDataPoints.map(p => `${p.x},${p.y}`).join(" "));

      // ✨ 저번 달 데이터 포인트 (파란색)
      const lastPointsGroup = svg.append("g").attr("class", "last-data-points");

      lastDataPoints.forEach((point, i) => {
        const pointGroup = lastPointsGroup.append("g");

        const circle = pointGroup
          .append("circle")
          .attr("cx", centerX)
          .attr("cy", centerY)
          .attr("r", 2)
          .attr("fill", LAST_COLOR)
          .style("opacity", 0);

        // 애니메이션
        circle
          .transition()
          .duration(1000)
          .ease(d3.easeCubicOut)
          .delay(500)
          .attr("cx", point.x)
          .attr("cy", point.y)
          .style("opacity", 1);
      });
    }

    // ✅ 이번 달 데이터가 있을 때만 그래프 그리기
    if (hasCurrentData) {
      const currentDataPoints = calculateDataPoints(currentValues, originalCurrentValues);

      // 📈 이번 달 데이터 영역 (주황색)
      const currentArea = svg
        .append("polygon")
        .attr("points", currentDataPoints.map(() => `${centerX},${centerY}`).join(" "))
        .attr("fill", CURRENT_COLOR)
        .attr("opacity", 0.4)
        .attr("stroke", CURRENT_COLOR)
        .attr("stroke-width", 2);

      currentArea
        .transition()
        .duration(1000)
        .ease(d3.easeCubicOut)
        .delay(200)
        .attr("points", currentDataPoints.map(p => `${p.x},${p.y}`).join(" "));

      // ✨ 이번 달 데이터 포인트 (주황색)
      const currentPointsGroup = svg.append("g").attr("class", "current-data-points");

      currentDataPoints.forEach((point, i) => {
        const pointGroup = currentPointsGroup.append("g");

        const circle = pointGroup
          .append("circle")
          .attr("cx", centerX)
          .attr("cy", centerY)
          .attr("r", 2)
          .attr("fill", CURRENT_COLOR)
          .style("opacity", 0);

        // 애니메이션
        circle
          .transition()
          .duration(1000)
          .ease(d3.easeCubicOut)
          .delay(700)
          .attr("cx", point.x)
          .attr("cy", point.y)
          .style("opacity", 1);
      });
    }

    // 📝 데이터 없음 메시지 (다크 모드 대응)
    if (!hasLastData && !hasCurrentData) {
      svg
        .append("text")
        .attr("x", centerX)
        .attr("y", centerY)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("font-size", "16px")
        .style("fill", isDark ? "#ffffff" : "#333333") // ✅ 다크 모드 대응
        .text("데이터가 없습니다");
    }
  }, [lastTypeCount, currentTypeCount, hasLastData, hasCurrentData, isDark]); // ✅ isDark 의존성 추가

  return (
    <div className="w-full flex flex-col items-center">
      <svg ref={svgRef}></svg>
      <div className="flex gap-4 mt-4 items-center">
        <div className="flex items-center gap-1">
          <span
            className="inline-block w-4 h-4 rounded-full"
            style={{ background: CURRENT_COLOR }}
          ></span>
          {/* ✅ 범례 텍스트도 다크 모드 대응 */}
          <span 
            className="text-sm font-medium" 
            style={{ color: isDark ? "#ffffff" : "#333333" }}
          >
            이번 달
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span
            className="inline-block w-4 h-4 rounded-full"
            style={{ background: LAST_COLOR }}
          ></span>
          {/* ✅ 범례 텍스트도 다크 모드 대응 */}
          <span 
            className="text-sm font-medium" 
            style={{ color: isDark ? "#ffffff" : "#333333" }}
          >
            저번 달
          </span>
        </div>
      </div>
    </div>
  );
};

export default RadarChart;
