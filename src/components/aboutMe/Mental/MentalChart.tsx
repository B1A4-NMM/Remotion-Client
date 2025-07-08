import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer } from "../../ui/chart";

type MentalType = "스트레스" | "불안" | "우울";

interface MentalChartProps {
  type: MentalType;
  data: {
    date: string;
    emotionGroup: string;
    intensity: number;
    count: number;
  }[];
}

const chartConfig: Record<MentalType, { label: string; color: string }> = {
  스트레스: { label: "스트레스", color: "#ff6b6b" },
  불안: { label: "불안", color: "#5b9bd5" },
  우울: { label: "우울", color: "#8e44ad" },
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

const MentalChart = ({ type, data }: MentalChartProps) => {
  const config = chartConfig[type];

  // API 데이터 매핑: { date, intensity } → { date, value }
  const chartData = data.map(item => ({
    date: item.date,
    value: item.intensity,
  }));

  // 최대값 계산 (기본값은 최소 100 보장)
  const maxValue = Math.max(...chartData.map(d => d.value), 100);

  return (
    <div className="w-full h-[20vh] rounded-lg p-1">
      <h1 className="text-white text-xl text-left tracking-tight drop-shadow-md mb-2">
        날짜별 {config.label}
      </h1>
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer width="100%">
          <LineChart data={chartData} margin={{ top: 15, right: 10, left: 10, bottom: 10 }}>
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
            <YAxis domain={[0, maxValue]} hide />
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
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default MentalChart;
