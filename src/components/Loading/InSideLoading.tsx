import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "../theme-provider";
import { motion } from "framer-motion";

const phrases: string[] = [
  "이슬 안에 감정 색이 섞이고 있어요",
  "빨강은 강한 부정",
  "파랑은 약한 부정",
  "초록은 강한 긍정",
  "노랑은 약한 긍정이에요",
];

// 감정 색상 매핑
const emotionColors = {
  gray: "#DADADA", // 회색 - 중립
  red: "#F36B6B", // 빨간색 - 강한 부정
  blue: "#7DA7E3", // 파란색 - 약한 부정
  green: "#72C9A3", // 초록색 - 강한 긍정
  yellow: "#FFD47A", // 노란색 - 약한 긍정
};

const COLORS = ["#82e79f", "#fcbcba", "#f8e76c", "#70cfe4"];

interface CheckRef {
  circle: SVGCircleElement | null;
  check: SVGPolygonElement | null;
  currentAlpha: number;
}

interface Loading6Props {
  onComplete?: (isComplete: boolean) => void;
}

const Loading6: React.FC<Loading6Props> = ({ onComplete }) => {
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
      setVisiblePhrases(prev => {
        if (prev < phrases.length) {
          return prev + 1;
        }
        return prev; // 모든 문구가 표시된 후에는 그대로 유지
      });
    }, 1300); // 1.5초마다 다음 문구 추가

    return () => clearInterval(phraseTimer);
  }, []); // 의존성 배열을 비워서 무한 루프 방지

  // 각 문구에 해당하는 감정 색상
  const getEmotionColor = (index: number) => {
    const colorKeys = ["gray", "red", "blue", "green", "yellow"];
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
        WebkitTransform: "translateZ(0)", // 모바일 하드웨어 가속
        transform: "translateZ(0)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          maxHeight: "500px",
          maxWidth: "800px",
          overflow: "hidden",
          WebkitOverflowScrolling: "touch", // iOS 스크롤 최적화
        }}
      >
        <svg width="100%" height="100%">
          <defs>
            <mask id="mask" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse">
              <linearGradient id="linearGradient" x2="0" y2="1">
                <stop stopColor="white" stopOpacity="0" offset="0%" />
                <stop stopColor="white" stopOpacity="1" offset="10%" />
                <stop stopColor="white" stopOpacity="1" offset="100%" />
                <stop stopColor="white" stopOpacity="0" offset="100%" />
              </linearGradient>
              <rect width="100%" height="100%" fill="url(#linearGradient)" />
            </mask>

            {/* 완료 상태일 때의 반짝이는 효과 */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g style={{ mask: "url(#mask)" }}>
            <g ref={phrasesRef}>
              {/* 쌓이는 체크리스트 */}
              {phrases.slice(0, visiblePhrases).map((phrase, i) => {
                const y = 40 + i * 50; // 간격을 좁게 조정
                const emotionColor = getEmotionColor(i);
                return (
                  <motion.g
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.8,
                      ease: [0.25, 0.46, 0.45, 0.94], // iOS 호환성 좋은 이징
                      delay: i * 0.2,
                      type: "tween", // spring 대신 tween 사용
                    }}
                    style={{
                      willChange: "transform, opacity", // iOS 성능 최적화
                      WebkitTransform: "translateZ(0)", // 하드웨어 가속
                      transform: "translateZ(0)",
                    }}
                  >
                    {/* 줄바꿈이 가능한 텍스트 */}
                    <foreignObject x="50" y={y - 15} width="600" height="50">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          ease: [0.25, 0.46, 0.45, 0.94],
                          delay: 0.2 + i * 0.2,
                        }}
                        style={{
                          fontSize: "16px",
                          fontFamily: "Arial",
                          color: isDark ? "#ffffff" : "#000000",
                          lineHeight: "1.3",
                          wordWrap: "break-word",
                          overflow: "visible",
                          position: "relative",
                          willChange: "transform, opacity",
                          WebkitTransform: "translateZ(0)",
                          transform: "translateZ(0)",
                        }}
                      >
                        {phrase.split(/(빨강|파랑|초록|노랑)/).map((part, partIndex) => {
                          if (part === "빨강") {
                            return (
                              <span key={partIndex}>
                                <span
                                  style={{
                                    backgroundColor: `${emotionColors.red}80`,
                                    color: "white",
                                    padding: "2px 4px",
                                    borderRadius: "5px",
                                  }}
                                >
                                  {part}
                                </span>
                              </span>
                            );
                          } else if (part === "파랑") {
                            return (
                              <span key={partIndex}>
                                <span
                                  style={{
                                    backgroundColor: `${emotionColors.blue}80`,
                                    color: "white",
                                    padding: "2px 4px",
                                    borderRadius: "5px",
                                  }}
                                >
                                  {part}
                                </span>
                              </span>
                            );
                          } else if (part === "초록") {
                            return (
                              <span key={partIndex}>
                                <span
                                  style={{
                                    backgroundColor: `${emotionColors.green}80`,
                                    color: "white",
                                    padding: "2px 4px",
                                    borderRadius: "5px",
                                  }}
                                >
                                  {part}
                                </span>
                              </span>
                            );
                          } else if (part === "노랑") {
                            return (
                              <span key={partIndex}>
                                <span
                                  style={{
                                    backgroundColor: `${emotionColors.yellow}CC`,
                                    color: "black",
                                    padding: "2px 4px",
                                    borderRadius: "5px",
                                  }}
                                >
                                  {part}
                                </span>
                              </span>
                            );
                          }
                          return <span key={partIndex}>{part}</span>;
                        })}
                      </motion.div>
                    </foreignObject>

                    <g transform={`translate(10 ${y - 15}) scale(.8)`}>
                      {/* 감정 색상 원 */}
                      <motion.circle
                        cx="16"
                        cy="16"
                        r="12"
                        fill={emotionColor}
                        initial={{ scale: 0 }}
                        animate={{
                          opacity: 1,
                          fill: emotionColor,
                          x: 0,
                          y: 0,
                        }}
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
                        stroke={isDark ? "#4CAF50" : "#E0E3EF"}
                        strokeWidth={isDark ? "2" : "1"}
                        initial={{ scale: 0 }}
                        animate={{
                          opacity: 1,
                          stroke: "#E0E3EF",
                        }}
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
                        fill={isDark ? "white" : "black"}
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: 1,
                          fill: isDark ? "white" : "black",
                        }}
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
