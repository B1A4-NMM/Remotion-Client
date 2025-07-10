import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useDiaryStore } from "./Calender";


type MoodCircleProps = {
  hasTodayDiary: boolean;
  todayDiary: any;
  onClickWrite: () => void;
};

const sampleDiary = {
  id: "sample",
  todayEmotions: [], // 샘플 데이터에도 기본 구조 추가
};

interface Emotion {
  color: string;
  intensity: number;
}

type ColorKey = "gray" | "gray1" | "gray2" | "blue" | "green" | "red" | "yellow";

// baseColors와 ColorKey 일치시키기
const baseColors: Record<ColorKey, string> = {
  green: "#4ecdc4",
  red: "#ff6b6b",
  yellow: "#ffe66d",
  blue: "#45b7d1",
  gray: "#c4c4c4",
  gray1: "#c4c4c4",
  gray2: "#424242",
} as const;

// 감정을 ColorKey로 매핑하는 함수
const mapEmotionToColor = (emotion: string): ColorKey => {
  // High Energy / Pleasant [노랑]
  const highEnergyPleasant = new Set([
    "행복",
    "기쁨",
    "즐거움",
    "설렘",
    "흥분",
    "활력",
    "자긍심",
    "자신감",
    "뿌듯함",
    "성취감",
    "사랑",
    "애정",
    "기대",
    "놀람",
  ]);

  // High Energy / Unpleasant [빨강]
  const highEnergyUnpleasant = new Set([
    "분노",
    "짜증",
    "질투",
    "시기",
    "경멸",
    "거부감",
    "불쾌",
    "긴장",
    "불안",
    "초조",
    "억울",
    "배신감",
    "상처",
  ]);

  // Low Energy / Unpleasant [파랑]
  const lowEnergyUnpleasant = new Set([
    "우울",
    "슬픔",
    "공허",
    "외로움",
    "실망",
    "속상",
    "부끄러움",
    "수치",
    "죄책감",
    "후회",
    "뉘우침",
    "창피",
    "굴욕",
    "피로",
    "지침",
    "무기력",
    "지루",
    "부담",
  ]);

  // Low Energy / Pleasant [초록]
  const lowEnergyPleasant = new Set([
    "평온",
    "편안",
    "안정",
    "차분",
    "감사",
    "존경",
    "신뢰",
    "친밀",
    "유대",
    "공감",
    "만족감",
  ]);

  if (highEnergyPleasant.has(emotion)) {
    return "yellow";
  }
  if (highEnergyUnpleasant.has(emotion)) {
    return "red";
  }
  if (lowEnergyUnpleasant.has(emotion)) {
    return "blue";
  }
  if (lowEnergyPleasant.has(emotion)) {
    return "green";
  }

  // 알 수 없는 감정의 경우 기본값
  return "gray1";
};

type ChangesProps = {
  hasTodayDiary?: boolean;
  onClickWrite: () => void;

  onAlreadyWrote: () => void;
  children: React.ReactNode;
};

const Changes = ({
  hasTodayDiary,
  onAlreadyWrote,
  onClickWrite,
  children,
}: ChangesProps & { onClickWrite: () => void }) =>
  hasTodayDiary ? (
    <div onClick={onAlreadyWrote}>{children}</div>
  ) : (
    <div onClick={onClickWrite}>{children}</div> // ✅ 여기를 Link 대신 함수 실행
  );

