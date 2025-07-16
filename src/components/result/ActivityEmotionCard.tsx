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

interface ActivityEmotionCardProps {
  activityAnalysis: ActivityEmotionData[];
}

const ActivityEmotionCard: React.FC<ActivityEmotionCardProps> = ({ activityAnalysis }) => {
  // 감정에 따른 색상 매핑
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
    };
    return emotionColors[emotion] || "#E5E7EB";
  };

  // 강도에 따른 투명도 계산
  const getIntensityOpacity = (intensity: number): number => {
    return Math.max(0.3, Math.min(1, intensity / 10));
  };

  const EmotionBadge: React.FC<{ emotion: string; intensity: number; type: "self" | "state" }> = ({
    emotion,
    intensity,
    type,
  }) => (
    <div
      className="px-3 py-1.5 rounded-full text-sm font-medium text-gray-800 flex items-center gap-2"
      style={{
        backgroundColor: getEmotionColor(emotion),
        opacity: getIntensityOpacity(intensity),
      }}
    >
      <span>{emotion}</span>
      <span className="text-xs bg-white bg-opacity-70 px-1.5 py-0.5 rounded-full">{intensity}</span>
    </div>
  );

  if (!activityAnalysis || activityAnalysis.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 px-4">활동별 감정 분석</h2>

      <div className="space-y-4">
        {activityAnalysis.map((activity, index) => (
          <div key={index} className="rounded-2xl shadow-lg p-6 bg-white">
            {/* 활동 제목 */}
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
              <h3 className="text-lg font-semibold text-gray-800">{activity.activity}</h3>
            </div>

            {/* Self Emotions */}
            {activity.self_emotions?.emotion?.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">내가 느낀 감정</h4>
                <div className="flex flex-wrap gap-2">
                  {activity.self_emotions.emotion.map((emotion, emotionIndex) => (
                    <EmotionBadge
                      key={`self-${emotionIndex}`}
                      emotion={emotion}
                      intensity={activity.self_emotions.emotion_intensity[emotionIndex]}
                      type="self"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* State Emotions */}
            {activity.state_emotions?.emotion?.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">상황의 감정</h4>
                <div className="flex flex-wrap gap-2">
                  {activity.state_emotions.emotion.map((emotion, emotionIndex) => (
                    <EmotionBadge
                      key={`state-${emotionIndex}`}
                      emotion={emotion}
                      intensity={activity.state_emotions.emotion_intensity[emotionIndex]}
                      type="state"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 관련된 사람들 */}
            {activity.peoples && activity.peoples.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-600 mb-2">함께한 사람</h4>
                <div className="flex flex-wrap gap-2">
                  {activity.peoples.map((person, personIndex) => (
                    <span
                      key={personIndex}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
                    >
                      {person.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 강점 표시 */}
            {activity.strength && activity.strength !== "None" && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-green-600">💪 발휘된 강점:</span>
                  <span className="text-sm text-gray-700">{activity.strength}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityEmotionCard;
