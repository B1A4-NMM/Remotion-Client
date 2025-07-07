import { LineChart, Line, XAxis, YAxis, CartesianGrid, LabelList } from "recharts";
import { ChartContainer } from "../../ui/chart";
import { useEffect } from "react";
type MentalType = "stress" | "anxiety" | "depression";

interface MentalChartProps {
  type: MentalType;
}

const mentalData: Record<MentalType, { date: string; value: number }[]> = {
  stress: [
    { date: "2025-06-30", value: 237 },
    { date: "2025-07-01", value: 209 },
    { date: "2025-07-02", value: 214 },
  ],
  anxiety: [
    { date: "2025-06-30", value: 120 },
    { date: "2025-07-01", value: 180 },
    { date: "2025-07-02", value: 160 },
  ],
  depression: [
    { date: "2025-06-30", value: 90 },
    { date: "2025-07-01", value: 100 },
    { date: "2025-07-02", value: 110 },
  ],
};

const chartConfig: Record<MentalType, { label: string; color: string }> = {
  stress: {
    label: "스트레스",
    color: "#ff6b6b",
  },
  anxiety: {
    label: "불안",
    color: "#5b9bd5",
  },
  depression: {
    label: "우울",
    color: "#8e44ad",
  },
};

const formatDateToMD = (dateStr: string) => {
  const match = dateStr.match(/\d{4}-(\d{2})-(\d{2})/);
  return match ? `${match[1]}/${match[2]}` : dateStr;
};

const CustomLabel = (props: any) => {
  const { x, y, value } = props;
  return (
    <text x={x} y={y - 10} fill="#ffffff" textAnchor="middle" fontSize="12" fontWeight="500">
      {value}
    </text>
  );
};

const MentalChart = ({ type }: MentalChartProps) => {
  const config = chartConfig[type];
  const data = mentalData[type]; // ✅ 올바르게 데이터 불러오기
  useEffect(() => {
    console.log("✅ 현재 타입:", type);
    console.log("📊 현재 데이터:", data);
  }, [type]);

  return (
    <div className="w-full h-64 rounded-lg p-4">
      <h1 className="text-white text-xl pb-1 px-3 pt-6 text-left tracking-tight drop-shadow-md">
        Date{" "}
      </h1>
      <ChartContainer config={chartConfig} className="h-full w-full">
        <LineChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          <CartesianGrid
            strokeDasharray="none"
            stroke="#525a6a"
            strokeWidth={1}
            horizontal
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickFormatter={formatDateToMD}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#ffffff", fontSize: 12 }}
            interval={0}
          />
          <YAxis hide />
          <Line
            type="monotone"
            dataKey="value" // ✅ 여기도 고정된 key로
            stroke={config.color}
            strokeWidth={2}
            dot={{ fill: config.color, strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, fill: config.color }}
          >
            <LabelList content={CustomLabel} />
          </Line>
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default MentalChart;
