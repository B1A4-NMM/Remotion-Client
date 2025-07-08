import { useEffect } from "react";
import { motion } from "framer-motion";
import { PersonStanding } from "lucide-react";

type MentalType = "stress" | "anxiety" | "depression";

interface PeopleSectionProps {
  type: MentalType;
}

const gridLines = [0, 25, 50, 75, 100];

const peopleDataMap: Record<
  MentalType,
  {
    people: { label: string; level: number }[];
    barColor: string;
  }
> = {
  stress: {
    people: [
      { label: "임구철", level: 80 },
      { label: "정진영", level: 65 },
      { label: "하린", level: 50 },
    ],
    barColor: "#00bcd4", // 청록
  },
  anxiety: {
    people: [
      { label: "서영", level: 70 },
      { label: "현주", level: 55 },
      { label: "다연", level: 40 },
    ],
    barColor: "#8e24aa", // 보라
  },
  depression: {
    people: [
      { label: "민정", level: 85 },
      { label: "하나", level: 60 },
      { label: "소민", level: 45 },
    ],
    barColor: "#ef6c00", // 주황
  },
};

const PeopleSection = ({ type }: PeopleSectionProps) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const { people, barColor } = peopleDataMap[type];

  return (
    <>
      <h1 className="text-white text-xl text-left tracking-tight drop-shadow-md">People</h1>
      <div className="relative w-full max-w-4xl mx-auto h-[17vh] py-2">
        {/* Grid Lines */}
        <ul className="absolute left-0 top-0 w-full h-full z-0">
          {gridLines.map(val => (
            <li
              key={val}
              className="absolute top-0 h-full border-l border-white/20"
              style={{ left: `${val}%` }}
            >
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/60">
                {val}
              </span>
            </li>
          ))}
        </ul>

        {/* Bars + Person */}
        <div className="relative z-10 space-y-12">
          <ul className="relative">
            {people.map((person, idx) => {
              const delay = idx * 0.25;

              return (
                <div key={idx} className="relative h-[3vh] mb-4">
                  {/* 아이콘 */}
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
                    <PersonStanding className="w-5 h-5 text-white animate-pulse" />
                  </motion.div>

                  {/* 퍼센트 바 */}
                  <motion.div
                    className="rounded-r-md overflow-hidden shadow-md h-full relative z-10"
                    style={{ backgroundColor: barColor }}
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: `${person.level}%`, opacity: 1 }}
                    transition={{
                      delay: delay + 0.1,
                      duration: 1.2,
                    }}
                  >
                    <span className="text-white text-sm pl-8 leading-[30px] block">
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
