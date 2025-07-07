import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface DoughnutChartProps {
  data: {
    title: string;
    value: number;
    color: string;
  }[];
  size?: number; // optional fallback
  innerCutoutPercentage?: number;
  summaryTitle?: string;
}

const DoughnutChart = ({
  data,
  size = 180,
  innerCutoutPercentage = 40,
  summaryTitle = "TOTAL:",
}: DoughnutChartProps) => {
  const ref = useRef<SVGSVGElement | null>(null);
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const radius = size / 2;
  const innerRadius = radius * (innerCutoutPercentage / 100);

  useEffect(() => {
    if (!ref.current) return;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const group = svg.append("g").attr("transform", `translate(${radius}, ${radius})`);

    const pie = d3
      .pie<(typeof data)[number]>()
      .value(d => d.value)
      .sort(null);

    const arc = d3
      .arc<d3.PieArcDatum<(typeof data)[number]>>()
      .innerRadius(innerRadius)
      .outerRadius(radius);

    const arcs = group.selectAll("path").data(pie(data)).enter().append("path");

    arcs
      .attr("fill", d => d.data.color)
      .transition()
      .duration(1000)
      .attrTween("d", function (d) {
        const i = d3.interpolate({ startAngle: d.startAngle, endAngle: d.startAngle }, d);
        return t => arc(i(t))!;
      });

    group
      .selectAll("text")
      .data(pie(data))
      .enter()
      .append("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", "white")
      .attr("font-size", 12)
      .attr("opacity", 0)
      .transition()
      .delay(1000)
      .duration(500)
      .attr("opacity", 1)
      .text(d => d.data.title);
  }, [data, size, innerCutoutPercentage]);

  return (
    <div className="relative w-full" style={{ aspectRatio: "1 / 1", maxWidth: size }}>
      <svg
        ref={ref}
        viewBox={`0 0 ${size} ${size}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full block"
      />

      <div
        className="absolute top-1/2 left-1/2 text-center text-white pointer-events-none"
        style={{
          transform: "translate(-50%, -50%)",
          width: `${innerRadius * 2}px`,
        }}
      >
        <p className="text-xs opacity-70 tracking-wide">{summaryTitle}</p>
        <p className="text-3xl font-bold">{total}</p>
      </div>
    </div>
  );
};

export default DoughnutChart;
