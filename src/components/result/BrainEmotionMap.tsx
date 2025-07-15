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

  // 감정별 색상 매핑 (확장)
  const getEmotionColor = (emotion: string): string => {
    const emotionColors: { [key: string]: string } = {
      // 긍정적 감정 (따뜻한 색상)
      자긍심: "#FEF3C7",
      자신감: "#FEF3C7",
      뿌듯함: "#FDE68A",
      성취감: "#FCD34D",
      만족감: "#F59E0B",
      행복: "#FEF3C7",
      기쁨: "#FDE68A",
      즐거움: "#FCD34D",
      설렘: "#FECACA",
      평온: "#D1FAE5",
      편안: "#A7F3D0",
      안정: "#86EFAC",
      차분: "#6EE7B7",
      기대: "#FB7185",
      흥분: "#F472B6",
      활력: "#EC4899",

      // 부정적 감정 (차가운 색상)
      분노: "#FEE2E2",
      화: "#FECACA",
      짜증: "#FCA5A5",
      슬픔: "#DBEAFE",
      우울: "#BFDBFE",
      서러움: "#93C5FD",
      불안: "#E9D5FF",
      걱정: "#DDD6FE",
      초조: "#C4B5FD",
      긴장: "#D8B4FE",
      부담: "#C084FC",
      외로움: "#E0E7FF",
      공허: "#C7D2FE",

      // 피로/무기력 (중성 색상)
      지침: "#F3F4F6",
      피로: "#E5E7EB",
      무기력: "#D1D5DB",
      지루: "#F9FAFB",

      // 수치심/죄책감 (어두운 색상)
      부끄러움: "#FEE2E2",
      수치: "#FCA5A5",
      죄책감: "#F87171",
      후회: "#EF4444",
      뉘우침: "#DC2626",
      창피: "#FEE2E2",
      굴욕: "#F87171",

      // 놀람/중성
      놀람: "#FEF3C7",
    };
    return emotionColors[emotion] || "#F3F4F6";
  };

  const emotions = getAllEmotions();
  const maxIntensity = Math.max(...emotions.map(e => e.intensity), 1);

  // 각 구역별 감정 강도 합계 계산
  // 5개 구역 지도 스타일 - 겹치지 않게 배치
  const fixedRegions = {
    positive: { x: 5, y: 15, width: 35, height: 30 }, // 긍정 (왼쪽)
    negative: { x: 60, y: 15, width: 35, height: 30 }, // 부정 (오른쪽)
    calm: { x: 25, y: 45, width: 50, height: 25 }, // 평온 (중앙 하단)
    energy: { x: 10, y: 70, width: 30, height: 25 }, // 에너지 (왼쪽 하단)
    tired: { x: 60, y: 70, width: 30, height: 25 }, // 피로 (오른쪽 하단)
  };

  // 뇌 영역 위치 및 크기 계산
  const getBrainRegions = () => {
    if (emotions.length === 0) return [];

    // 감정별 구역 분류
    const positiveEmotions = [
      "자긍심",
      "자신감",
      "뿌듯함",
      "성취감",
      "만족감",
      "행복",
      "기쁨",
      "즐거움",
      "설렘",
    ];
    const negativeEmotions = [
      "분노",
      "화",
      "짜증",
      "슬픔",
      "우울",
      "서러움",
      "불안",
      "걱정",
      "초조",
      "긴장",
      "부담",
      "외로움",
      "공허",
      "부끄러움",
      "수치",
      "죄책감",
      "후회",
      "뉘우침",
      "창피",
      "굴욕",
    ];
    const calmEmotions = ["평온", "편안", "안정", "차분"];
    const energyEmotions = ["흥분", "활력", "기대", "놀람"];
    const tiredEmotions = ["지침", "피로", "무기력", "지루"];

    const regions: Array<{
      emotion: string;
      intensity: number;
      type: "self" | "state";
      x: number;
      y: number;
      size: number;
      color: string;
    }> = [];

    // 5개 구역별 감정 분류
    const getEmotionsByRegion = () => {
      const regions = {
        positive: [] as typeof emotions,
        negative: [] as typeof emotions,
        calm: [] as typeof emotions,
        energy: [] as typeof emotions,
        tired: [] as typeof emotions,
      };

      emotions.forEach(emotion => {
        if (positiveEmotions.includes(emotion.emotion)) {
          regions.positive.push(emotion);
        } else if (negativeEmotions.includes(emotion.emotion)) {
          regions.negative.push(emotion);
        } else if (calmEmotions.includes(emotion.emotion)) {
          regions.calm.push(emotion);
        } else if (energyEmotions.includes(emotion.emotion)) {
          regions.energy.push(emotion);
        } else if (tiredEmotions.includes(emotion.emotion)) {
          regions.tired.push(emotion);
        }
      });

      return regions;
    };

    const emotionsByRegion = getEmotionsByRegion();

    // 고정된 구역 내에서 감정 배치
    const getEmotionPosition = (
      emotion: string,
      emotionIndex: number,
      regionEmotions: typeof emotions
    ) => {
      const emotionCount = regionEmotions.length;
      let region;

      if (positiveEmotions.includes(emotion)) {
        region = fixedRegions.positive;
        // 긍정 구역 - 그리드 배치
        const cols = Math.min(3, Math.ceil(Math.sqrt(emotionCount)));
        const rows = Math.ceil(emotionCount / cols);
        const col = emotionIndex % cols;
        const row = Math.floor(emotionIndex / cols);

        const spacingX = region.width / (cols + 1);
        const spacingY = region.height / (rows + 1);

        return {
          x: region.x + (col + 1) * spacingX,
          y: region.y + (row + 1) * spacingY,
        };
      } else if (negativeEmotions.includes(emotion)) {
        region = fixedRegions.negative;
        // 부정 구역 - 더 촘촘한 그리드
        const cols = Math.min(4, Math.ceil(Math.sqrt(emotionCount)));
        const rows = Math.ceil(emotionCount / cols);
        const col = emotionIndex % cols;
        const row = Math.floor(emotionIndex / cols);

        const spacingX = region.width / (cols + 1);
        const spacingY = region.height / (rows + 1);

        return {
          x: region.x + (col + 1) * spacingX,
          y: region.y + (row + 1) * spacingY,
        };
      } else if (calmEmotions.includes(emotion)) {
        region = fixedRegions.calm;
        // 평온 구역 - 원형 배치
        if (emotionCount === 1) {
          return {
            x: region.x + region.width / 2,
            y: region.y + region.height / 2,
          };
        }

        const angle = (emotionIndex / emotionCount) * 2 * Math.PI;
        const radius = Math.min(region.width, region.height) * 0.3;

        return {
          x: region.x + region.width / 2 + Math.cos(angle) * radius,
          y: region.y + region.height / 2 + Math.sin(angle) * radius,
        };
      } else if (energyEmotions.includes(emotion)) {
        region = fixedRegions.energy;
        // 에너지 구역 - 그리드 배치
        const cols = Math.min(3, Math.ceil(Math.sqrt(emotionCount)));
        const rows = Math.ceil(emotionCount / cols);
        const col = emotionIndex % cols;
        const row = Math.floor(emotionIndex / cols);

        const spacingX = region.width / (cols + 1);
        const spacingY = region.height / (rows + 1);

        return {
          x: region.x + (col + 1) * spacingX,
          y: region.y + (row + 1) * spacingY,
        };
      } else {
        // 피로 감정들
        region = fixedRegions.tired;
        // 피로 구역 - 그리드 배치
        const cols = Math.min(3, Math.ceil(Math.sqrt(emotionCount)));
        const rows = Math.ceil(emotionCount / cols);
        const col = emotionIndex % cols;
        const row = Math.floor(emotionIndex / cols);

        const spacingX = region.width / (cols + 1);
        const spacingY = region.height / (rows + 1);

        return {
          x: region.x + (col + 1) * spacingX,
          y: region.y + (row + 1) * spacingY,
        };
      }
    };

    // 각 구역별로 감정 처리
    Object.entries(emotionsByRegion).forEach(([regionKey, regionEmotions]) => {
      regionEmotions.forEach((emotion, index) => {
        const position = getEmotionPosition(emotion.emotion, index, regionEmotions);
        const sizeMultiplier = emotion.intensity / maxIntensity;
        const baseSize = 20;
        const size = baseSize + sizeMultiplier * 25; // 20-45px 범위

        regions.push({
          emotion: emotion.emotion,
          intensity: emotion.intensity,
          type: emotion.type,
          x: position.x,
          y: position.y,
          size,
          color: getEmotionColor(emotion.emotion),
        });
      });
    });

    return regions;
  };

  const brainRegions = getBrainRegions();

  if (!activityAnalysis || activityAnalysis.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 px-4">오늘의 감정 워드클라우드</h2>

      <div className="rounded-2xl shadow-lg p-6 bg-white">
        <div className="relative w-full h-96 bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center">
          {/* 원형 영역 */}
          <div className="relative w-80 h-80 rounded-full flex items-center justify-center">
            {/* 감정들을 원형으로 배치 */}
            {emotions.map((emotion, index) => {
              // 워드클라우드 스타일 배치 - 다양한 반지름과 각도
              const angle = (index / emotions.length) * 2 * Math.PI + Math.random() * 0.5;
              const radius = 60 + Math.random() * 100; // 다양한 거리

              // 강도에 따른 글씨 크기 계산 (10px ~ 60px) - 극대화
              const fontSize = Math.max(
                10,
                Math.min(60, 10 + (emotion.intensity / maxIntensity) * 50)
              );

              // 위치 계산
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <div
                  key={index}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 select-none"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    fontSize: `${fontSize}px`,
                    fontWeight: "600",
                    color: getEmotionColor(emotion.emotion),
                  }}
                >
                  {emotion.emotion}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrainEmotionMap;
