import React, { useEffect, useState } from "react";
import HexRadarChart from "./Strength/HexRadarChart";
import { motion } from "framer-motion";
import StrengthBarChart from "./Strength/StrengthBarChart";

const StrengthCard = ({ isActive }: { isActive: boolean }) => {
  const testData = [1, 3, 2, 4, 1, 3];
  const [shouldShow, setShouldShow] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const labels = ["지혜", "도전", "배려", "협력", "절제", "긍정"];
  const pastelColors = [
    "#a8d5ba", // 연녹색
    "#ffd3b6", // 살구
    "#ffaaa5", // 연분홍
    "#d5c6e0", // 연보라
    "#f8ecc9", // 크림
    "#c1c8e4", // 연하늘
  ];

  useEffect(() => {
    if (isActive) {
      setShouldShow(true);
    }
  }, [isActive]);

  // 🔑 선택된 카테고리의 색상 찾기
  const selectedColor =
    selectedCategory && labels.includes(selectedCategory)
      ? pastelColors[labels.indexOf(selectedCategory)]
      : "#a8d5ba"; // fallback

  return (
    <div className="flex flex-col items-start gap-6 w-full pt-4 px-6">
      <h1 className="text-white text-2xl font-bold pt-6">Strength</h1>

      {isActive && (
        <motion.div
          key={Date.now()}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <HexRadarChart
            values={testData}
            onSelectCategory={label => setSelectedCategory(label)}
            colors={pastelColors}
          />
        </motion.div>
      )}

      {selectedCategory && (
        <div className="mt-8">
          {/* 라벨 + 텍스트를 가로로 정렬 */}
          <div className="flex items-center gap-2 mb-4">
            <div
              className="inline-block px-4 py-1 rounded-full text-lg font-medium shadow"
              style={{
                backgroundColor: selectedColor,
                color: "#333",
              }}
            >
              {selectedCategory}
            </div>
            <h3 className="text-white text-xl ">의 세부 강점</h3>
          </div>

          <StrengthBarChart category={selectedCategory} color={selectedColor} />
        </div>
      )}
    </div>
  );
};

export default StrengthCard;
