import React, { useEffect, useRef } from "react";
import { useTheme } from "../theme-provider";

const phrases: string[] = [
  "감정을 곱씹는 중이에요",
  "일기를 읽고 마음을 살펴보는 중입니다",
  "당신의 하루를 들여다보는 중이에요",
  "느낌의 파장을 분석하는 중입니다",
  "마음을 이어주는 연결고리를 탐색 중이에요",
  "감정 지도 위에서 길을 찾고 있어요",
  "생각의 조각들을 모으는 중입니다",
  "사람들과의 관계를 정리하고 있어요",
  "마음에 스며든 감정을 정돈 중입니다",
  "오늘의 당신을 한 줄로 요약하는 중이에요",
  "당신의 강점과 약점을 정리하고 있어요",
  "어울리는 콘텐츠를 추천하고 있어요",
  "무드 컬러를 그라데이션하는 중입니다",
  "스트레스 곡선을 그리는 중이에요",
  "투두리스트를 준비하고 있어요",
  "조금만 기다려 주세요, 마음을 다듬는 중이에요",
];

const COLORS = ["#82e79f", "#fcbcba", "#f8e76c", "#70cfe4"];

const shuffleArray = (array: string[]): string[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const easeInOut = (t: number): number => {
  const period = 500;
  const amplitude = 3.0;
  return ((Math.sin(t / period + 100) + 1) / 2) * amplitude;
};

interface CheckRef {
  circle: SVGCircleElement | null;
  check: SVGPolygonElement | null;
  currentAlpha: number; // 현재 alpha 값 추가
}

const Loading6: React.FC = () => {
  const phrasesRef = useRef<SVGGElement | null>(null);
  const checksRef = useRef<CheckRef[]>([]);
  const colorMapRef = useRef<string[]>([]);
  const doubledPhrases = useRef<string[]>([
    ...shuffleArray([...phrases]),
    ...shuffleArray([...phrases]),
  ]);

  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => {
    colorMapRef.current = doubledPhrases.current.map(() => {
      const randIdx = Math.floor(Math.random() * COLORS.length);
      return COLORS[randIdx];
    });

    const upwardGroup = phrasesRef.current;
    let currentY = 0;
    const verticalSpacing = 100;
    const totalHeight = verticalSpacing * (doubledPhrases.current.length - 1);
    const containerHeight = 400; // 컨테이너 높이

    const animate = () => {
      const now = new Date().getTime();
      if (!upwardGroup) return;

      upwardGroup.setAttribute("transform", `translate(0 ${currentY})`);
      const baseSpeed = 0.15;
      const easingValue = easeInOut(now);
      currentY -= baseSpeed * easingValue;

      // 무한 반복: 끝에 도달하면 처음으로 다시 시작
      if (currentY <= -totalHeight / 2) {
        currentY = 0;
      }

      // 체크 애니메이션: 화면 영역 안에 있을 때만 체크 표시
      checksRef.current.forEach((check, i) => {
        const phraseY = 40 + i * 70 + currentY;

        // 화면 영역(0~containerHeight) 안에 있는지 확인
        const isInViewport = phraseY >= 0 && phraseY <= containerHeight;

        let alpha = 0;
        if (isInViewport) {
          // 화면 영역 안에 있으면 체크 표시
          alpha = 1;
        }
        // 화면을 벗어나면 자동으로 alpha = 0이 되어 체크 해제

        if (check.circle) check.circle.setAttribute("fill", `rgba(255,255,255,${alpha})`);
        if (check.check) check.check.setAttribute("fill", `rgba(130,231,159,${alpha})`);
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

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
          width: 700, // 500에서 700으로 확장
          overflow: "hidden",
        }}
      >
        <svg width="100%" height="100%">
          <defs>
            <mask id="mask" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse">
              <linearGradient id="linearGradient" x2="0" y2="1">
                <stop stopColor="white" stopOpacity="0" offset="0%" />
                <stop stopColor="white" stopOpacity="1" offset="30%" />
                <stop stopColor="white" stopOpacity="1" offset="70%" />
                <stop stopColor="white" stopOpacity="0" offset="100%" />
              </linearGradient>
              <rect width="100%" height="100%" fill="url(#linearGradient)" />
            </mask>
          </defs>

          <g style={{ mask: "url(#mask)" }}>
            <g ref={phrasesRef}>
              {doubledPhrases.current.map((phrase, i) => {
                const y = 40 + i * 70;
                return (
                  <React.Fragment key={i}>
                    {/* 줄바꿈이 가능한 텍스트 */}
                    <foreignObject x="50" y={y - 10} width="600" height="50">
                      <div
                        style={{
                          fontSize: "16px",
                          fontFamily: "Arial",
                          color: isDark ? "#ffffff" : "#000000", // 다크모드 처리
                          lineHeight: "1.4",
                          wordWrap: "break-word",
                          overflow: "hidden",
                        }}
                      >
                        {phrase}
                      </div>
                    </foreignObject>

                    <g transform={`translate(10 ${y - 20}) scale(.9)`}>
                      <circle
                        ref={el => {
                          if (!checksRef.current[i])
                            checksRef.current[i] = { circle: null, check: null, currentAlpha: 0 };
                          checksRef.current[i].circle = el;
                        }}
                        cx="16"
                        cy="16"
                        r="15"
                        fill="white"
                        stroke="#E0E3EF"
                        strokeWidth="1"
                      />
                      <polygon
                        ref={el => {
                          if (!checksRef.current[i])
                            checksRef.current[i] = { circle: null, check: null, currentAlpha: 0 };
                          checksRef.current[i].check = el;
                        }}
                        points="21.661,7.643 13.396,19.328 9.429,15.361 7.075,17.714 13.745,24.384 24.345,9.708"
                        fill="white"
                      />
                      <path
                        d="M16,0C7.163,0,0,7.163,0,16s7.163,16,16,16s16-7.163,16-16S24.837,0,16,0z M16,30C8.28,30,2,23.72,2,16C2,8.28,8.28,2,16,2 c7.72,0,14,6.28,14,14C30,23.72,23.72,30,16,30z"
                        fill="none"
                        stroke="#E0E3EF"
                        strokeWidth="1"
                      />
                    </g>
                  </React.Fragment>
                );
              })}
            </g>
          </g>
        </svg>
      </div>
      <div
        style={{
          position: "fixed",
          bottom: 30,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          color: "text-foreground",
        }}
      >
        <div id="logo" style={{ marginRight: 8 }}></div>
      </div>
    </div>
  );
};

export default Loading6;
