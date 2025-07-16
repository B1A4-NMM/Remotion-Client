import React, { useEffect, useRef } from "react";

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

const COLORS = ["#82e79f", "#fcbcba", "#f8e76c", "#70cfe4"]; // green, red, yellow, blue
// const MAIN_TEXT_COLOR = "#22223B";
// const MAIN_BG_COLOR = "#FAF6F4";

// ✅ 타입 명시
const shuffleArray = (array: string[]): string[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const easeInOut = (t: number): number => {
  const period = 200;
  return (Math.sin(t / period + 100) + 1) / 2;
};

// ✅ 체크 아이콘 타입 정의
interface CheckRef {
  circle: SVGCircleElement | null;
  check: SVGPolygonElement | null;
}

const Loading6: React.FC = () => {
  const phrasesRef = useRef<SVGGElement | null>(null);
  const checksRef = useRef<CheckRef[]>([]);
  const colorMapRef = useRef<string[]>([]);
  const shuffledPhrases = useRef<string[]>(shuffleArray([...phrases]));

  useEffect(() => {
    colorMapRef.current = shuffledPhrases.current.map(() => {
      const randIdx = Math.floor(Math.random() * COLORS.length);
      return COLORS[randIdx];
    });

    const upwardGroup = phrasesRef.current;
    let currentY = 0;
    const verticalSpacing = 70;
    const startTime = new Date().getTime();

    const animate = () => {
      const now = new Date().getTime();
      if (!upwardGroup) return;

      upwardGroup.setAttribute("transform", `translate(0 ${currentY})`);
      currentY -= 1.35 * easeInOut(now);

      checksRef.current.forEach((check, i) => {
        const boundary = -i * verticalSpacing + verticalSpacing + 50;
        if (currentY < boundary) {
          const alpha = Math.max(Math.min(1 - (currentY - boundary + 15) / 30, 1), 0);
          if (check.circle) check.circle.setAttribute("fill", `rgba(255,255,255,${alpha})`);
          if (check.check) check.check.setAttribute("fill", `rgba(130,231,159,${alpha})`); // example: fade in green
        }
      });

      if (now - startTime < 30000 && currentY > -710) {
        requestAnimationFrame(animate);
      }
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
          height: 290,
          width: 400,
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
              {shuffledPhrases.current.map((phrase, i) => {
                const y = 40 + i * 70;
                return (
                  <React.Fragment key={i}>
                    <text x="50" y={y} fontSize="17" fontFamily="Arial" fill="text-foreground">
                      {phrase}
                    </text>
                    <g transform={`translate(10 ${y - 20}) scale(.9)`}>
                      <circle
                        ref={el => {
                          if (!checksRef.current[i])
                            checksRef.current[i] = { circle: null, check: null };
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
                            checksRef.current[i] = { circle: null, check: null };
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
