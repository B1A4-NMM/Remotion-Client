import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const strengthData = {
  지혜: {
    창의성: 4,
    호기심: 3,
    판단력: 5,
    학습애: 4,
    통찰력: 2,
  },
  도전: {
    용감함: 3,
    끈기: 4,
    정직함: 2,
    활력: 5,
  },
  배려: {
    사랑: 5,
    친절함: 4,
    사회적지능: 3,
  },
  협력: {
    팀워크: 4,
    공정함: 3,
    리더십: 5,
  },
  절제: {
    용서: 3,
    겸손: 4,
    신중함: 2,
    자기조절: 5,
  },
  긍정: {
    미적감상: 3,
    감사: 4,
    희망: 5,
    유머: 2,
    영성: 1,
  },
};

type StrengthBarChartProps = {
  category: string;
  color?: string;
};

const StrengthBarChart = ({ category, color = "#a8d5ba" }: StrengthBarChartProps) => {
  const ref = useRef<SVGSVGElement | null>(null);
  const data = strengthData[category];
  const keys = Object.keys(data);

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const width = 300;
    const height = 230;
    const barWidth = 30;
    const gap = 30;

    // 전체 막대 영역의 너비 계산 후, 중앙 offset 계산
    const totalWidth = keys.length * barWidth + (keys.length - 1) * gap;
    const offsetX = (width - totalWidth) / 2;

    svg.attr("width", width).attr("height", height);

    keys.forEach((key, i) => {
      const value = data[key];
      const x = offsetX + i * (barWidth + gap);
      const y = height - value * 25;

      // 막대
      svg
        .append("rect")
        .attr("x", x)
        .attr("y", height - 5)
        .attr("width", barWidth)
        .attr("height", 0)
        .attr("fill", color)
        .transition()
        .duration(800)
        .delay(i * 150)
        .attr("y", y - 30)
        .attr("height", value * 25);

      // 라벨
      svg
        .append("text")
        .attr("x", x + barWidth / 2)
        .attr("y", height - 10)
        .attr("text-anchor", "middle")
        .attr("fill", "#ffff")
        .style("font-size", "13px")
        .text(key);
    });
  }, [category, color]);

  return (
    <div className="flex justify-center w-full">
      <svg ref={ref}></svg>
    </div>
  );
};

export default StrengthBarChart;
