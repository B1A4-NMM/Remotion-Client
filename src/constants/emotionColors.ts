// src/constants/emotionColors.ts

export type ColorKey = "gray" | "gray1" | "gray2" | "blue" | "green" | "red" | "yellow";

export const baseColors: Record<ColorKey, string> = {
  green: "#31f301",
  red: "#fc0707",
  yellow: "#fdd301",
  blue: "#116ffc",
  gray: "#707070",
  gray1: "#707070",
  gray2: "#707070",
} as const;

export const mapEmotionToColor = (emotion: string): ColorKey => {
  
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

  if (highEnergyPleasant.has(emotion)) return "yellow";
  if (highEnergyUnpleasant.has(emotion)) return "red";
  if (lowEnergyUnpleasant.has(emotion)) return "blue";
  if (lowEnergyPleasant.has(emotion)) return "green";
  return "gray";
};
