import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

type StrengthBarChartProps = {
  data: Record<string, number>; // ✅ props로 받음
  color?: string;
};

const StrengthBarChart = ({ data, color = "#a8d5ba" }: StrengthBarChartProps) => {
  const ref = useRef<SVGSVGElement | null>(null);
  const keys = Object.keys(data);

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const width = 300;
    const height = 230;
    const barWidth = 30;
    const gap = 30;

    const totalWidth = keys.length * barWidth + (keys.length - 1) * gap;
    const offsetX = (width - totalWidth) / 2;

    svg.attr("width", width).attr("height", height);

    keys.forEach((key, i) => {
      const value = data[key];
      const x = offsetX + i * (barWidth + gap);
      const y = height - value * 25;

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

      svg
        .append("text")
        .attr("x", x + barWidth / 2)
        .attr("y", height - 10)
        .attr("text-anchor", "middle")
        .attr("fill", "#ffff")
        .style("font-size", "13px")
        .text(key);
    });
  }, [data, color]);

  return (
    <div className="flex justify-center w-full">
      <svg ref={ref}></svg>
    </div>
  );
};

export default StrengthBarChart;
