import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";
import { ChartContainer } from "../../ui/chart";
import { useMemo } from "react";
import { useTheme } from "@/components/theme-provider";

type MentalType = "스트레스" | "불안" | "우울" | "활력" | "안정" | "유대";
type GroupType = "부정" | "긍정";
interface MentalChartProps {
  type: MentalType | GroupType;
  data: {
    date: string;
    emotionGroup: string;
    intensity: number;
    count: number;
  }[];
  limit?: number;
}

const chartConfig: Record<MentalType, { label: string; color: string }> = {
  스트레스: { label: "스트레스", color: "#fe7575" }, // 빨강
  불안: { label: "불안", color: "#c25dee" }, // 보라색
  우울: { label: "우울", color: "#485dfe" }, // 남색
  활력: { label: "활력", color: "#45bdec" },
  안정: { label: "안정", color: "#f28602" },
  유대: { label: "유대", color: "#f8db01" },
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

const groupMap: Record<GroupType, MentalType[]> = {
  부정: ["스트레스", "우울", "불안"],
  긍정: ["활력", "안정", "유대"],
};

function isMentalType(type: any): type is MentalType {
  return ["스트레스", "불안", "우울", "활력", "안정", "유대"].includes(type);
}

const MentalChart = ({ type, data, limit }: MentalChartProps) => {
  // 그룹형 차트 여부 판별
  const isGroup = type === "부정" || type === "긍정";
  const groupTypes: MentalType[] = isGroup ? groupMap[type as GroupType] : isMentalType(type) ? [type] : [];

  const { theme } = useTheme();
  const isDark =
  theme === "dark" ||
  (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);




  // 그룹형 데이터 가공
  const groupedData = useMemo(() => {
    if (!isGroup) return [];
    
    // 날짜별로 감정별 intensity를 매핑
    const dateMap: Record<string, any> = {};
    data.forEach(item => {
      if (!dateMap[item.date]) dateMap[item.date] = { date: item.date };
      dateMap[item.date][item.emotionGroup] = item.intensity;
    });
    
    // 날짜 정렬
    let sortedData = Object.values(dateMap).sort((a: any, b: any) => a.date.localeCompare(b.date));
    
    // limit 적용 (최근 데이터부터)
    if (limit) {
      sortedData = sortedData.slice(-limit);
    }
    
    return sortedData;
  }, [data, isGroup, limit]); // dependency에 limit 추가
  

  // 단일 감정 데이터
  const processedData = limit ? data.slice(-limit) : data;
  const chartData = processedData.map(item => ({
    date: item.date,
    value: item.intensity,
  }));
  const maxValue = 100;

  if (isGroup) {
    return (
      <div className="w-full rounded-lg p-1 relative">
        {/* Legend */}
        <div className="absolute top-0 right-4 flex gap-3 z-10 bg-white/80 rounded-lg px-3 py-1 shadow text-xs">
          {groupTypes.map((gType) => (
            <div key={gType} className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: chartConfig[gType].color }}></span>
              <span>{chartConfig[gType].label}</span>
            </div>
          ))}
        </div>
        <ChartContainer config={chartConfig} className="h-full w-full mt-3">
          <BarChart
            data={groupedData}
            height={154}
            margin={{ top: 25, right: 10, left: 0, bottom: -10 }}
            barCategoryGap="20%"
            barGap={2}
          >
            <CartesianGrid
              strokeDasharray="none"
              stroke= {isDark? "#ffffff": "#c6c6c6"}
              strokeWidth={1}
              horizontal
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickFormatter={formatDateToMD}
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark? "#ffffff": "#c6c6c6", fontSize: 12 }}
              interval={0}
            />
            <YAxis domain={[0, maxValue]} hide />
            {groupTypes.map((gType, idx) => (
              <Bar
                key={gType}
                dataKey={gType}
                fill={chartConfig[gType as MentalType]?.color || "#8884d8"}
                radius={[2, 4, 0, 0]}
                barSize={5}
                // label 제거
              />
            ))}
          </BarChart>
        </ChartContainer>
      </div>
    );
  }

  // 기존 단일 감정 차트
  return (
    <div className="w-full rounded-lg p-1">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <BarChart 
          data={chartData} 
          height={154}
          margin={{ top: 25, right: 10, left: 0, bottom: -10 }}
          barCategoryGap="0%"
          barGap={0}
        >
          <defs>
            <linearGradient id={`gradient-${type}`} x1="0" y1="1" x2="0" y2="0">
              {isMentalType(type) ? (
                <>
                  <stop offset="0%" stopColor={chartConfig[type].color} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={chartConfig[type].color} stopOpacity={0.4} />
                </>
              ) : null}
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
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default MentalChart;
