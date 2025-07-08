import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
type RadarChartProps = {
  values: number[];
  onSelectCategory?: (label: string) => void;
  colors?: string[];
};

const RadarChart = ({ values, colors, onSelectCategory }: RadarChartProps) => {
  const svgRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const pastelColors = colors ?? [
    // 기본 색상 지정 (옵션이 없을 때 대비)
    "#a8d5ba",
    "#ffd3b6",
    "#ffaaa5",
    "#d5c6e0",
    "#f8ecc9",
    "#c1c8e4",
  ];
  const data = values;
  const labels = ["지혜", "도전", "배려", "협력", "절제", "긍정"];

  const maxValue = 5;
  const numAxes = labels.length;

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 300;
    const height = 300;
    const radius = 100;
    const centerX = width / 2;
    const centerY = height / 2;

    svg.attr("width", width).attr("height", height);

    const angleSlice = (Math.PI * 2) / numAxes;

    // Background grid lines
    for (let level = 1; level <= maxValue; level++) {
      const levelFactor = (radius / maxValue) * level;
      const points = d3.range(numAxes).map(i => {
        const angle = angleSlice * i;
        return [
          centerX + levelFactor * Math.cos(angle - Math.PI / 2),
          centerY + levelFactor * Math.sin(angle - Math.PI / 2),
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

    // Axis lines and labels (as button UI)
    const axisGroup = svg.append("g");
    labels.forEach((label, i) => {
      const angle = angleSlice * i;
      const x = centerX + radius * Math.cos(angle - Math.PI / 2);
      const y = centerY + radius * Math.sin(angle - Math.PI / 2);
      const labelDistance = 32;
      const labelX = centerX + (radius + labelDistance) * Math.cos(angle - Math.PI / 2);
      const labelY = centerY + (radius + labelDistance) * Math.sin(angle - Math.PI / 2);

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
        .on("click", function () {
          setSelectedIndex(i);
          if (onSelectCategory) onSelectCategory(labels[i]);

          d3.select(this)
            .select("rect")
            .transition()
            .duration(150)
            .attr("fill", "#e0e0e0")
            .transition()
            .duration(150)
            .attr("fill", pastelColors[i]);
        });

      const text = group
        .append("text")
        .text(label)
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .style("font-size", "14px")

        .attr("fill", "#333");

      const bbox = text.node().getBBox();

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

    // Data area
    const dataPoints = data.map((d, i) => {
      const angle = angleSlice * i;
      const value = (d / maxValue) * radius;
      return {
        x: centerX + value * Math.cos(angle - Math.PI / 2),
        y: centerY + value * Math.sin(angle - Math.PI / 2),
      };
    });

    const area = svg
      .append("polygon")
      .attr("points", dataPoints.map(() => `${centerX},${centerY}`).join(" "))
      .attr("fill", "#66c2a5")
      .attr("opacity", 0.8);

    area
      .transition()
      .duration(1200)
      .ease(d3.easeCubicOut)
      .attr("points", dataPoints.map(p => `${p.x},${p.y}`).join(" "));
  }, [selectedIndex]);

  return (
    <div className="w-full flex justify-center">
      <svg ref={svgRef}></svg>
      {/* {selectedIndex !== null && (
        <div className="absolute top-5 text-white text-sm">
          {labels[selectedIndex]} 라벨이 선택됨!
        </div>
      )} */}
    </div>
  );
};

export default RadarChart;
