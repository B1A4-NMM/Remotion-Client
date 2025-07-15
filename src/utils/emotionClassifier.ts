const POSITIVE_EMOTIONS = new Set(["감사", "존경", "신뢰", "애정", "친밀", "유대", "사랑", "공감"]);

const NEGATIVE_EMOTIONS = new Set([
  "질투",
  "시기",
  "분노",
  "짜증",
  "실망",
  "억울",
  "속상",
  "상처",
  "배신감",
  "경멸",
  "거부감",
  "불쾌",
]);

export function classifyEmotion(emotion: string): "positive" | "negative" | "neutral" {
  if (POSITIVE_EMOTIONS.has(emotion)) return "positive";
  if (NEGATIVE_EMOTIONS.has(emotion)) return "negative";
  return "neutral";
}

export { POSITIVE_EMOTIONS, NEGATIVE_EMOTIONS };
