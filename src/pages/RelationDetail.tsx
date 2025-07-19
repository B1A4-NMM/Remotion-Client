import { useParams } from "react-router-dom";
import Title from "@/components/analysis/Title";
import { useGetRelationDetail } from "@/api/queries/home/useGetRelationDetail";
import { RelationData } from "@/types/relation";
import { motion } from "framer-motion";
import { Calendar, MapPin, Activity, Heart, TrendingUp } from "lucide-react";
import { mapEmotionToColor } from "@/constants/emotionColors";
import { Canvas } from "@react-three/fiber";
import Blob from "@/components/Blob/Blob";
import { useTheme } from "@/components/theme-provider";

export type ColorKey = "gray" | "gray1" | "gray2" | "blue" | "green" | "red" | "yellow";

export const baseColors: Record<ColorKey, string> = {
  green: "#72C9A3",
  red: "#F36B6B",
  yellow: "#FFD47A",
  blue: "#7DA7E3",
  gray: "#DADADA",
  gray1: "#DADADA",
  gray2: "#DADADA",
} as const;

const RelationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetRelationDetail(id || "");
  const userName = "사용자";

  const { theme } = useTheme();
    const isDark =
      theme === "dark" ||
      (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  // 데이터 분석 함수들
  const analyzeRelation = (relationData: RelationData) => {
    if (!relationData) return null;
    console.log(relationData);

    const { emotions, diaries, targetName } = relationData;

    // 1. 기본 통계
    const totalDiaries = diaries.length;
    const totalEmotionEntries = emotions.reduce((sum, day) => sum + day.emotions.length, 0);

    // 2. 활동 분석
    const allActivities = diaries.flatMap(diary => diary.activities);
    const activityCounts = allActivities.reduce((acc: Record<string, number>, activity) => {
      acc[activity] = (acc[activity] || 0) + 1;
      return acc;
    }, {});
    const topActivities = Object.entries(activityCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    // 3. 감정 분석
    const allEmotions = emotions.flatMap(day => day.emotions);
    const emotionCounts = allEmotions.reduce(
      (acc: Record<string, { count: number; totalIntensity: number }>, emotion) => {
        if (!acc[emotion.emotion]) {
          acc[emotion.emotion] = { count: 0, totalIntensity: 0 };
        }
        acc[emotion.emotion].count += emotion.count;
        acc[emotion.emotion].totalIntensity += emotion.intensity * emotion.count;
        return acc;
      },
      {}
    );

    const emotionStats = Object.entries(emotionCounts)
      .map(([emotion, stats]) => ({
        emotion,
        count: stats.count,
        averageIntensity: stats.totalIntensity / stats.count,
      }))
      .sort((a, b) => b.count - a.count);

    // 4. 친밀도 점수 계산
    const intimacyScore = calculateIntimacyScore(relationData);

    // 5. 최근 활동
    const recentDiary = diaries.sort(
      (a, b) => new Date(b.writtenDate).getTime() - new Date(a.writtenDate).getTime()
    )[0];

    // 6. 만남 빈도
    const dateRange = getDaysBetween(
      new Date(diaries[diaries.length - 1]?.writtenDate),
      new Date(diaries[0]?.writtenDate)
    );
    const meetingFrequency = totalDiaries / Math.max(dateRange / 30, 1); // 월 평균

    return {
      targetName,
      totalDiaries,
      totalEmotionEntries,
      topActivities,
      emotionStats,
      intimacyScore,
      recentDiary,
      meetingFrequency,
    };
  };

  // 친밀도 점수 계산 (0-100)
  const calculateIntimacyScore = (relationData: RelationData): number => {
    const { emotions, diaries } = relationData;

    let score = 0;

    // 만남 횟수 (최대 30점)
    score += Math.min(diaries.length * 2, 30);

    // 감정 다양성 (최대 20점)
    const uniqueEmotions = new Set(emotions.flatMap(day => day.emotions.map(e => e.emotion)));
    score += Math.min(uniqueEmotions.size * 2, 20);

    // 긍정적 감정 비율 (최대 25점)
    const positiveEmotions = ["행복", "기쁨", "사랑", "친밀", "감사"];
    const allEmotions = emotions.flatMap(day => day.emotions);
    const positiveRatio =
      allEmotions.filter(e => positiveEmotions.includes(e.emotion)).length / allEmotions.length;
    score += positiveRatio * 25;

    // 활동 다양성 (최대 15점)
    const uniqueActivities = new Set(diaries.flatMap(d => d.activities));
    score += Math.min(uniqueActivities.size * 1.5, 15);

    // 최근성 (최대 10점) - 최근 30일 내 만남이 있으면 가점
    const recentMeeting = diaries.some(
      d => getDaysBetween(new Date(d.writtenDate), new Date()) <= 30
    );
    if (recentMeeting) score += 10;

    return Math.round(Math.min(score, 100));
  };

  // 날짜 차이 계산 헬퍼
  const getDaysBetween = (date1: Date, date2: Date): number => {
    return Math.abs(date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600 text-xl">분석 중...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600 text-xl">데이터를 찾을 수 없습니다.</div>
      </div>
    );
  }

  const analysis = analyzeRelation(data);
  if (!analysis) return null;

  // 가장 강한 감정의 색상 가져오기
  const strongestEmotion = analysis.emotionStats[0]?.emotion;
  const strongestEmotionColor = strongestEmotion ? baseColors[mapEmotionToColor(strongestEmotion)] : "#95A5A6";

  return (
    <div className="min-h-screen">
      <Title name={data?.targetName + "과 함께한 시간"} isBackActive={true} back="/relation" />

      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* 관계 요약 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-6"
        >
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gray-50 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Canvas className="w-full h-full">
                <Blob diaryContent={{ emotions: analysis.emotionStats }} />
              </Canvas>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {analysis.targetName}과의 관계
            </h2>
            <div className="text-6xl font-bold text-blue-600 mb-2">{analysis.intimacyScore}</div>
            <div className="text-gray-800">친밀도 점수</div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-gray-600">{analysis.totalDiaries}</div>
              <div className="text-sm text-gray-600">함께한 순간</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-gray-600">
                {analysis.topActivities.length}
              </div>
              <div className="text-sm text-gray-600">공유한 활동</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-gray-600">
                {Math.round(analysis.meetingFrequency)}
              </div>
              <div className="text-sm text-gray-600">월 평균 만남</div>
            </div>
          </div>
        </motion.div>

        {/* 함께한 활동 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl p-6"
        >
          <div className="flex items-center mb-6">
            <Activity className="w-6 h-6 text-black mr-3" />
            <h3 className="text-xl font-bold text-gray-900">함께한 활동들</h3>
          </div>

          <div className="space-y-3">
            {analysis.topActivities.map(([activity, count], index) => (
              <div
                key={activity}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <span className="font-medium text-gray-600">{activity}</span>
                </div>
                <span className="text-gray-600">{count}번</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 감정 분석 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-xl p-6"
        >
          <div className="flex items-center mb-6">
            <TrendingUp className="w-6 h-6 text-black mr-3" />
            <h3 className="text-xl font-bold text-gray-900">나눈 감정들</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {analysis.emotionStats.slice(0, 6).map(emotion => (
              <div key={emotion.emotion} className="flex items-center p-4 bg-gray-50 rounded-xl">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mr-4"
                  style={{ backgroundColor: baseColors[mapEmotionToColor(emotion.emotion)] }}
                >
                  <span className="text-white font-bold text-center">{emotion.emotion}</span>
                </div>
                <div>
                  <div className="font-bold text-gray-600">{emotion.count}번</div>
                  <div className="text-sm text-gray-600">
                    평균 강도 {emotion.averageIntensity.toFixed(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 최근 추억 */}
        {analysis.recentDiary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-3xl shadow-xl p-6"
          >
            <div className="flex items-center mb-6">
              <Calendar className="w-6 h-6 text-black mr-3" />
              <h3 className="text-xl font-bold text-black">최근 함께한 순간</h3>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
              <p className="text-gray-700 mb-4">{analysis.recentDiary.content}</p>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {analysis.recentDiary.writtenDate}
                </div>
                {analysis.recentDiary.latitude && analysis.recentDiary.longitude && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    위치 정보 있음
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* 관계 분석 결론 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="rounded-3xl shadow-xl p-6"
          style={
            {
              "--bg-color": strongestEmotionColor,
              backgroundColor: `color-mix(in srgb, var(--bg-color) 15%, transparent)`,
            } as React.CSSProperties
          }
        >
          <h3 className="text-2xl font-bold mb-6 text-center text-black">관계 분석 결과</h3>
          <div className="space-y-4 text-lg leading-relaxed text-black">
            <p>
              {userName}님은{" "}
              <span
                className="font-bold underline underline-offset-4"
                style={{ textDecorationColor: strongestEmotionColor }}
              >
                {analysis.targetName}
              </span>
              과 지금까지{" "}
              <span
                className="font-bold underline underline-offset-4"
                style={{ textDecorationColor: strongestEmotionColor }}
              >
                {analysis.totalDiaries}
              </span>
              번의 소중한 순간을 함께했습니다.
            </p>
            <p>
              가장 많이 함께한 활동은{" "}
              <span
                className="font-bold underline underline-offset-4"
                style={{ textDecorationColor: strongestEmotionColor }}
              >
                {analysis.topActivities[0]?.[0]}
              </span>
              이며, 주로{" "}
              <span
                className="font-bold underline underline-offset-4"
                style={{ textDecorationColor: strongestEmotionColor }}
              >
                {analysis.emotionStats[0]?.emotion}
              </span>{" "}
              감정을 많이 나누었네요.
            </p>
            <p>
              친밀도 점수{" "}
              <span
                className="font-bold underline underline-offset-4"
                style={{ textDecorationColor: strongestEmotionColor }}
              >
                {analysis.intimacyScore}
              </span>
              점으로 보아,{" "}
              <span
                className="font-bold underline underline-offset-4"
                style={{ textDecorationColor: strongestEmotionColor }}
              >
                {analysis.intimacyScore >= 80
                  ? "매우 가까운"
                  : analysis.intimacyScore >= 60
                    ? "친밀한"
                    : analysis.intimacyScore >= 40
                      ? "좋은"
                      : "발전하는"}
              </span>{" "}
              관계를 유지하고 있습니다!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RelationDetail;
