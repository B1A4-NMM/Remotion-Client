import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
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
  스트레스: { label: "스트레스", color: "#ee4343" }, // 빨강
  불안: { label: "불안", color: "#a16bcb" }, // 보라색
  우울: { label: "우울", color: "#a8a8a8" }, // 회색
  활력: { label: "활력", color: "#45bdec" },
  안정: { label: "안정", color: "#f28602" },
  유대: { label: "유대", color: "#f8db01" },
};

const formatDateToMD = (dateStr: string) => {
  const match = dateStr.match(/\d{4}-(\d{2})-(\d{2})/);
  return match ? `${match[1]}/${match[2]}` : dateStr;
};

// 수정된 날짜 포맷팅 함수들
const formatDateToTime = (dateStr: string) => {
  const match = dateStr.match(/\d{4}-(\d{2})-(\d{2})/);
  if (!match) return dateStr;
  const month = parseInt(match[1], 10);
  const day = parseInt(match[2], 10);
  return `${month}월 ${day}일`;
};

const formatDateToWeek = (dateStr: string) => {
  // 주별 키 형태: 2025-07-W2
  if (dateStr.includes("-W")) {
    const [yearMonth, week] = dateStr.split("-W");
    const [year, month] = yearMonth.split("-");
    return `${parseInt(month, 10)}월 ${week}번째 주`;
  }

  // 기존 날짜 형태
  const match = dateStr.match(/\d{4}-(\d{2})-(\d{2})/);
  if (!match) return dateStr;

  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const weekNumber = Math.ceil((date.getDate() + firstDay.getDay()) / 7);

  return `${month}월 ${weekNumber}번째 주`;
};

const formatDateToMonth = (dateStr: string) => {
  const match = dateStr.match(/\d{4}-(\d{2})-(\d{2})/);
  if (!match) return dateStr;
  const month = parseInt(match[1], 10);
  return `${month}월`;
};

const groupMap: Record<GroupType, MentalType[]> = {
  부정: ["스트레스", "우울", "불안"],
  긍정: ["활력", "안정", "유대"],
};

function isMentalType(type: any): type is MentalType {
  return ["스트레스", "불안", "우울", "활력", "안정", "유대"].includes(type);
}

const getBarSize = (barCount: number) => {
  if (barCount <= 4) return 50;
  if (barCount <= 7) return 35;
  return 20;
};

