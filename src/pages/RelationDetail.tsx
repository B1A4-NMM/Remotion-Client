import { useNavigate, useParams } from "react-router-dom";
import Title from "@/components/analysis/Title";
import { useGetRelationDetail } from "@/api/queries/home/useGetRelationDetail";
import { RelationData } from "@/types/relation";
import { motion } from "framer-motion";
import { Calendar, MapPin, Activity, Heart, TrendingUp } from "lucide-react";
import { mapEmotionToColor } from "@/constants/emotionColors";
import type { ColorKey } from "@/components/Blob/Blob";
import { Canvas } from "@react-three/fiber";
import Blob from "@/components/Blob/Blob";
import { useTheme } from "@/components/theme-provider";

const RelationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetRelationDetail(id || "");
  const userName = "사용자";

  const navigate= useNavigate();

  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  // 데이터 분석 함수들 (신규 데이터 구조 대응)
  const analyzeRelation = (relationData: any) => {
    if (!relationData) return null;
    // 1. 기본 통계
    const totalDiaries = relationData.diaries?.length || 0;

    // 2. 활동 분석 (activities 필드 사용)
    const topActivities = (relationData.activities || [])
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 5)
      .map((a: any) => [a.content, a.count]);

    // 3. 감정 분석 (emotions: [{date, emotions: [{emotion, count, intensity}]}])
    const allEmotions = (relationData.emotions || []).flatMap((day: any) =>
      (day.emotions || []).map((e: any) => ({ ...e, date: day.date }))
    );
    // 감정별 count, 평균 intensity
    const emotionCounts: Record<string, { count: number; totalIntensity: number }> = {};
    allEmotions.forEach((e: any) => {
      if (!emotionCounts[e.emotion]) {
        emotionCounts[e.emotion] = { count: 0, totalIntensity: 0 };
      }
      emotionCounts[e.emotion].count += e.count;
      emotionCounts[e.emotion].totalIntensity += e.intensity;
    });
    const emotionStats = Object.entries(emotionCounts)
      .map(([emotion, stats]) => ({
        emotion,
        count: stats.count,
        averageIntensity: stats.count ? stats.totalIntensity / stats.count : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // 4. 친밀도 점수 (closenessScore, 소수점 버림)
    const intimacyScore = Math.floor(relationData.closenessScore ?? 0);

    // 5. 최근 일기
    const recentDiary = (relationData.diaries || [])
      .slice()
      .sort((a: any, b: any) => new Date(b.writtenDate).getTime() - new Date(a.writtenDate).getTime())[0];

    // 6. 만남 빈도 (월 평균)
    let meetingFrequency = 0;
    if (relationData.diaries && relationData.diaries.length > 1) {
      const sortedDiaries = relationData.diaries.slice().sort((a: any, b: any) => new Date(a.writtenDate).getTime() - new Date(b.writtenDate).getTime());
      const firstDate = new Date(sortedDiaries[0].writtenDate);
      const lastDate = new Date(sortedDiaries[sortedDiaries.length - 1].writtenDate);
      const dateRange = Math.abs(lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);
      meetingFrequency = totalDiaries / Math.max(dateRange / 30, 1);
    }

    return {
      targetName: relationData.targetName,
      totalDiaries,
      topActivities,
      emotionStats,
      intimacyScore,
      recentDiary,
      meetingFrequency,
    };
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

  console.log(analysis);

  // 가장 강한 감정의 색상 가져오기
  const strongestEmotion = analysis.emotionStats[0]?.emotion;
  const strongestEmotionColor = strongestEmotion ? mapEmotionToColor(strongestEmotion) : "#95A5A6";

  const getRelationshipStatus = (score: number): string => {
    if (score >= 90) return "둘도 없는";
    if (score >= 80) return "매우 가까운";
    if (score >= 70) return "가까운";
    if (score >= 60) return "친밀한";
    if (score >= 50) return "좋은";
    if (score >= 40) return "보통의";
    if (score >= 30) return "알아가는";
    if (score >= 20) return "서먹한";
    if (score >= 10) return "어색한";
    return "냉랭한";
  };

  const gotoDiary=(id:number)=>{
    navigate(`/result/${id}?view=record`);
  }

  return (
    <div className="min-h-screen">
      <Title name={data?.targetName + "과 함께한 시간"} isBackActive={true} back="/relation" />

      <div className="max-w-4xl mx-auto px-4 space-y-10">
        {/* 관계 요약 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-6"
        >
          <div className="text-center mb-6">
            <div className="w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Canvas className="w-full h-full">
                <Blob emotions={analysis.emotionStats.slice(0, 3).map((e: any) => ({
                  color: mapEmotionToColor(e.emotion) as ColorKey,
                  intensity: e.averageIntensity || 1.0,
                }))} />
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
        <div>
          <div className="flex items-center mb-3">
            <Activity className="w-6 h-6 text-black mr-3" />
            <h3 className="text-xl font-bold text-gray-900">함께한 활동들</h3>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl p-6"
          >

            <div className="space-y-3">
              {analysis.topActivities.map(([activity, count]: [string, number], index: number) => (
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
        </div>

        {/* 감정 분석 */}
        <div>
        <div className="flex items-center mb-3">
          <TrendingUp className="w-6 h-6 text-black mr-3" />
          <h3 className="text-xl font-bold text-gray-900">나눈 감정들</h3>
        </div>
          
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-xl p-6"
        >

          <div className="grid grid-cols-2 gap-4">
            {analysis.emotionStats.slice(0, 6).map((emotion: any) => (
              <div key={emotion.emotion} className="flex items-center p-4 bg-gray-50 rounded-xl">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mr-4"
                  style={{ backgroundColor: mapEmotionToColor(emotion.emotion) }}
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
        </div>

        {/* 최근 추억 */}
        <div>
          {analysis.recentDiary && (
            <>
          <div className="flex items-center mb-3">
            <Calendar className="w-6 h-6 text-black mr-3" />
              <h3 className="text-xl font-bold text-black">최근 함께한 순간</h3>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-3xl shadow-xl p-6 cursor-pointer"
              onClick={()=>gotoDiary(analysis.recentDiary.diaryId)}
            >

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
            </>
          )}
        </div>

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
                {getRelationshipStatus(analysis.intimacyScore)}
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
