import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type { DetailStrength } from "@/types/strength";

type StrengthBarChartProps = {
  lastData: DetailStrength | null;
  currentData: DetailStrength | null;
  selectedCategory: string | null;
};

const LAST_COLOR = "#007aff"; // 저번 달 데이터 - 파란색
const CURRENT_COLOR = "#ff9500"; // 이번 달 데이터 - 주황색

const CATEGORY_GROUPS: Record<string, string[]> = {
  지혜: ["창의성", "호기심", "판단력", "학습애", "통찰력"],
  도전: ["용감함", "끈기", "정직함", "활력"],
  정의: ["팀워크", "공정함", "리더십"],
  배려: ["사랑", "친절함", "사회적 지능"],
  절제: ["용서", "겸손", "신중함", "자기조절"],
  긍정: ["미적 감상", "감사", "희망", "유머"],
};

const StrengthBarChart = ({ lastData, currentData, selectedCategory }: StrengthBarChartProps) => {
  const ref = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const category = selectedCategory || "지혜";
  const detailKeys = CATEGORY_GROUPS[category] || [];

  console.log("currentData:", currentData);

  // null 체크
  if (!lastData || !currentData) {
    return <div>데이터가 없습니다.</div>;
  }

  // 컨테이너 크기 감지
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerSize({ width, height });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    if (detailKeys.length === 0 || containerSize.width <= 0 || containerSize.height <= 0) {
      return;
    }

    // 컨테이너 크기에 맞춰 동적 조정
    const containerWidth = Math.max(containerSize.width, 300);
    const containerHeight = Math.max(containerSize.height - 50, 200);

    const itemCount = detailKeys.length;
    const availableWidth = containerWidth - 60;
    const groupWidth = Math.min(80, Math.max(50, availableWidth / itemCount));
    const barWidth = Math.min(30, Math.max(15, groupWidth * 0.35));
    const barGap = Math.min(6, Math.max(2, groupWidth * 0.1));
    const groupGap = Math.max(10, (availableWidth - itemCount * groupWidth) / (itemCount - 1));

    const totalWidth = itemCount * groupWidth + (itemCount - 1) * groupGap;
    const offsetX = (containerWidth - totalWidth) / 2;

    const width = containerWidth;
    const height = containerHeight;

    // barHeightRatio를 forEach 밖으로 이동
    const maxBarHeight = Math.max(100, height - 100);
    const barHeightRatio = Math.max(10, Math.min(25, maxBarHeight / 8));

    svg.attr("width", width).attr("height", height);

    // 각 세부 분류에 대해 막대 생성
    detailKeys.forEach((key, i) => {
      const lastValue = Math.max(0, (lastData && lastData[key]) || 0);
      const currentValue = Math.max(0, (currentData && currentData[key]) || 0);

      const groupX = offsetX + i * (groupWidth + groupGap);

      // 막대 높이 계산 (음수 방지)
      const lastBarHeight = Math.max(0, Math.min(lastValue * barHeightRatio, maxBarHeight));
      const currentBarHeight = Math.max(0, Math.min(currentValue * barHeightRatio, maxBarHeight));

      // 저번 달 데이터 막대
      const lastBarX = groupX;
      const lastBarY = Math.max(20, height - lastBarHeight - 60);

      svg
        .append("rect")
        .attr("x", lastBarX)
        .attr("y", height - 60)
        .attr("width", barWidth)
        .attr("height", 0)
        .attr("fill", LAST_COLOR)
        .attr("rx", 4)
        .transition()
        .duration(800)
        .delay(i * 100)
        .attr("y", lastBarY)
        .attr("height", lastBarHeight);

      // 이번 달 데이터 막대
      const currentBarX = groupX + barWidth + barGap;
      const currentBarY = Math.max(20, height - currentBarHeight - 60);

      svg
        .append("rect")
        .attr("x", currentBarX)
        .attr("y", height - 60)
        .attr("width", barWidth)
        .attr("height", 0)
        .attr("fill", CURRENT_COLOR)
        .attr("rx", 4)
        .transition()
        .duration(800)
        .delay(i * 100 + 150)
        .attr("y", currentBarY)
        .attr("height", currentBarHeight);

      // 수치 표시
      const lastTextY = Math.max(15, lastBarY - 8);
      const currentTextY = Math.max(15, currentBarY - 8);

      svg
        .append("text")
        .attr("x", lastBarX + barWidth / 2)
        .attr("y", lastTextY)
        .attr("text-anchor", "middle")
        .attr("fill", LAST_COLOR)
        .style("font-size", "12px")
        .style("font-weight", "600")
        .text(lastValue)
        .style("opacity", 0)
        .transition()
        .duration(300)
        .delay(i * 100 + 800)
        .style("opacity", 1);

      svg
        .append("text")
        .attr("x", currentBarX + barWidth / 2)
        .attr("y", currentTextY)
        .attr("text-anchor", "middle")
        .attr("fill", CURRENT_COLOR)
        .style("font-size", "12px")
        .style("font-weight", "600")
        .text(currentValue)
        .style("opacity", 0)
        .transition()
        .duration(300)
        .delay(i * 100 + 950)
        .style("opacity", 1);

      // 라벨
      svg
        .append("text")
        .attr("x", groupX + groupWidth / 2)
        .attr("y", height - 35)
        .attr("text-anchor", "middle")
        .attr("fill", "#333")
        .style("font-size", "13px")
        .style("font-weight", "500")
        .text(key);
    });

    // 범례 추가
    const legendGroup = svg.append("g").attr("class", "legend");
    const legendX = Math.max(20, width - 140);

    legendGroup
      .append("rect")
      .attr("x", legendX)
      .attr("y", 20)
      .attr("width", 14)
      .attr("height", 14)
      .attr("fill", LAST_COLOR)
      .attr("rx", 2);

    legendGroup
      .append("text")
      .attr("x", legendX + 20)
      .attr("y", 31)
      .attr("fill", "#333")
      .style("font-size", "12px")
      .style("font-weight", "500")
      .text("저번 달");

    legendGroup
      .append("rect")
      .attr("x", legendX + 70)
      .attr("y", 20)
      .attr("width", 14)
      .attr("height", 14)
      .attr("fill", CURRENT_COLOR)
      .attr("rx", 2);

    legendGroup
      .append("text")
      .attr("x", legendX + 90)
      .attr("y", 31)
      .attr("fill", "#333")
      .style("font-size", "12px")
      .style("font-weight", "500")
      .text("이번 달");

    // 격자 라인 추가 (이제 barHeightRatio에 접근 가능)
    const gridGroup = svg.append("g").attr("class", "grid");

    for (let i = 1; i <= 8; i++) {
      const y = height - 60 - i * barHeightRatio;
      if (y > 20) {
        gridGroup
          .append("line")
          .attr("x1", Math.max(0, offsetX - 15))
          .attr("y1", y)
          .attr("x2", Math.min(width, offsetX + totalWidth + 15))
          .attr("y2", y)
          .attr("stroke", "#f5f5f5")
          .attr("stroke-width", 1)
          .attr("stroke-dasharray", "2,2");
      }
    }
  }, [lastData, currentData, selectedCategory, category, detailKeys, containerSize]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <div className="absolute top-0 left-0 flex gap-2 z-10">
        <span className="inline-block px-4 py-1 rounded-full text-lg font-medium shadow">
          {selectedCategory}
        </span>
        <h3 className="text-black text-xl">의 세부 강점</h3>
      </div>
      <div className="pt-12 w-full h-full">
        <svg ref={ref} className="w-full h-full"></svg>
      </div>
    </div>
  );
};

export default StrengthBarChart;
