import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

type StrengthBarChartProps = {
  totalData: Record<string, number>; // 전체 데이터
  monthlyData: Record<string, number>; // 이번 달 데이터,
  selectedCategory: string | null;
};

const TOTAL_COLOR = "#007aff"; // 전체 데이터 - 파란색
const MONTHLY_COLOR = "#ff9500"; // 이번 달 데이터 - 주황색



const CATEGORY_GROUPS: Record<string, string[]> = {
  지혜: ["창의성", "호기심", "판단력", "학습애", "통찰력"],
  도전: ["용감함", "끈기", "정직함", "활력"],
  정의: ["팀워크", "공정함", "리더십"],
  배려: ["사랑", "친절함", "사회적 지능"],
  절제: ["용서", "겸손", "신중함", "자기 조절"],
  긍정: ["미적 감상", "감사", "희망", "유머"]
};

const StrengthBarChart = ({ totalData, monthlyData, selectedCategory }: StrengthBarChartProps) => {
  const ref = useRef<SVGSVGElement | null>(null);  

  // detailData의 키들을 사용하여 세부 분류 체계 추출
  const detailKeys = CATEGORY_GROUPS[selectedCategory ? selectedCategory : "지혜"];
  console.log(detailKeys)
  
  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    // 동적 차트 크기 (세부 항목 수에 따라 조정)
    const itemCount = detailKeys.length;
    const barWidth = 30;
    const groupGap = 15;
    const barGap = 6;
    const groupWidth = barWidth * 2 + barGap;
    const totalWidth = itemCount * groupWidth + (itemCount - 1) * groupGap;
    const width = Math.max(totalWidth + 100, 400); // 최소 400px
    const height = 300;
    const offsetX = (width - totalWidth) / 2;

    svg.attr("width", width).attr("height", height);

    // 각 세부 분류에 대해 막대 생성
    detailKeys.forEach((key, i) => {
      const totalValue = totalData[key] || 0;
      const monthlyValue = monthlyData[key] || 0;
      
      const groupX = offsetX + i * (groupWidth + groupGap);

      // 전체 데이터 막대 (파란색)
      const totalBarX = groupX;
      const totalBarY = height - totalValue * 25 - 60;

      svg
        .append("rect")
        .attr("x", totalBarX)
        .attr("y", height - 60)
        .attr("width", barWidth)
        .attr("height", 0)
        .attr("fill", TOTAL_COLOR)
        .attr("rx", 4)
        .transition()
        .duration(800)
        .delay(i * 100)
        .attr("y", totalBarY)
        .attr("height", totalValue * 25);

      // 이번 달 데이터 막대 (주황색)
      const monthlyBarX = groupX + barWidth + barGap;
      const monthlyBarY = height - monthlyValue * 25 - 60;

      svg
        .append("rect")
        .attr("x", monthlyBarX)
        .attr("y", height - 60)
        .attr("width", barWidth)
        .attr("height", 0)
        .attr("fill", MONTHLY_COLOR)
        .attr("rx", 4)
        .transition()
        .duration(800)
        .delay(i * 100 + 150)
        .attr("y", monthlyBarY)
        .attr("height", monthlyValue * 25);

      // 전체 데이터 수치 표시
      svg
        .append("text")
        .attr("x", totalBarX + barWidth / 2)
        .attr("y", totalBarY - 8)
        .attr("text-anchor", "middle")
        .attr("fill", TOTAL_COLOR)
        .style("font-size", "12px")
        .style("font-weight", "600")
        .text(totalValue)
        .style("opacity", 0)
        .transition()
        .duration(300)
        .delay(i * 100 + 800)
        .style("opacity", 1);

      // 이번 달 데이터 수치 표시
      svg
        .append("text")
        .attr("x", monthlyBarX + barWidth / 2)
        .attr("y", monthlyBarY - 8)
        .attr("text-anchor", "middle")
        .attr("fill", MONTHLY_COLOR)
        .style("font-size", "12px")
        .style("font-weight", "600")
        .text(monthlyValue)
        .style("opacity", 0)
        .transition()
        .duration(300)
        .delay(i * 100 + 950)
        .style("opacity", 1);

      // 세부 분류 라벨 (한글 표시)
      const displayLabel = key
      
      svg
        .append("text")
        .attr("x", groupX + groupWidth / 2)
        .attr("y", height - 35)
        .attr("text-anchor", "middle")
        .attr("fill", "#333")
        .style("font-size", "13px")
        .style("font-weight", "500")
        .text(displayLabel);
    });

    // 범례 추가
    const legendGroup = svg.append("g").attr("class", "legend");

    // 전체 범례
    legendGroup
      .append("rect")
      .attr("x", width - 130)
      .attr("y", 20)
      .attr("width", 14)
      .attr("height", 14)
      .attr("fill", TOTAL_COLOR)
      .attr("rx", 2);

    legendGroup
      .append("text")
      .attr("x", width - 110)
      .attr("y", 31)
      .attr("fill", "#333")
      .style("font-size", "12px")
      .style("font-weight", "500")
      .text("전체");

    // 이번 달 범례
    legendGroup
      .append("rect")
      .attr("x", width - 70)
      .attr("y", 20)
      .attr("width", 14)
      .attr("height", 14)
      .attr("fill", MONTHLY_COLOR)
      .attr("rx", 2);

    legendGroup
      .append("text")
      .attr("x", width - 50)
      .attr("y", 31)
      .attr("fill", "#333")
      .style("font-size", "12px")
      .style("font-weight", "500")
      .text("이번 달");

    // 격자 라인 추가
    const gridGroup = svg.append("g").attr("class", "grid");
    
    for (let i = 1; i <= 8; i++) {
      const y = height - 60 - (i * 25);
      gridGroup
        .append("line")
        .attr("x1", offsetX - 15)
        .attr("y1", y)
        .attr("x2", offsetX + totalWidth + 15)
        .attr("y2", y)
        .attr("stroke", "#f5f5f5")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "2,2");
    }

  }, [totalData, monthlyData]);

  return (
    <div className="flex justify-left ">
      <div className="absolute flex py-1 px-4 gap-2 mb-4 mt-2">
            <span
              className="inline-block px-4 py-1 rounded-full text-lg font-medium shadow"
            >
              {selectedCategory}
            </span>
            <h3 className="text-black text-xl py-1">의 세부 강점</h3>
          </div>
      <svg ref={ref}></svg>
    </div>
  );
};

export default StrengthBarChart;
