import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import React, { useMemo } from "react";
import { useTheme } from "@/components/theme-provider";

type MentalType = "스트레스" | "불안" | "우울" | "활력" | "안정" | "유대";
type GroupType = "부정" | "긍정"; // ✅ 긍정 그룹 추가

interface ActivitySectionProps {
  type: MentalType | GroupType;
  data: {
    activityId: number;
    activityContent: string;
    emotion: string;
    totalIntensity: number;
    count: number;
    percentage: number;
  }[];
}

const emotionColors: Record<MentalType, string> = {
  스트레스: "#fe7575",
  불안: "#c25dee",
  우울: "#485dfe",
  활력: "#45bdec",
  안정: "#f28602",
  유대: "#f8db01",
};

const ActivitySection = ({ type, data }: ActivitySectionProps) => {
  const isGroup = type === "부정" || type === "긍정"; // ✅ 긍정 그룹 지원
  
  // ✅ 그룹별 감정 타입 정의
  const groupTypes: MentalType[] = 
    type === "부정" ? ["스트레스", "우울", "불안"] :
    type === "긍정" ? ["활력", "안정", "유대"] : [];
  
  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const merged = useMemo(() => {
    const map: Record<string, any> = {};
    data.forEach(item => {
      if (!map[item.activityContent]) {
        map[item.activityContent] = { activityContent: item.activityContent };
      }
      map[item.activityContent][item.emotion] = (map[item.activityContent][item.emotion] || 0) + item.totalIntensity;
    });
    
    const arr = Object.values(map);
    arr.sort((a: any, b: any) => {
      // ✅ 그룹별 정렬 로직
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
  }, [data, type]); // ✅ type을 dependency에 추가

  // 사용자 정의 Tooltip 컴포넌트
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // ✅ 그룹별 제목 설정
  const getTitle = () => {
    if (type === "부정") return "상위 10개 활동별 부정적 감정 강도";
    if (type === "긍정") return "상위 10개 활동별 긍정적 감정 강도";
    return "활동별 감정 강도";
  };

  if (isGroup) {
    return (
      <section className="w-full">
        <hr className="ml-4 mr-4 mb-6"/>
        <div className="text-center mb-2">
          <p className="text-sm text-gray-800">{getTitle()}</p>
        </div>
        <div className="relative w-full h-[50vh]">
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
              margin={{ top: 40, right: 20, left: 10, bottom: -20 }}
              barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" hide />
              <YAxis dataKey="activityContent" type="category" width={100} tick={{ fontSize: 13, fill: isDark ? "#ffffff" : "#000000" }} />
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