const MentalChart = ({ type, data, limit }: MentalChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-48 w-full items-center justify-center rounded-lg border border-dashed">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">데이터가 없습니다</p>
      </div>
    );
  }
  // 그룹형 차트 여부 판별
  const isGroup = type === "부정" || type === "긍정";
  const groupTypes: MentalType[] = isGroup
    ? groupMap[type as GroupType]
    : isMentalType(type)
      ? [type]
      : [];

  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  // 날짜 포맷터 결정 (limit에 따라)
  const getDateFormatter = (limit?: number) => {
    if (limit === 7) return formatDateToTime; // 일간: 일 표시
    if (limit === 8) return formatDateToWeek; // 주간: 월/주 표시
    if (limit === 6) return formatDateToMonth; // 월간: 월 표시
    return formatDateToMD; // 기본: 월/일 표시
  };

  // 막대 개수 결정
  let barCount = 7;
  if (limit === 7)
    barCount = 7; // daily
  else if (limit === 8)
    barCount = 4; // weekly (4주)
  else if (limit === 6) barCount = 4; // monthly (4개월)

  const dateFormatter = getDateFormatter(limit);
  const barSize = getBarSize(barCount);

  // 데이터 그룹화 함수
  const groupDataByPeriodAndEmotion = (data: any[], limit?: number) => {
    if (!limit) return data;
    const groupTarget = barCount;
    const grouped: Record<string, any> = {};
    data.forEach(item => {
      let dateKey: string;
      if (limit === 6) {
        // 월별 그룹화
        const match = item.date.match(/\d{4}-(\d{2})-\d{2}/);
        dateKey = match ? `${item.date.substring(0, 7)}-01` : item.date;
      } else if (limit === 8) {
        // 주별 그룹화
        const date = new Date(item.date);
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const weekNumber = Math.ceil((date.getDate() + firstDay.getDay()) / 7);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        dateKey = `${year}-${month.toString().padStart(2, "0")}-W${weekNumber}`;
      } else {
        // 일별 그룹화
        dateKey = item.date;
      }
      // 날짜와 감정을 조합한 고유 키 생성
      const key = `${dateKey}_${item.emotionGroup}`;
      if (!grouped[key]) {
        grouped[key] = {
          date: dateKey,
          emotionGroup: item.emotionGroup,
          intensity: 0,
          count: 0,
          totalIntensity: 0,
        };
      }
      // 가중평균으로 intensity 계산
      const currentCount = item.count || 1;
      grouped[key].totalIntensity += item.intensity * currentCount;
      grouped[key].count += currentCount;
      grouped[key].intensity = grouped[key].totalIntensity / grouped[key].count;
    });
    // 날짜순으로 정렬 후 limit 적용
    const sortedData = Object.values(grouped).sort((a: any, b: any) =>
      a.date.localeCompare(b.date)
    );
    // 각 날짜별로 limit 적용 (최근 날짜부터)
    const uniqueDates = [...new Set(sortedData.map((item: any) => item.date))];
    const limitedDates = uniqueDates.slice(-groupTarget);
    return sortedData.filter((item: any) => limitedDates.includes(item.date));
  };

  // 그룹형 데이터 가공
  const groupedData = useMemo(() => {
    if (!isGroup) return [];
    // 기간별, 감정별로 데이터 그룹화
    const periodAndEmotionGroupedData = groupDataByPeriodAndEmotion(data, limit);
    // 날짜별로 감정별 intensity를 매핑
    const dateMap: Record<string, any> = {};
    periodAndEmotionGroupedData.forEach(item => {
      if (!dateMap[item.date]) {
        dateMap[item.date] = {
          date: item.date,
          // 모든 감정 타입을 0으로 초기화
          스트레스: 0,
          우울: 0,
          불안: 0,
          활력: 0,
          안정: 0,
          유대: 0,
        };
      }
      dateMap[item.date][item.emotionGroup] = item.intensity;
    });
    // 날짜 정렬
    return Object.values(dateMap).sort((a: any, b: any) => a.date.localeCompare(b.date));
  }, [data, isGroup, limit]);

  // 단일 감정 데이터
  let processedData = data;
  if (limit === 7) {
    processedData = data.slice(-7);
  } else if (limit === 8) {
    processedData = data.slice(-4);
  } else if (limit === 6) {
    processedData = data.slice(-4);
  } else if (limit) {
    processedData = data.slice(-limit);
  }
  const chartData = processedData.map(item => ({
    date: item.date,
    value: item.intensity,
  }));

  // 데이터에서 최대값 계산 (상대적 스케일링을 위해)
  const maxValue = isGroup
    ? Math.max(...groupedData.flatMap(item => groupTypes.map(type => item[type] || 0)), 10) // 최소값 10 보장
    : Math.max(...chartData.map(item => item.value), 10); // 최소값 10 보장

  if (isGroup) {
    return (
      <div className="w-full rounded-lg p-1 relative">
        {/* Legend */}
        <div className="absolute top-0 right-4 flex gap-3 z-10 bg-white/80 rounded-lg px-3 py-1 shadow text-xs">
          {groupTypes.map(gType => (
            <div key={gType} className="flex items-center gap-1">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: chartConfig[gType].color }}
              ></span>
              <span>{chartConfig[gType].label}</span>
            </div>
          ))}
        </div>
        <ChartContainer config={chartConfig} className="h-full w-full mt-3">
          <BarChart
            data={groupedData}
            height={100}
            margin={{ top: 15, right: 10, left: 0, bottom: -10 }}
            barCategoryGap="20%"
            barGap={2}
          >
            <CartesianGrid
              strokeDasharray="none"
              stroke={isDark ? "#ffffff" : "#c6c6c6"}
              strokeWidth={1}
              horizontal
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickFormatter={dateFormatter}
              axisLine={false}
              tickLine={false}
              tick={{
                className: isDark ? "text-white" : "text-gray-400",
                fontSize: 12,
              }}
              interval={limit === 6 ? 0 : limit === 8 ? 0 : "preserveStartEnd"}
              angle={barCount === 7 ? -45 : 0}
              textAnchor={barCount === 7 ? "end" : "middle"}
              height={barCount === 7 ? 60 : 40}
            />

            <YAxis domain={[0, maxValue]} hide />
            {groupTypes.map((gType, idx) => (
              <Bar
                key={gType}
                dataKey={gType}
                fill={chartConfig[gType as MentalType]?.color || "#8884d8"}
                radius={[2, 4, 0, 0]}
                barSize={barSize}
                // label 제거
              />
            ))}
          </BarChart>
        </ChartContainer>
      </div>
    );
  }
};

export default MentalChart;
