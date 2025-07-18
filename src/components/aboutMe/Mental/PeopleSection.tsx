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
  }[];
}

const PeopleSection = ({ type, data }: PeopleSectionProps) => {
  const navigate = useNavigate();

  console.log(data);
  const isGroup = type === "부정" || type==="긍정";
  const merged = useMemo(() => {
    if (!isGroup) return [];
    
    // ✅ targetId를 키로 사용 (문자열로 변환)
    const map: Record<string, { targetId: number, targetName: string; totalIntensity: number }> = {};
    data.forEach(item => {
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
  }, [data, isGroup]);

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
                key={person.targetId} // ✅ targetId를 key로 사용
                className="
                  bg-white border-2 border-gray-200
                  rounded-xl p-4 shadow-lg hover:shadow-xl
                  transition-all duration-300 hover:scale-105
                  transform cursor-pointer
                "
                onClick={() => onClickHandler({ id: person.targetId })} // ✅ 객체 형태로 전달
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
