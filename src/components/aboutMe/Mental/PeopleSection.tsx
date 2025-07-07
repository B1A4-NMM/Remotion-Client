import { useEffect } from "react";
import { motion } from "framer-motion";

interface Skill {
  label: string;
  level: number; // 0~100
}

interface SkillCategory {
  title: string;
  skills: Skill[];
  delay?: number;
}

interface PeopleSectionProps {
  categories: SkillCategory[];
}

const skillLevelLabel = ["The basics", "Advanced", "Seasoned", "Expert"];

const gridLines = [0, 25, 50, 75, 100];

const PeopleSection = ({ categories }: PeopleSectionProps) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto py-16">
      {/* Vertical grid lines */}
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

      {/* Content */}
      <div className="relative z-10 space-y-12">
        {categories.map((category, idx) => (
          <div key={idx} className="space-y-4">
            <motion.h2
              className="text-lg font-bold text-white"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: category.delay ?? idx * 1.5, duration: 0.6 }}
            >
              {category.title}
            </motion.h2>
            <ul>
              {category.skills.map((skill, sIdx) => (
                <motion.li
                  key={sIdx}
                  className="bg-gradient-to-r from-cyan-400 to-teal-400 rounded-r-md overflow-hidden mb-2 shadow-md"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: `${skill.level}%`, opacity: 1 }}
                  transition={{ delay: (category.delay ?? idx * 1.5) + sIdx * 0.2, duration: 0.6 }}
                >
                  <span className="text-white text-sm pl-3 leading-[30px] block">
                    {skill.label}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PeopleSection;
