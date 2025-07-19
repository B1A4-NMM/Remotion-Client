import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

type MentalType = "스트레스" | "불안" | "우울" | "활력" | "안정" | "유대";
type GroupType = "부정" | "긍정";

interface PeopleSectionProps {
  type: MentalType | GroupType;
  data: {
    targetId: number;
    targetName: string;
    emotion: string;
    totalIntensity: number;
    count: number;
    date?: string; // 날짜 정보 추가
  }[];
  selectedPeriod: PeriodType;
}

type PeriodType = "daily" | "weekly" | "monthly";

interface PeriodConfig {
  days: number;
  barCount: number;
  label: string;
}

const PeopleSection = ({ type, data, selectedPeriod }: PeopleSectionProps) => {
  const navigate = useNavigate();
  const periodConfigs: Record<PeriodType, PeriodConfig> = {
    daily: { days: 7, barCount: 7, label: "일간" },
    weekly: { days: 60, barCount: 8, label: "주간" }, // 2개월 = 60일, 8주
    monthly: { days: 180, barCount: 6, label: "월간" }, // 6개월 = 180일, 6개월
  };
  
  const getPeriodConfig = (period: PeriodType): PeriodConfig => {
    return periodConfigs[period];
  };

  const period = getPeriodConfig(selectedPeriod).days;

  const isGroup = type === "부정" || type === "긍정";

  // 기간별 데이터 그룹화 함수
  const groupDataByPeriod = (data: any[], selectedPeriod?: string) => {
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

      // 사람과 날짜를 조합한 고유 키 생성
      const key = `${dateKey}_${item.targetId}_${item.emotion}`;

      if (!grouped[key]) {
        grouped[key] = {
          targetId: item.targetId,
          targetName: item.targetName,
          emotion: item.emotion,
          totalIntensity: 0,
          count: 0,
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
    if (!isGroup) return [];
    
    // 기간별 데이터 그룹화 적용
    const periodGroupedData = groupDataByPeriod(data, selectedPeriod);
    
    // targetId를 키로 사용 (문자열로 변환)
    const map: Record<string, { targetId: number, targetName: string; totalIntensity: number }> = {};
    periodGroupedData.forEach(item => {
      const key = item.targetId.toString(); // targetId를 문자열로 변환
      if (!map[key]) {
        map[key] = { targetId: item.targetId, targetName: item.targetName, totalIntensity: 0 };
      }
      map[key].totalIntensity += item.totalIntensity;
    });
    
    // 상위 3명만
    const arr = Object.values(map);
    arr.sort((a, b) => b.totalIntensity - a.totalIntensity);
    return arr.slice(0, 3);
  }, [data, isGroup, selectedPeriod]);

  const onClickHandler = ({ id }: { id: number }) => {
    navigate(`/relation/${id}`);
  }



  if (isGroup) {
    return (
      <div className="w-full py-4 px-4">
        <div className="flex flex-col gap-4 max-w-md mx-auto">
          {merged.map((person, idx) => {
            return (
              <div
                key={person.targetId}
                className="
                  bg-white border-2 border-gray-200
                  rounded-xl p-4 shadow-lg hover:shadow-xl
                  transition-all duration-300 hover:scale-105
                  transform cursor-pointer
                "
                onClick={() => onClickHandler({ id: person.targetId })}
              >
                <div className="flex items-center justify-between">
                  {/* 순위 배지 */}
                  <div className="
                    bg-gray-800 text-white
                    w-10 h-10 rounded-full flex items-center justify-center
                    font-bold text-lg shadow-md
                  ">
                    {idx + 1}
                  </div>
  
                  {/* 이름 */}
                  <div className="flex-1 text-center">
                    <span className="text-2xl font-bold text-gray-800">
                      {person.targetName}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  
  return null;
};

export default PeopleSection;
