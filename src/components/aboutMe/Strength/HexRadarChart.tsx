import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

type RadarChartProps = {
  typeCount: Record<string, number>; // 서버에서 받은 원본
  onSelectCategory?: (label: string) => void;
  colors?: string[];
};

const LABELS = ["지혜", "도전", "정의", "배려", "절제", "긍정"];
const PASTEL_COLORS = ["#a8d5ba", "#ffd3b6", "#ffaaa5", "#d5c6e0", "#f8ecc9", "#c1c8e4"];
const API_TO_DISPLAY_LABEL_MAP: Record<string, string> = {
  지혜: "지혜",
  용기: "도전",
  인애: "배려",
  정의: "협력",
  절제: "절제",
  초월: "긍정",
};

const RadarChart = ({ typeCount, onSelectCategory, colors }: RadarChartProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const pastelColors = colors ?? PASTEL_COLORS;
  const numAxes = LABELS.length;
  const maxValue = 5;
  const width = 300;
  const height = 300;
  const radius = 100;
  const centerX = width / 2;
  const centerY = height / 2;
  const angleSlice = (Math.PI * 2) / numAxes;
  const cleanedTypeCount = Object.fromEntries(
    Object.entries(typeCount).filter(
      ([key, value]) =>
        key &&
        typeof key === "string" &&
        key in API_TO_DISPLAY_LABEL_MAP &&
        typeof value === "number"
    )
  );
  const rawValues = LABELS.map(displayLabel => {
    const apiLabel = Object.entries(API_TO_DISPLAY_LABEL_MAP).find(
      ([, mappedLabel]) => mappedLabel === displayLabel
    )?.[0];

    if (!apiLabel || typeof cleanedTypeCount[apiLabel] !== "number") {
      return 0; // ← 이거 추가!!
    }

    return cleanedTypeCount[apiLabel];
  });

  // ✅ typeCount에서 values 계산
  const values = LABELS.map(displayLabel => {
    const apiLabel = Object.entries(API_TO_DISPLAY_LABEL_MAP).find(
      ([, mappedLabel]) => mappedLabel === displayLabel
    )?.[0];
    return apiLabel && cleanedTypeCount[apiLabel] !== undefined ? cleanedTypeCount[apiLabel] : 0;
  });
  console.log("✅ cleanedTypeCount:", cleanedTypeCount);
  console.log("✅ rawValues:", rawValues);
  console.log(
    "✅ scaled values:",
    rawValues.map(v => (v / maxValue) * radius)
  );
  const highlightIndex = values.indexOf(Math.max(...values));

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg.attr("width", width).attr("height", height);

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

      group
        .insert("rect", "text")
        .attr("x", bbox.x - 8)
        .attr("y", bbox.y - 4)
        .attr("rx", 8)
        .attr("ry", 8)
        .attr("width", bbox.width + 16)
        .attr("height", bbox.height + 8)
        .attr("fill", pastelColors[i])
        .attr("stroke", "#ccc")
        .attr("stroke-width", 1);
    });

    // 📈 데이터 영역 (폴리곤)
    const dataPoints = values.map((v, i) => {
      const angle = angleSlice * i;
      const rawScaled = (v / maxValue) * radius;
      const scaled = Math.min(Math.max(rawScaled, 8), radius); // 최소 8, 최대 radius
      return {
        x: centerX + scaled * Math.cos(angle - Math.PI / 2),
        y: centerY + scaled * Math.sin(angle - Math.PI / 2),
      };
    });

    const area = svg
      .append("polygon")
      .attr("points", dataPoints.map(() => `${centerX},${centerY}`).join(" "))
      .attr("fill", pastelColors[highlightIndex])
      .attr("opacity", 0.75);

    area
      .transition()
      .duration(1000)
      .ease(d3.easeCubicOut)
      .attr("points", dataPoints.map(p => `${p.x},${p.y}`).join(" "));
  }, [typeCount]);

  return (
    <div className="w-full flex justify-center">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default RadarChart;
