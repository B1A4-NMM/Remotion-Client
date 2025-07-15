import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

type RadarChartProps = {
  totalTypeCount: Record<string, number>; // 전체 데이터
  monthlyTypeCount: Record<string, number>; // 이번 달 데이터
  onSelectCategory?: (label: string) => void;
};

const LABELS = ["지혜", "도전", "정의", "배려", "절제", "긍정"];
const TOTAL_COLOR = "#007aff"; // 전체 데이터 - 파란색
const MONTHLY_COLOR = "#ff9500"; // 이번 달 데이터 - 주황색

const API_TO_DISPLAY_LABEL_MAP: Record<string, string> = {
  지혜: "지혜",
  용기: "도전",
  인애: "배려",
  정의: "협력",
  절제: "절제",
  초월: "긍정",
};

const RadarChart = ({ totalTypeCount, monthlyTypeCount, onSelectCategory }: RadarChartProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  const numAxes = LABELS.length;
  const maxValue = 5;
  const width = 300;
  const height = 300;
  const radius = 100;
  const centerX = width / 2;
  const centerY = height / 2;
  const angleSlice = (Math.PI * 2) / numAxes;
  
  // 데이터 정제 함수
  const cleanTypeCount = (typeCount: Record<string, number>) => {
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
    const cleanedTypeCount = cleanTypeCount(typeCount);
    return LABELS.map(displayLabel => {
      const apiLabel = Object.entries(API_TO_DISPLAY_LABEL_MAP).find(
        ([, mappedLabel]) => mappedLabel === displayLabel
      )?.[0];
      return apiLabel && cleanedTypeCount[apiLabel] !== undefined ? cleanedTypeCount[apiLabel] : 0;
    });
  };

  const totalValues = calculateValues(totalTypeCount);
  const monthlyValues = calculateValues(monthlyTypeCount);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg.attr("width", width).attr("height", height);

    // SVG 필터 정의 (그림자 효과)
    const defs = svg.append("defs");
    const filter = defs.append("filter")
      .attr("id", "drop-shadow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");

    filter.append("feDropShadow")
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
        .attr("stroke", "#ccc")
        .attr("stroke-dasharray", "3 2")
        .attr("opacity", 0.3);
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
        .attr("stroke", "#aaa")
        .attr("stroke-width", 1.5)
        .style("opacity", 0.6);

      const group = axisGroup
        .append("g")
        .attr("transform", `translate(${labelX},${labelY})`)
        .style("cursor", "pointer")
        .on("click", () => {
          setSelectedIndex(i);
          onSelectCategory?.(label);
        });

      const text = group
        .append("text")
        .text(label)
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .style("font-size", "14px")
        .attr("fill", "#333");

      const bbox = text.node()?.getBBox();
      if (!bbox) return;

      // 그림자가 있는 흰색 버튼
      group
        .insert("rect", "text")
        .attr("x", bbox.x - 8)
        .attr("y", bbox.y - 4)
        .attr("rx", 8)
        .attr("ry", 8)
        .attr("width", bbox.width + 16)
        .attr("height", bbox.height + 8)
        .attr("fill", "#ffffff")
        .attr("stroke", "#e0e0e0")
        .attr("stroke-width", 1)
        .style("filter", "url(#drop-shadow)");
    });

    // 데이터 포인트 계산 함수
    const calculateDataPoints = (values: number[]) => {
      return values.map((v, i) => {
        const angle = angleSlice * i;
        const rawScaled = (v / maxValue) * radius;
        const scaled = Math.min(Math.max(rawScaled, 8), radius);
        return {
          x: centerX + scaled * Math.cos(angle - Math.PI / 2),
          y: centerY + scaled * Math.sin(angle - Math.PI / 2),
          value: v,
        };
      });
    };

    const totalDataPoints = calculateDataPoints(totalValues);
    const monthlyDataPoints = calculateDataPoints(monthlyValues);

    // 📈 전체 데이터 영역 (파란색)
    const totalArea = svg
      .append("polygon")
      .attr("points", totalDataPoints.map(() => `${centerX},${centerY}`).join(" "))
      .attr("fill", TOTAL_COLOR)
      .attr("opacity", 0.15)
      .attr("stroke", TOTAL_COLOR)
      .attr("stroke-width", 2);

    totalArea
      .transition()
      .duration(1000)
      .ease(d3.easeCubicOut)
      .attr("points", totalDataPoints.map(p => `${p.x},${p.y}`).join(" "));

    // 📈 이번 달 데이터 영역 (주황색)
    const monthlyArea = svg
      .append("polygon")
      .attr("points", monthlyDataPoints.map(() => `${centerX},${centerY}`).join(" "))
      .attr("fill", MONTHLY_COLOR)
      .attr("opacity", 0.15)
      .attr("stroke", MONTHLY_COLOR)
      .attr("stroke-width", 2);

    monthlyArea
      .transition()
      .duration(1000)
      .ease(d3.easeCubicOut)
      .delay(200)
      .attr("points", monthlyDataPoints.map(p => `${p.x},${p.y}`).join(" "));

    // ✨ 전체 데이터 포인트 (파란색)
    const totalPointsGroup = svg.append("g").attr("class", "total-data-points");

    totalDataPoints.forEach((point, i) => {
      const pointGroup = totalPointsGroup.append("g");

      const circle = pointGroup
        .append("circle")
        .attr("cx", centerX)
        .attr("cy", centerY)
        .attr("r", 6)
        .attr("fill", TOTAL_COLOR)
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .style("opacity", 0);

      const text = pointGroup
        .append("text")
        .attr("x", centerX)
        .attr("y", centerY - 15)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("font-size", "12px")
        .style("font-weight", "600")
        .attr("fill", TOTAL_COLOR)
        .text(point.value)
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

      text
        .transition()
        .duration(1000)
        .ease(d3.easeCubicOut)
        .delay(500)
        .attr("x", point.x)
        .attr("y", point.y - 15)
        .style("opacity", 1);
    });

    // ✨ 이번 달 데이터 포인트 (주황색)
    const monthlyPointsGroup = svg.append("g").attr("class", "monthly-data-points");

    monthlyDataPoints.forEach((point, i) => {
      const pointGroup = monthlyPointsGroup.append("g");

      const circle = pointGroup
        .append("circle")
        .attr("cx", centerX)
        .attr("cy", centerY)
        .attr("r", 6)
        .attr("fill", MONTHLY_COLOR)
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .style("opacity", 0);

      const text = pointGroup
        .append("text")
        .attr("x", centerX)
        .attr("y", centerY + 20)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("font-size", "12px")
        .style("font-weight", "600")
        .attr("fill", MONTHLY_COLOR)
        .text(point.value)
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

      text
        .transition()
        .duration(1000)
        .ease(d3.easeCubicOut)
        .delay(700)
        .attr("x", point.x)
        .attr("y", point.y + 20)
        .style("opacity", 1);
    });

  }, [totalTypeCount, monthlyTypeCount]);

  return (
    <div className="w-full flex justify-center p-5">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default RadarChart;
