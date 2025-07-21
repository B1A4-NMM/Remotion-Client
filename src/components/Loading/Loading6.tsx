import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "../theme-provider";
import { motion } from "framer-motion";

const phrases: string[] = [
  "빨간색은 강한 부정적인 감정을 의미해요. ",
  "파란색은 약한 부정적인 감정이에요. ",
  "초록색은 강한 긍정적인 감정입니다.",
  "노란색은 약한 긍정 감정이에요. ",
  "원안의 감정 색이 섞이고 있어요",
];

// 감정 색상 매핑
const emotionColors = {
  red: "#F36B6B", // 빨간색 - 강한 부정
  blue: "#7DA7E3", // 파란색 - 약한 부정
  green: "#72C9A3", // 초록색 - 강한 긍정
  yellow: "#FFD47A", // 노란색 - 약한 긍정
  gray: "#DADADA", // 회색 - 중립
};

const COLORS = ["#82e79f", "#fcbcba", "#f8e76c", "#70cfe4"];

interface CheckRef {
  circle: SVGCircleElement | null;
  check: SVGPolygonElement | null;
  currentAlpha: number;
}

const Loading6: React.FC = () => {
  const phrasesRef = useRef<SVGGElement | null>(null);
  const checksRef = useRef<CheckRef[]>([]);
  const colorMapRef = useRef<string[]>([]);
  const [visiblePhrases, setVisiblePhrases] = useState<number>(0);

  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => {
    colorMapRef.current = phrases.map(() => {
      const randIdx = Math.floor(Math.random() * COLORS.length);
      return COLORS[randIdx];
    });

    // 하나씩 쌓이는 타이머
    const phraseTimer = setInterval(() => {
      if (visiblePhrases < phrases.length) {
        setVisiblePhrases(prev => prev + 1);
      } else {
        // 모든 문구가 표시된 후 다시 처음부터
        setVisiblePhrases(0);
      }
    }, 1500); // 1.5초마다 다음 문구 추가

    return () => clearInterval(phraseTimer);
  }, [visiblePhrases]);

  // 각 문구에 해당하는 감정 색상
  const getEmotionColor = (index: number) => {
    const colorKeys = ["red", "blue", "green", "yellow", "gray"];
    return emotionColors[colorKeys[index] as keyof typeof emotionColors] || emotionColors.gray;
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: " ",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: 400,
          width: 800,
          overflow: "hidden",
        }}
      >
        <svg width="100%" height="100%">
          <defs>
            <mask id="mask" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse">
              <linearGradient id="linearGradient" x2="0" y2="1">
                <stop stopColor="white" stopOpacity="0" offset="0%" />
                <stop stopColor="white" stopOpacity="1" offset="10%" />
                <stop stopColor="white" stopOpacity="1" offset="90%" />
                <stop stopColor="white" stopOpacity="0" offset="100%" />
              </linearGradient>
              <rect width="100%" height="100%" fill="url(#linearGradient)" />
            </mask>
          </defs>

          <g style={{ mask: "url(#mask)" }}>
            <g ref={phrasesRef}>
              {/* 쌓이는 체크리스트 */}
              {phrases.slice(0, visiblePhrases).map((phrase, i) => {
                const y = 40 + i * 60; // 간격을 좁게 조정
                const emotionColor = getEmotionColor(i);
                return (
                  <motion.g
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      ease: "easeOut",
                      delay: i * 0.1, // 각 문구마다 약간의 지연
                    }}
                  >
                    {/* 줄바꿈이 가능한 텍스트 */}
                    <foreignObject x="50" y={y - 10} width="600" height="40">
                      <div
                        style={{
                          fontSize: "16px",
                          fontFamily: "Arial",
                          color: isDark ? "#ffffff" : "#000000",
                          lineHeight: "1.3",
                          wordWrap: "break-word",
                          overflow: "hidden",
                        }}
                      >
                        {phrase}
                      </div>
                    </foreignObject>

                    <g transform={`translate(10 ${y - 15}) scale(.8)`}>
                      {/* 감정 색상 원 */}
                      <motion.circle
                        cx="16"
                        cy="16"
                        r="12"
                        fill={emotionColor}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          duration: 0.4,
                          ease: "easeOut",
                          delay: 0.1 + i * 0.1,
                        }}
                      />

                      {/* 체크 원 테두리 */}
                      <motion.circle
                        ref={el => {
                          if (!checksRef.current[i])
                            checksRef.current[i] = { circle: null, check: null, currentAlpha: 0 };
                          checksRef.current[i].circle = el;
                        }}
                        cx="16"
                        cy="16"
                        r="15"
                        fill="transparent"
                        stroke="#E0E3EF"
                        strokeWidth="1"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          duration: 0.4,
                          ease: "easeOut",
                          delay: 0.2 + i * 0.1,
                        }}
                      />

                      {/* 체크 표시 */}
                      <motion.polygon
                        ref={el => {
                          if (!checksRef.current[i])
                            checksRef.current[i] = { circle: null, check: null, currentAlpha: 0 };
                          checksRef.current[i].check = el;
                        }}
                        points="21.661,7.643 13.396,19.328 9.429,15.361 7.075,17.714 13.745,24.384 24.345,9.708"
                        fill="white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 0.3,
                          ease: "easeOut",
                          delay: 0.4 + i * 0.1,
                        }}
                      />
                    </g>
                  </motion.g>
                );
              })}
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Loading6;
