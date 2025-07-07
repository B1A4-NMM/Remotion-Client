import { LineChart, Line, XAxis, YAxis, CartesianGrid, LabelList } from "recharts";
import { ChartContainer } from "../../ui/chart";
import { useEffect } from "react";
type MentalType = "stress" | "anxiety" | "depression";

interface MentalChartProps {
  type: MentalType;
}

const mentalData: Record<MentalType, { date: string; value: number }[]> = {
  stress: [
    { date: "2025-06-30", value: 10 },
    { date: "2025-07-01", value: 150 },
    { date: "2025-07-02", value: 150 },
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
  const data = mentalData[type];

  return (
    <div className="w-full h-50 rounded-lg p-1">
      <h1 className="text-white text-xl  text-left tracking-tight drop-shadow-md">Date </h1>
      <ChartContainer config={chartConfig} className="h-full w-full">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
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
            dataKey="value"
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
