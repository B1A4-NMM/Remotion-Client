import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import React, { useMemo } from "react";
import { useTheme } from "@/components/theme-provider";

type MentalType = "스트레스" | "불안" | "우울" | "활력" | "안정" | "유대";
type GroupType = "부정" | "긍정";

interface ActivitySectionProps {
  type: MentalType | GroupType;
  data: {
    activityId: number;
    activityContent: string;
    emotion: string;
    totalIntensity: number;
    count: number;
    percentage: number;
    date?: string; // 날짜 정보 추가
  }[];
  selectedPeriod: PeriodType;
}

const emotionColors: Record<MentalType, string> = {
  스트레스: "#ee4343", // 업데이트된 색상
  불안: "#a16bcb",
  우울: "#a8a8a8",
  활력: "#45bdec",
  안정: "#f28602",
  유대: "#f8db01",
};


type PeriodType = "daily" | "weekly" | "monthly";

interface PeriodConfig {
  days: number;
  barCount: number;
  label: string;
}


const ActivitySection = ({ type, data, selectedPeriod }: ActivitySectionProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-48 w-full items-center justify-center rounded-lg border border-dashed">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          데이터가 없습니다
        </p>
      </div>
    );
  }
  const isGroup = type === "부정" || type === "긍정"; 
  const periodConfigs: Record<PeriodType, PeriodConfig> = {
    daily: { days: 7, barCount: 7, label: "일간" },
    weekly: { days: 60, barCount: 8, label: "주간" }, // 2개월 = 60일, 8주
    monthly: { days: 180, barCount: 6, label: "월간" }, // 6개월 = 180일, 6개월
  };
  
  const getPeriodConfig = (period: PeriodType): PeriodConfig => {
    return periodConfigs[period];
  };

  const period = getPeriodConfig(selectedPeriod).days;
  
  const groupTypes: MentalType[] = 
    type === "부정" ? ["스트레스", "우울", "불안"] :
    type === "긍정" ? ["활력", "안정", "유대"] : [];
  
  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  // 기간별 데이터 그룹화 함수
  const groupDataByPeriod = (data: any[], selectedPeriod: string) => {
    if (!selectedPeriod || !data.length) return data;

    // 기간별 제한 개수
    let periodLimit = 7;
    if (selectedPeriod === "weekly") periodLimit = 4;
    else if (selectedPeriod === "monthly") periodLimit = 4;

    const grouped: Record<string, any> = {};
    
    data.forEach(item => {
      let dateKey: string;
      
      if (selectedPeriod === "montly") {
        // 월별 그룹화 (monthly)
        const match = item.date?.match(/\d{4}-(\d{2})-\d{2}/);
        dateKey = match ? `${item.date.substring(0, 7)}-01` : item.date || 'unknown';
      } else if (selectedPeriod === "weekly") {
        // 주별 그룹화 (weekly)
        if (item.date?.includes('-W')) {
          dateKey = item.date;
        } else {
          const date = new Date(item.date || new Date());
          const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
          const weekNumber = Math.ceil((date.getDate() + firstDay.getDay()) / 7);
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          dateKey = `${year}-${month.toString().padStart(2, '0')}-W${weekNumber}`;
        }
      } else if (selectedPeriod === "daily") {
        // 일별 그룹화 (daily)
        dateKey = item.date || 'unknown';
      } else {
        // 기본값: 일별 그룹화
        dateKey = item.date || 'unknown';
      }

      // 활동과 날짜를 조합한 고유 키 생성
      const key = `${dateKey}_${item.activityContent}_${item.emotion}`;

      if (!grouped[key]) {
        grouped[key] = {
          activityId: item.activityId,
          activityContent: item.activityContent,
          emotion: item.emotion,
          totalIntensity: 0,
          count: 0,
          percentage: 0,
          date: dateKey
        };
      }
      
      // 가중평균으로 intensity 계산
      const currentCount = item.count || 1;
      grouped[key].totalIntensity += item.totalIntensity * currentCount;
      grouped[key].count += currentCount;
      grouped[key].totalIntensity = grouped[key].totalIntensity / grouped[key].count;
    });

    // 날짜순으로 정렬 후 limit 적용
    const sortedData = Object.values(grouped).sort((a: any, b: any) => a.date.localeCompare(b.date));
    
    // 각 날짜별로 limit 적용 (최근 날짜부터)
    const uniqueDates = [...new Set(sortedData.map((item: any) => item.date))];
    const limitedDates = uniqueDates.slice(-periodLimit);
    
    return sortedData.filter((item: any) => limitedDates.includes(item.date));
  };

  const merged = useMemo(() => {
    // 기간별 데이터 그룹화 적용
    const periodGroupedData = groupDataByPeriod(data, selectedPeriod);
    
    const map: Record<string, any> = {};
    periodGroupedData.forEach(item => {
      if (!map[item.activityContent]) {
        map[item.activityContent] = { activityContent: item.activityContent };
      }
      map[item.activityContent][item.emotion] = (map[item.activityContent][item.emotion] || 0) + item.totalIntensity;
    });
    
    const arr = Object.values(map);
    arr.sort((a: any, b: any) => {
      // 그룹별 정렬 로직
      let sumA, sumB;
      if (type === "부정") {
        sumA = (a["스트레스"] || 0) + (a["우울"] || 0) + (a["불안"] || 0);
        sumB = (b["스트레스"] || 0) + (b["우울"] || 0) + (b["불안"] || 0);
      } else if (type === "긍정") {
        sumA = (a["활력"] || 0) + (a["안정"] || 0) + (a["유대"] || 0);
        sumB = (b["활력"] || 0) + (b["안정"] || 0) + (b["유대"] || 0);
      } else {
        sumA = sumB = 0;
      }
      return sumB - sumA;
    });
    return arr.slice(0, 10);
  }, [data, type, selectedPeriod]);

  // 사용자 정의 Tooltip 컴포넌트
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: {Math.round(entry.value * 100) / 100}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };


  if (isGroup) {
    return (
      <section className="w-full">
        <div className="relative w-full h-[55vh]">
          {/* Legend */}
          <div className="absolute top-2 right-4 flex gap-3 z-10 bg-white/80 rounded-lg px-3 py-1 shadow text-xs">
            {groupTypes.map((gType) => (
              <div key={gType} className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: emotionColors[gType] }}></span>
                <span>{gType}</span>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={merged}
              layout="vertical"
              margin={{ top: 40, right: 20, left: 10, bottom: 0 }}
              barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="activityContent" 
                type="category" 
                width={100} 
                tick={{ fontSize: 13, fill: isDark ? "#ffffff" : "#000000" }} 
              />
              <Tooltip content={<CustomTooltip />} />
              {groupTypes.map((gType) => (
                <Bar
                  key={gType}
                  dataKey={gType}
                  stackId="emotions"
                  fill={emotionColors[gType]}
                  isAnimationActive={false}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    );
  }
  
  return null;
};

export default ActivitySection;