const MoodCircle = ({ hasTodayDiary, todayDiary, onClickWrite }: MoodCircleProps) => {
  /* ─ 1. 토스트 콜백 ─ */
  const handleAlreadyWrote = () => {
    toast.success("오늘은 이미 일기를 작성했습니다", {
      description: "하루에 하나의 일기만 작성할 수 있습니다.",
      duration: 3000,
    });
  };
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const { isExpanded, setIsExpanded } = useDiaryStore();

  /* ─ 2. 표시할 일기 결정 ─ */
  const displayDiary = hasTodayDiary ? todayDiary : sampleDiary;

  // 일기 내용에서 감정 데이터를 처리하는 함수
  const processDiaryContentEmotions = (content: any): Emotion[] => {
    // 데이터가 없거나 todayEmotions가 없는 경우 처리
    if (!content || !content.todayEmotions || !Array.isArray(content.todayEmotions)) {
      return [{ color: "gray1" as ColorKey, intensity: 1 }];
    }

    // 모든 감정을 하나의 배열로 수집 (type과 intensity 모두 포함)
    const allEmotions: { type: string; intensity: number }[] = [];

    content.todayEmotions.forEach((emo: any) => {
      if (emo) {
        allEmotions.push({
          type: emo.emotion, // emotionType 필드 사용
          intensity: emo.intensity || 5,
        });
      }
    });

    if (allEmotions.length === 0) {
      return [{ color: "gray1" as ColorKey, intensity: 1 }];
    }

    // 색상별로 그룹화하고 강도 계산
    const colorMap = new Map<ColorKey, number>();
    allEmotions.forEach(({ type, intensity }) => {
      const color = mapEmotionToColor(type);
      colorMap.set(color, (colorMap.get(color) || 0) + intensity);
    });

    if (colorMap.size > 1) {
      colorMap.delete("gray1");
      colorMap.delete("gray2");
    }

    const totalColorIntensity = [...colorMap.values()].reduce((sum, val) => sum + val, 0);

    return [...colorMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([color, total]) => ({
        color,
        intensity: +(total / totalColorIntensity).toFixed(3), // totalIntensity 사용
      }));
  };

  // diaryContent가 변경될 때마다 감정 분석 실행
  useEffect(() => {
    if (displayDiary) {
      const processedEmotions = processDiaryContentEmotions(displayDiary);
      setEmotions(processedEmotions);
    }
  }, [hasTodayDiary, todayDiary]); // todayDiary 의존성 추가

  // emotions 상태를 사용하여 그라데이션 생성
  const generateGradient = (): string => {
    // 1. emotions가 없거나, 모두 gray만 있을 때
    if (emotions.length === 0 || emotions.every(e => e.color === "gray1" || e.color === "gray2")) {
      return `radial-gradient(ellipse at center, ${baseColors.gray1}, ${baseColors.gray2})`;
    }

    // 2. 감정이 1개만 있을 때
    if (emotions.length === 1) {
      return baseColors[emotions[0].color as ColorKey];
    }

    // 3. 여러 감정이 있을 때
    const intensities = emotions.map(e => e.intensity);
    const totalIntensity = intensities.reduce((sum, intensity) => sum + intensity, 0);
    const normalizedIntensities = intensities.map(i => i / totalIntensity);

    const totalWeight = normalizedIntensities.reduce((sum, weight) => sum + weight, 0);
    let cumulative = 0;

    const colors = emotions.map(({ color, intensity }, idx) => {
      cumulative += intensity / totalIntensity; // totalIntensity 사용
      const pos = (cumulative / totalWeight) * 100;
      return `${baseColors[color as ColorKey]} ${pos.toFixed(1)}%`;
    });

    return `radial-gradient(ellipse at center, ${colors.join(", ")})`;
  };

  return (
    <AnimatePresence>
      {!isExpanded && (
        <motion.div
          className="z-30 flex items-center justify-center pt-20"
          variants={{
            hidden: {
              opacity: 0,
              scale: 0.8,
              transition: {
                duration: 0.06, // 빠르게 사라짐
                ease: "easeIn",
              },
            },
            visible: {
              opacity: 1,
              scale: 1,
              transition: {
                duration: 1.2, // 천천히 나타남
                delay: 0.5,
                ease: "easeOut",
              },
            },
          }}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <Changes
            hasTodayDiary={hasTodayDiary}
            onClickWrite={onClickWrite}
            onAlreadyWrote={handleAlreadyWrote}
          >
            <motion.div
              className="flex justify-center mb-6 mt-8"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div
                className="mood-circle w-36 h-36 rounded-full"
                style={{
                  background: (() => {
                    const gradient = generateGradient();
                    return gradient;
                  })(),
                  boxShadow: `0 0 40px ${baseColors[(emotions[0]?.color as ColorKey) ?? "gray1"]}40`,
                }}
              />
            </motion.div>
          </Changes>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MoodCircle;
