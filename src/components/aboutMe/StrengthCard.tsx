import React, { useEffect, useState } from "react";
import HexRadarChart from "../analysis/Strength/HexRadarChart";
import StrengthBarChart from "../analysis/Strength/StrengthBarChart";
import { motion } from "framer-motion";
import { useGetStrength } from "@/api/queries/aboutme/useGetStrength";
import type { DetailStrength } from "@/types/strength";

const LABELS = ["지혜", "도전", "정의", "배려", "절제", "긍정"];
const PASTEL_COLORS = ["#a8d5ba", "#ffd3b6", "#ffaaa5", "#d5c6e0", "#f8ecc9", "#c1c8e4"];
const API_TO_DISPLAY_LABEL_MAP: Record<string, string> = {
  지혜: "지혜",
  용기: "도전",
  정의: "정의",
  인애: "배려",
  절제: "절제",
  초월: "긍정",
};

const StrengthCard = ({ isActive }: { isActive: boolean }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data, isLoading, error } = useGetStrength();

  // API label → Display label 변환
  const apiToDisplay = (apiLabel: string) => API_TO_DISPLAY_LABEL_MAP[apiLabel];
  const displayToApi = (displayLabel: string) =>
    Object.entries(API_TO_DISPLAY_LABEL_MAP).find(([, d]) => d === displayLabel)?.[0] || "";

  // ✅ 처음 로딩 후 가장 큰 카테고리를 디폴트로 선택
  useEffect(() => {
    if (data?.typeCount && !selectedCategory) {
      const entries = Object.entries(data.typeCount)
        .map(([apiLabel, value]) => [apiToDisplay(apiLabel), value] as [string, number])
        .filter(([label]) => LABELS.includes(label));

      if (entries.length > 0) {
        const maxEntry = entries.reduce((a, b) => (b[1] > a[1] ? b : a));
        setSelectedCategory(maxEntry[0]);
      }
    }
  }, [data, selectedCategory]);

  const selectedColor = selectedCategory
    ? PASTEL_COLORS[LABELS.indexOf(selectedCategory)]
    : "#a8d5ba";

  const detailData: DetailStrength | null =
    selectedCategory && data?.detailCount
      ? (data.detailCount[displayToApi(selectedCategory)] ?? null)
      : null;

  return (
    <div className="flex flex-col justify-center gap-6 w-full pt-4 px-6">
      {isLoading && <p className="text-white">로딩 중...</p>}
      {error && <p className="text-red-400">에러 발생: {`${error}`}</p>}

      {isActive && data && (
        <motion.div
          key="radar"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <HexRadarChart
            totalTypeCount={data.typeCount}
            monthlyTypeCount={data.typeCount}
            onSelectCategory={setSelectedCategory}
          />
        </motion.div>
      )}

      {selectedCategory && detailData && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <span
              className="inline-block px-4 py-1 rounded-full text-lg font-medium shadow"
              style={{ backgroundColor: selectedColor, color: "#333" }}
            >
              {selectedCategory}
            </span>
            <h3 className="text-black text-xl">의 세부 강점</h3>
          </div>
          <StrengthBarChart
            totalData={detailData}
            monthlyData={detailData}
            selectedCategory={selectedCategory}
          />
        </div>
      )}
    </div>
  );
};

export default StrengthCard;
