import { useEffect } from "react";
import { motion } from "framer-motion";
import { PersonStanding } from "lucide-react";

type MentalType = "스트레스" | "불안" | "우울" | "활력" | "안정" | "유대" ;

interface PeopleSectionProps {
  type: MentalType;
  data: {
    targetId: number;
    targetName: string;
    emotion: string;
    totalIntensity: number;
    count: number;
  }[];
}

const gridLines = [0, 25, 50, 75, 100];

// 감정별 색상 맵
const barColorMap: Record<PeopleSectionProps["type"], string> = {
  스트레스: "#00bcd4",
  불안: "#8e24aa",
  우울: "#ef6c00",
  활력: "#ef6c00",
  안정: "#ef6c00",
  유대: "#ef6c00",
};

const PeopleSection = ({ type, data }: PeopleSectionProps) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const barColor = barColorMap[type];

  // 막대 그래프에 사용할 값 가공
  const people = data.map(p => {
    const level = p.count > 0 ? Math.round(p.totalIntensity / p.count) : 0;
    return { label: p.targetName, level };
  });

  return (
    <>
      <div className="relative w-full max-w-4xl mx-auto h-[30vh] py-2 overflow-hidden">
        <hr className="ml-4 mr-4 mb-6"/>
        {/* 그리드 라인 */}
        <ul className="absolute left-0 top-6 w-full h-full z-0">
          {gridLines.map(val => (
            <li
              key={val}
              className="absolute top-0 h-full border-l border-gray/20"
              style={{ left: `${val}%` }}
            >
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray/60">
                {val}
              </span>
            </li>
          ))}
        </ul>

        {/* 사람 막대 바 */}
        <div className="relative z-10 space-y-12">
          <ul className="relative">
            {people.map((person, idx) => {
              const delay = idx * 0.25;

              return (
                <div key={idx} className="relative h-[3vh] mb-4">
                  {/* 사람 아이콘 */}
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20"
                    initial={{ left: "0%" }}
                    animate={{ left: `${person.level}%` }}
                    transition={{
                      delay,
                      duration: 1.2,
                      ease: "easeOut",
                    }}
                  >
                    <PersonStanding className="w-5 h-5 text-gray animate-pulse" />
                  </motion.div>

                  {/* 퍼센트 바 */}
                  <motion.div
                    className="rounded-r-md overflow-hidden shadow-md h-full relative z-10"
                    style={{ backgroundColor: barColor }}
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: `${person.level ** 2 * 2}%`, opacity: 1 }}
                    transition={{
                      delay: delay + 0.1,
                      duration: 1.2,
                    }}
                  >
                    <span className="text-gray text-sm pl-8 leading-[30px] block">
                      {person.label}
                    </span>
                  </motion.div>
                </div>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default PeopleSection;
