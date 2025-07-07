import React, { useEffect, useState } from "react";
import HexRadarChart from "./../HexRadarChart";
import { motion } from "framer-motion";

const StrengthCard = ({ isActive }: { isActive: boolean }) => {
  const testData = [1, 3, 2, 4, 1, 3];
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (isActive) {
      setShouldShow(true);
    }
  }, [isActive]);

  return (
    <div className="flex flex-col items-start gap-6 w-full pt-4 px-6">
      <h1 className="text-black text-2xl font-bold pt-6">Strength</h1>

      {isActive && (
        <motion.div
          key={Date.now()} // 핵심: key를 바꾸면 컴포넌트가 새로 마운트됨!
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <HexRadarChart values={testData} />
        </motion.div>
      )}
    </div>
  );
};

export default StrengthCard;
