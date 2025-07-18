import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";
import { ChartContainer } from "../../ui/chart";

type MentalType = "스트레스" | "불안" | "우울" | "활력" | "안정" | "유대" ;
interface MentalChartProps {
  type: MentalType;
  data: {
    date: string;
    emotionGroup: string;
    intensity: number;
    count: number;
  }[];
  limit?: number;
}

const chartConfig: Record<MentalType, { label: string; color: string }> = {
  스트레스: { label: "스트레스", color: "#3b82f6" }, // 파란색
  불안: { label: "불안", color: "#8b5cf6" }, // 보라색
  우울: { label: "우울", color: "#f97316" }, // 주황색
  활력: { label: "활력", color: "#f97316" },
  안정: { label: "안정", color: "#f97316" },
  유대: { label: "유대", color: "#f97316" },
};

const formatDateToMD = (dateStr: string) => {
  const match = dateStr.match(/\d{4}-(\d{2})-(\d{2})/);
  return match ? `${match[1]}/${match[2]}` : dateStr;
};

const CustomLabel = (props: any) => {
  const { x, y, value } = props;
  return (
    <text x={x + 20} y={y - 10} fill="#000000" textAnchor="middle" fontSize="12" fontWeight="500">
      {value}
    </text>
  );
};

const MentalChart = ({ type, data, limit }: MentalChartProps) => {
  const config = chartConfig[type];

  const processedData = limit ? data.slice(-limit) : data;

  // API 데이터 매핑: { date, intensity } → { date, value }
  const chartData = processedData.map(item => ({
    date: item.date,
    value: item.intensity,
  }));

  // 최대값 계산 (기본값은 최소 100 보장)
  const maxValue = 100;

  return (
    <div className="w-full rounded-lg p-1">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <BarChart 
          data={chartData} 
          height={154}
          margin={{ top: 25, right: 10, left: 0, bottom: 10 }}
          barCategoryGap="0%"
          barGap={0}
        >
          <defs>
            <linearGradient id={`gradient-${type}`} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor={config.color} stopOpacity={0.9} />
              <stop offset="100%" stopColor={config.color} stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="none"
            stroke="#ffffff"
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
          <Bar
            dataKey="value"
            fill={`url(#gradient-${type})`}
            radius={[4, 4, 0, 0]}
            barSize={40}
          >
            <LabelList content={CustomLabel} />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default MentalChart;
