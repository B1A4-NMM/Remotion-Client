import { useEffect, useRef } from "react";
import * as d3 from "d3";

type MentalType = "스트레스" | "불안" | "우울" | "활력" | "안정" | "유대" ;

interface ActivitySectionProps {
  type: MentalType;
  data: {
    activityId: number;
    activityContent: string;
    emotion: string;
    totalIntensity: number;
    count: number;
    percentage: number;
  }[];
}

const ActivitySection = ({ type, data }: ActivitySectionProps) => {
  const ref = useRef<SVGSVGElement | null>(null);

  const size = 200;
  const radius = size / 2;
  const innerCutoutPercentage = 10;
  const innerRadius = radius * (innerCutoutPercentage / 100);

  // 퍼센트 합계 (그냥 시각화용이니 실제로는 100에 가까워야 함)
  const total = data.reduce((sum, item) => sum + item.percentage, 0);

  // d3에서 쓸 데이터 형태로 변환
  const chartData = data.map((item, index) => ({
    title: item.activityContent,
    value: item.percentage,
    color: d3.schemeTableau10[index % 10], // 자동 색상
  }));

  useEffect(() => {
    if (!ref.current) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const group = svg.append("g").attr("transform", `translate(${radius}, ${radius})`);

    const pie = d3
      .pie<{ title: string; value: number; color: string }>()
      .value(d => d.value)
      .sort(null);

    const arc = d3
      .arc<d3.PieArcDatum<{ title: string; value: number; color: string }>>()
      .innerRadius(innerRadius)
      .outerRadius(radius);

    const arcs = group.selectAll("path").data(pie(chartData)).enter().append("path");

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
      .data(pie(chartData))
      .enter()
      .append("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35rem")
      .attr("fill", "black")
      .attr("font-size", 16)
      .attr("opacity", 0)
      .transition()
      .delay(1000)
      .duration(500)
      .attr("opacity", 1)
      .text(d => d.data.title);
  }, [data]);

  return (
    <section className="w-full">
        <hr className="ml-4 mr-4 mb-6"/>

      <div className="relative w-full h-[18vh]" style={{ aspectRatio: "1 / 1" }}>
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
            width: `${innerCutoutPercentage}%`,
          }}
        ></div>
      </div>
    </section>
  );
};

export default ActivitySection;
