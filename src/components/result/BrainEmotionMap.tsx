import React from "react";

interface ActivityEmotionData {
  activity: string;
  self_emotions: {
    emotion: string[];
    emotion_intensity: number[];
  };
  state_emotions: {
    emotion: string[];
    emotion_intensity: number[];
  };
  peoples?: Array<{ name: string; [key: string]: any }>;
  problem?: Array<{ [key: string]: any }>;
  strength?: string;
}

interface BrainEmotionMapProps {
  activityAnalysis: ActivityEmotionData[];
}

const BrainEmotionMap: React.FC<BrainEmotionMapProps> = ({ activityAnalysis }) => {
  // 모든 감정 데이터를 하나로 합치기
  const getAllEmotions = () => {
    const allEmotions: { emotion: string; intensity: number; type: "self" | "state" }[] = [];

    activityAnalysis.forEach(activity => {
      // Self emotions
      if (activity.self_emotions?.emotion) {
        activity.self_emotions.emotion.forEach((emotion, index) => {
          allEmotions.push({
            emotion,
            intensity: activity.self_emotions.emotion_intensity[index] || 1,
            type: "self",
          });
        });
      }

      // State emotions
      if (activity.state_emotions?.emotion) {
        activity.state_emotions.emotion.forEach((emotion, index) => {
          allEmotions.push({
            emotion,
            intensity: activity.state_emotions.emotion_intensity[index] || 1,
            type: "state",
          });
        });
      }
    });

    return allEmotions;
  };

  const emotions = getAllEmotions();

  // ActivityEmotionCard와 동일한 감정 색상 매핑
  const getEmotionColor = (emotion: string): string => {
    const emotionColors: { [key: string]: string } = {
      기쁨: "#FDE68A",
      즐거움: "#FDE68A",
      행복: "#FDE68A",
      분노: "#FCA5A5",
      화: "#FCA5A5",
      짜증: "#FCA5A5",
      슬픔: "#93C5FD",
      우울: "#93C5FD",
      서러움: "#93C5FD",
      불안: "#D8B4FE",
      걱정: "#D8B4FE",
      초조: "#D8B4FE",
      지침: "#9CA3AF",
      피곤: "#9CA3AF",
      무기력: "#9CA3AF",
      평온: "#86EFAC",
      차분: "#86EFAC",
      안정: "#86EFAC",
      만족: "#FDE68A",
      평안: "#86EFAC",
      감사: "#FDE68A",
      희망: "#FDE68A",
      사랑: "#F9A8D4",
      편안: "#86EFAC",
      설렘: "#F9A8D4",
      웃음: "#FDE68A",
      외로움: "#93C5FD",
      두려움: "#D8B4FE",
      스트레스: "#FCA5A5",
    };
    return emotionColors[emotion] || "#E5E7EB";
  };

  // ActivityEmotionCard와 동일한 강도 투명도 계산
  const getIntensityOpacity = (intensity: number): number => {
    return Math.max(0.3, Math.min(1, intensity / 10));
  };

  // 감정을 긍정/부정으로 분류
  const positiveEmotions = [
    "기쁨",
    "행복",
    "즐거움",
    "만족",
    "평안",
    "감사",
    "희망",
    "사랑",
    "편안",
    "설렘",
    "웃음",
  ];
  const negativeEmotions = [
    "슬픔",
    "분노",
    "불안",
    "스트레스",
    "우울",
    "걱정",
    "화",
    "짜증",
    "피곤",
    "외로움",
    "두려움",
  ];

  const categorizeEmotion = (emotion: string) => {
    if (positiveEmotions.some(pos => emotion.includes(pos) || pos.includes(emotion))) {
      return "positive";
    }
    if (negativeEmotions.some(neg => emotion.includes(neg) || neg.includes(emotion))) {
      return "negative";
    }
    return "neutral";
  };

  const groupedEmotions = emotions.reduce(
    (acc, emotion) => {
      const category = categorizeEmotion(emotion.emotion);
      if (!acc[category]) acc[category] = [];
      acc[category].push(emotion);
      return acc;
    },
    {} as Record<string, typeof emotions>
  );

  // ActivityEmotionCard 스타일의 감정 뱃지 컴포넌트
  const EmotionBadge: React.FC<{ emotion: string; intensity: number; type: "self" | "state" }> = ({
    emotion,
    intensity,
    type,
  }) => (
    <div
      className="px-3 py-1.5 rounded-full text-sm font-medium text-black flex items-center gap-2 hover:scale-105 transition-transform duration-200"
      style={{
        backgroundColor: getEmotionColor(emotion),
        opacity: getIntensityOpacity(intensity),
      }}
    >
      <span>{emotion}</span>
      <span className="text-xs bg-white bg-opacity-70 px-1.5 py-0.5 rounded-full">{intensity}</span>
    </div>
  );

  const getTypeLabel = (type: "self" | "state") => {
    return type === "self" ? "내가 느낀 감정" : "상황의 감정";
  };

  if (!activityAnalysis || activityAnalysis.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 mt-16">
      <h2 className="text-xl font-semibold text-black mb-4 px-4">오늘, 내가 나에게 느낀 감정들</h2>

      <div className="rounded-2xl shadow-lg p-6 bg-white">
        {/* Self Emotions */}
        {emotions.filter(e => e.type === "self").length > 0 && (
          <div className="mb-6">
            <h4 className="text-base font-medium text-black mb-3">내가 느낀 감정</h4>
            <div className="flex flex-wrap gap-2">
              {emotions
                .filter(e => e.type === "self")
                .map((emotion, index) => (
                  <EmotionBadge
                    key={`self-${index}`}
                    emotion={emotion.emotion}
                    intensity={emotion.intensity}
                    type="self"
                  />
                ))}
            </div>
          </div>
        )}

        {/* State Emotions */}
        {emotions.filter(e => e.type === "state").length > 0 && (
          <div className="mb-6">
            <h4 className="text-base font-medium text-black mb-3">상황의 감정</h4>
            <div className="flex flex-wrap gap-2">
              {emotions
                .filter(e => e.type === "state")
                .map((emotion, index) => (
                  <EmotionBadge
                    key={`state-${index}`}
                    emotion={emotion.emotion}
                    intensity={emotion.intensity}
                    type="state"
                  />
                ))}
            </div>
          </div>
        )}

        {/* 감정 분류별 통계 */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-base text-black mt-4 text-center">
            {groupedEmotions.positive?.length >= groupedEmotions.negative?.length
              ? "오늘은 긍정적인 감정이 더 많았네요 ✨"
              : "오늘은 힘든 하루였군요. 내일은 더 좋을 거예요 🌸"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BrainEmotionMap;
