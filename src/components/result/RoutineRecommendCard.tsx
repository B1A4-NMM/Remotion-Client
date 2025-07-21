import React from "react";
import { TrendingUp, Heart, Sparkles, CheckCircle } from "lucide-react";

interface RoutineData {
  routineId: number;
  content: string;
  routineType: string;
}

interface RoutineRecommendCardProps {
  routines: RoutineData[];
  title?: string;
}

const RoutineRecommendCard: React.FC<RoutineRecommendCardProps> = ({
  routines,
  title = "나만의 감정 회복 루틴",
}) => {
  if (!routines || routines.length === 0) {
    return null;
  }

  const getEmotionTypeDisplay = (routineType: string) => {
    const emotionTypes: { [key: string]: { name: string; color: string; icon: string } } = {
      depression: { name: "우울", color: "from-blue-400 to-blue-600", icon: "💙" },
      anxiety: { name: "불안", color: "from-purple-400 to-purple-600", icon: "💜" },
      stress: { name: "스트레스", color: "from-red-400 to-red-600", icon: "❤️" },
      anger: { name: "분노", color: "from-orange-400 to-orange-600", icon: "🧡" },
      sadness: { name: "슬픔", color: "from-gray-400 to-gray-600", icon: "🤍" },
    };
    return (
      emotionTypes[routineType] || {
        name: routineType,
        color: "from-green-400 to-green-600",
        icon: "💚",
      }
    );
  };

  const getRoutineMessage = (routine: RoutineData) => {
    const emotionInfo = getEmotionTypeDisplay(routine.routineType);
    return {
      greeting: "💌 안녕! 너에게 전하고 싶은 작은 메모야",
      fullMessage: `요즘 ${emotionInfo.name}한 마음이 들 땐 잠깐 ${routine.content}하는 게 정말 도움이 되더라. <br/> 예전에 너도 그렇게 했을 때, 마음이 한결 가벼워졌던 거 기억나?`,
      suggestion: "오늘도 한 번 그렇게 해보면 어때? ",
      signature: "— 너를 늘 생각하는 마음으로",
      content: routine.content,
    };
  };

  return (
    <div className="relative">
      {routines.map((routine, index) => {
        const emotionInfo = getEmotionTypeDisplay(routine.routineType);
        const message = getRoutineMessage(routine);

        return (
          <div key={routine.routineId} className="relative">
            {/* 포스트잇 메모지 스타일 */}
            <div
              className="relative bg-yellow-100 rounded-lg p-6 shadow-lg transform rotate-1 hover:rotate-0 transition-transform duration-300"
              style={{
                backgroundColor: "#fefce8",
                boxShadow: "4px 4px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)",
              }}
            >
              {/* 상단 인사말 */}
              <div className="text-center mb-4">
                <p className="text-base" style={{ color: "#000" }}>
                  {message.greeting}
                </p>
              </div>

              {/* 메인 메시지 - 자연스러운 글 */}
              <div className="text-center space-y-4 mb-5">
                <div className="leading-relaxed text-base" style={{ color: "#000" }}>
                  {message.fullMessage.split(message.content).map((part, index) => {
                    // emotionInfo.name을 찾아서 파란색으로 강조
                    const emotionInfo = getEmotionTypeDisplay(routine.routineType);
                    const parts = part.split(emotionInfo.name);

                    return (
                      <span key={index}>
                        {parts.map((subPart, subIndex) => (
                          <span key={subIndex}>
                            {subPart.split("<br/>").map((text: string, brIndex: number) => (
                              <span key={brIndex}>
                                {text}
                                {brIndex < subPart.split("<br/>").length - 1 && <br />}
                              </span>
                            ))}
                            {subIndex < parts.length - 1 && (
                              <span
                                className="bg-blue-200 px-1 py-0.5 rounded-sm font-medium"
                                style={{ color: "#000" }}
                              >
                                {emotionInfo.name}
                              </span>
                            )}
                          </span>
                        ))}
                        {index < message.fullMessage.split(message.content).length - 1 && (
                          <span
                            className="bg-yellow-300 px-1 py-0.5 rounded-sm font-medium relative"
                            style={{ color: "#000" }}
                          >
                            {message.content}
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400"></span>
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>

                <p className="font-medium" style={{ color: "#000" }}>
                  {message.suggestion}
                </p>
              </div>

              {/* 서명 */}
              <div className="text-right">
                <p className="text-sm italic transform rotate-1" style={{ color: "#000" }}>
                  {message.signature}
                </p>
              </div>

              {/* 테이프 효과 */}
              <div className="absolute -top-2 right-8 w-12 h-6 bg-white opacity-80 transform rotate-45 shadow-sm border border-gray-200"></div>
              <div className="absolute -top-1 right-9 w-10 h-4 bg-gray-100 opacity-60 transform rotate-45"></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RoutineRecommendCard;
