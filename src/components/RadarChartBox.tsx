import React from "react";
import HexRadarChart from "@/components/HexRadarChart";

const RadarChartBox = () => {
  const testData = [1, 3, 2, 4, 1, 3]; // 6개 데이터 (0~4 범위)

  return (
    <main className="min-h-screen bg-black text-white flex flex-col  ">
      <h1>Strength</h1>
      <HexRadarChart values={testData} />
    </main>
  );
};

export default RadarChartBox;
