import { useEffect } from "react";
import { motion } from "framer-motion";
import { User } from "lucide-react"; // lucide 아이콘 사용 시

const skillLevelLabel = ["The basics", "Advanced", "Seasoned", "Expert"];
const gridLines = [0, 25, 50, 75, 100];

const categories = [
  {
    title: "스트레스를 유발한 사람들",
    skills: [
      { label: "임구철", level: 90 },
      { label: "정진영", level: 70 },
      { label: "이하린", level: 60 },
    ],
  },
];

const PeopleSection = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto py-5">
      <ul className="absolute left-0 top-0 w-full h-full z-0">
        {gridLines.map(val => (
          <li
            key={val}
            className="absolute top-0 h-full border-l border-white/20"
            style={{ left: `${val}%` }}
          >
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/60">
              {val === 0 ? "Skill Level" : skillLevelLabel[val / 25 - 1] || ""}
            </span>
          </li>
        ))}
      </ul>

      <div className="relative z-10 space-y-12">
        {categories.map((category, idx) => (
          <div key={idx} className="space-y-4">
            <motion.h2
              className="text-lg font-bold text-white"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 1.5, duration: 0.6 }}
            >
              {category.title}
            </motion.h2>
            <ul className="relative">
              {category.skills.map((skill, sIdx) => (
                <div key={sIdx} className="relative h-[30px] mb-4">
                  {/* 달려가는 사람 아이콘 */}
                  <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: `${skill.level}%` }}
                    transition={{
                      delay: idx * 1.5 + sIdx * 0.2,
                      duration: 1.2,
                      type: "spring",
                    }}
                    className="absolute top-0 left-0"
                  >
                    {/* 이모지 또는 아이콘 */}
                    <span className="text-white text-lg">🏃</span>
                  </motion.div>

                  {/* 실제 그래프 */}
                  <motion.div
                    className="bg-gradient-to-r from-cyan-400 to-teal-400 rounded-r-md overflow-hidden shadow-md h-full"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: `${skill.level}%`, opacity: 1 }}
                    transition={{
                      delay: idx * 1.5 + sIdx * 0.2 + 0.2,
                      duration: 0.6,
                    }}
                  >
                    <span className="text-white text-sm pl-8 leading-[30px] block">
                      {skill.label}
                    </span>
                  </motion.div>
                </div>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PeopleSection;
