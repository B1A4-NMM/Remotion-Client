import { useNavigate, useParams } from "react-router-dom";
import Title from "@/components/analysis/Title";
import { useGetRelationDetail } from "@/api/queries/home/useGetRelationDetail";
import { motion } from "framer-motion";
import {
  Activity,
  TrendingUp,
  Calendar,
  MapPin,
  Utensils,
  Coffee,
  Video,
  Music,
  Gamepad2,
  ShoppingBag,
  Plane,
  Camera,
  BookOpen,
  Briefcase,
  Phone,
  MessageCircle,
  Home,
  Gift,
  Star,
  Trees,
  Car,
  Mail,
  Heart,
  Sun,
  Moon,
  ChevronUp,
  ChevronDown,
  BarChart,
} from "lucide-react";
import { baseColors, mapEmotionToColor } from "@/constants/emotionColors";
import { Canvas } from "@react-three/fiber";
import Blob from "@/components/Blob/Blob";
import { useTheme } from "@/components/theme-provider";
import dayjs from "dayjs";
import { getBlobEmotionsFromSimpleEmotions } from "@/utils/activityEmotionUtils";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

const RelationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useGetRelationDetail(id || "");
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const userName = "사용자";

  const navigate = useNavigate();

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
      .filter((a: any) => a.content) // 빈 객체 필터링
      .sort((a: any, b: any) => (b.count || 0) - (a.count || 0))
      .slice(0, 5)
      .map((a: any) => [a.content, a.count || 0]);

    // 3. 감정 분석 (emotions: [{emotion, count, intensity}]) - 구조 변경 대응
    const allEmotions = relationData.emotions || [];

    // 감정별 count, 평균 intensity
    const emotionCounts: Record<string, { count: number; totalIntensity: number }> = {};
    console.log(allEmotions);
    allEmotions.forEach((e: any) => {
      if (e.emotion && e.emotion !== "무난") {
        // '무난' 감정은 제외
        if (!emotionCounts[e.emotion]) {
          emotionCounts[e.emotion] = { count: 0, totalIntensity: 0 };
        }
        emotionCounts[e.emotion].count += e.totalCount || 0;
        emotionCounts[e.emotion].totalIntensity += (e.totalIntensity || 0) * (e.totalCount || 0);
      }
    });

    const emotionStats = Object.entries(emotionCounts)
      .map(([emotion, stats]) => ({
        emotion,
        count: stats.count,
        averageIntensity: stats.count ? stats.totalIntensity / stats.count ** 2 : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // 4. 친밀도 점수 (closenessScore, 소수점 버림)
    const intimacyScore = Math.floor(relationData.closenessScore ?? 0);

    // 5. 최근 일기
    const recentDiary = (relationData.diaries || [])
      .slice()
      .sort(
        (a: any, b: any) => new Date(b.writtenDate).getTime() - new Date(a.writtenDate).getTime()
      )[0];

    // 6. 만남 빈도 (월 평균)
    let meetingFrequency = 0;
    if (relationData.diaries && relationData.diaries.length > 1) {
      const sortedDiaries = relationData.diaries
        .slice()
        .sort(
          (a: any, b: any) => new Date(a.writtenDate).getTime() - new Date(b.writtenDate).getTime()
        );
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

  // activityEmotionUtils를 사용하여 Blob 감정 색상 계산
  const blobEmotions = getBlobEmotionsFromSimpleEmotions({ emotions: data.emotions });

  // 가장 강한 감정의 색상 가져오기
  const strongestEmotion = analysis.emotionStats[0]?.emotion;
  const strongestEmotionColor = strongestEmotion
    ? baseColors[mapEmotionToColor(strongestEmotion)]
    : "#95A5A6";

  const getRelationshipStatus = (score: number): string => {
    if (score >= 90) return "둘도 없는";
    if (score >= 80) return "매우 가까운";
    if (score >= 70) return "가까운";
    if (score >= 60) return "친밀한";
    if (score >= 50) return "좋은";
    if (score >= 40) return "보통의";
    if (score >= 30) return "알아가는";
    if (score >= 20) return "조금은 아쉬운";
    if (score >= 10) return "어색한";
    return "냉랭한";
  };

  const gotoDiary = (id: number) => {
    navigate(`/result/${id}?view=record`);
  };

  const formatDate = (date: string) => {
    return dayjs(date).format("YYYY년 M월 D일 dddd");
  };

  // 감정 분석 헬퍼 함수들
  const isMostlyPositive = (emotionStats: any[]) => {
    const positiveEmotions = ["감사", "존경", "신뢰", "애정", "친밀", "유대", "사랑", "공감"];
    const positiveCount = emotionStats.filter(e => positiveEmotions.includes(e.emotion)).length;
    return positiveCount > emotionStats.length / 2;
  };

  const isMostlyNegative = (emotionStats: any[]) => {
    const negativeEmotions = [
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
    ];
    const negativeCount = emotionStats.filter(e => negativeEmotions.includes(e.emotion)).length;
    return negativeCount > emotionStats.length / 2;
  };

  // 활동에 맞는 아이콘 매핑 함수
  const getActivityIcon = (activity: string) => {
    const activityLower = activity.toLowerCase();

    // 식사 관련
    if (
      activityLower.includes("식사") ||
      activityLower.includes("밥") ||
      activityLower.includes("음식") ||
      activityLower.includes("저녁") ||
      activityLower.includes("아침") ||
      activityLower.includes("점심")
    )
      return Utensils;
    if (
      activityLower.includes("커피") ||
      activityLower.includes("카페") ||
      activityLower.includes("차")
    )
      return Coffee;

    // 엔터테인먼트
    if (
      activityLower.includes("영화") ||
      activityLower.includes("드라마") ||
      activityLower.includes("연극")
    )
      return Video;
    if (
      activityLower.includes("음악") ||
      activityLower.includes("노래") ||
      activityLower.includes("연주")
    )
      return Music;
    if (activityLower.includes("게임") || activityLower.includes("놀이")) return Gamepad2;
    if (
      activityLower.includes("독서") ||
      activityLower.includes("책") ||
      activityLower.includes("읽기")
    )
      return BookOpen;

    // 활동/운동
    if (
      activityLower.includes("운동") ||
      activityLower.includes("스포츠") ||
      activityLower.includes("체육")
    )
      return Activity;
    if (
      activityLower.includes("산책") ||
      activityLower.includes("걷기") ||
      activityLower.includes("산보")
    )
      return Trees;
    if (activityLower.includes("수영") || activityLower.includes("바다")) return Trees;

    // 쇼핑/구매
    if (
      activityLower.includes("쇼핑") ||
      activityLower.includes("구매") ||
      activityLower.includes("장보기")
    )
      return ShoppingBag;

    // 여행/이동
    if (activityLower.includes("여행") || activityLower.includes("관광")) return Plane;
    if (
      activityLower.includes("운전") ||
      activityLower.includes("차") ||
      activityLower.includes("이동")
    )
      return Car;
    if (
      activityLower.includes("배") ||
      activityLower.includes("선박") ||
      activityLower.includes("항해")
    )
      return Plane;

    // 기록/사진
    if (
      activityLower.includes("사진") ||
      activityLower.includes("카메라") ||
      activityLower.includes("촬영")
    )
      return Camera;
    if (
      activityLower.includes("일기") ||
      activityLower.includes("글쓰기") ||
      activityLower.includes("기록")
    )
      return BookOpen;

    // 업무/학업
    if (
      activityLower.includes("공부") ||
      activityLower.includes("학습") ||
      activityLower.includes("수업")
    )
      return BookOpen;
    if (
      activityLower.includes("업무") ||
      activityLower.includes("회사") ||
      activityLower.includes("일")
    )
      return Briefcase;
    if (
      activityLower.includes("회의") ||
      activityLower.includes("상의") ||
      activityLower.includes("논의")
    )
      return MessageCircle;

    // 소통
    if (
      activityLower.includes("전화") ||
      activityLower.includes("통화") ||
      activityLower.includes("연락")
    )
      return Phone;
    if (
      activityLower.includes("메시지") ||
      activityLower.includes("채팅") ||
      activityLower.includes("대화")
    )
      return MessageCircle;
    if (activityLower.includes("편지") || activityLower.includes("서신")) return Mail;

    // 장소
    if (
      activityLower.includes("집") ||
      activityLower.includes("홈") ||
      activityLower.includes("가정")
    )
      return Home;
    if (activityLower.includes("학교") || activityLower.includes("교실")) return BookOpen;
    if (activityLower.includes("병원") || activityLower.includes("의원")) return Activity;
    if (
      activityLower.includes("교회") ||
      activityLower.includes("성당") ||
      activityLower.includes("기도")
    )
      return Star;

    // 특별한 날/이벤트
    if (
      activityLower.includes("선물") ||
      activityLower.includes("기념") ||
      activityLower.includes("생일")
    )
      return Gift;
    if (
      activityLower.includes("축하") ||
      activityLower.includes("파티") ||
      activityLower.includes("경축")
    )
      return Star;
    if (activityLower.includes("결혼") || activityLower.includes("예식")) return Heart;

    // 감정/상태
    if (
      activityLower.includes("휴식") ||
      activityLower.includes("쉬기") ||
      activityLower.includes("휴가")
    )
      return Sun;
    if (activityLower.includes("잠") || activityLower.includes("수면")) return Moon;
    if (activityLower.includes("고민") || activityLower.includes("생각")) return Star;

    // 기타
    if (activityLower.includes("청소") || activityLower.includes("정리")) return Home;
    if (activityLower.includes("요리") || activityLower.includes("조리")) return Utensils;
    if (activityLower.includes("빨래") || activityLower.includes("세탁")) return Home;
    if (activityLower.includes("수리") || activityLower.includes("고치기")) return Activity;

    // 기본 아이콘들
    return Activity;
  };

  return (
    <div className="min-h-screen">
      <Title name="" isBackActive={true} back="/relation" />

      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* 관계 요약 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="opacity-80 rounded-3xl shadow-xl   "
        >
          <div className={`flex gap-8  rounded-2xl p-3 ${isDark ? "bg-[#4A3551]/30" : "bg-white"}`}>
            {/* 왼쪽: Blob(사진) + 이름 */}
            <div
              className={`flex flex-col items-center dark:border-gray-800 rounded-2xl p-2 ${isDark ? "bg-white" : "bg-[#FAF6F4]"}`}
            >
              <div className="w-32 h-32 rounded-2xl flex items-center justify-center overflow-hidden mb-4 mt-3 ">
                <Canvas className="w-full h-full">
                  <Blob emotions={blobEmotions} />
                </Canvas>
              </div>
              <div className="flex flex-col items-center">
                {/* <div className="text-sm text-white font-medium">함께한 사람</div> */}
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center mt-1">
                  {analysis.targetName}
                </h2>
              </div>
            </div>

            {/* 오른쪽: 친밀도 점수 + 통계 */}
            <div className="flex-1 flex flex-col justify-between">
              {/* 친밀도 점수 (강조) */}
              <div className="text-center mt-8 flex flex-col justify-end">
                <div className="text-lg font-medium text-gray-800 dark:text-white">친밀도 점수</div>
                <div className={`text-4xl font-bold mb-2`}>{analysis.intimacyScore}</div>
              </div>
              {/* 통계 정보 */}
              <div className="rounded-xl p-4 ">
                <div className="space-y-2 text-base">
                  <div className="flex justify-between items-center py-1 ">
                    <span className="text-gray-800 dark:text-white font-medium">함께한 순간</span>
                    <span className="text-gray-800 dark:text-white font-bold">
                      {analysis.totalDiaries}회
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 ">
                    <span className="text-gray-800 dark:text-white font-medium">공유 활동</span>
                    <span className="text-gray-800 dark:text-white font-bold">
                      {analysis.topActivities.length}개
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-800 dark:text-white font-medium">월 평균</span>
                    <span className="text-gray-800 dark:text-white font-bold">
                      {Math.round(analysis.meetingFrequency)}회 만남
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 함께한 활동 */}
        {analysis.topActivities.length > 0 && (
          <div>
            <div className="flex items-center mb-3">
              <Activity className="w-6 h-6 text-black mr-3" />
              <h3 className="text-xl font-bold text-gray-900">함께한 활동들</h3>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-md px-4 py-5"
            >
              {/* <h3 className="text-lg font-semibold text-gray-800 mb-4">함께한 활동들</h3> */}
              <ul className={`flex flex-col divide-y `}>
                {(showAllActivities
                  ? analysis.topActivities
                  : analysis.topActivities.slice(0, 3)
                ).map(([activity, count]: [string, number], index: number) => {
                  const ActivityIcon = getActivityIcon(activity);
                  return (
                    <li key={activity} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2 text-gray-800">
                        <div className={`w-5 h-5 rounded flex items-center justify-center `}>
                          <ActivityIcon className="w-3 h-3 text-black dark:text-white" />
                        </div>
                        <span className="text-base">{activity}</span>
                      </div>
                      <span className="text-black dark:text-gray-300 font-medium">{count}번</span>
                    </li>
                  );
                })}
              </ul>

              {/* 더보기 버튼 */}
              {analysis.topActivities.length > 3 && (
                <button
                  onClick={() => setShowAllActivities(!showAllActivities)}
                  className="w-full mt-3 py-2 text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center gap-1 transition-colors"
                >
                  {showAllActivities ? (
                    <>
                      <span>접기</span>
                      <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>더보기 ({analysis.topActivities.length - 3}개 더)</span>
                      <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </motion.div>
          </div>
        )}

        {/* 감정 분석 */}
        {analysis.emotionStats.length > 0 && (
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
              <div className="grid grid-cols-4 gap-6">
                {analysis.emotionStats.slice(0, 6).map((emotion: any) => (
                  <div key={emotion.emotion} className="flex flex-col items-center space-y-3">
                    {/* 동그란 원 안에 감정 */}
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg relative overflow-hidden group hover:scale-105 transition-all duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${baseColors[mapEmotionToColor(emotion.emotion)]} 0%, ${baseColors[mapEmotionToColor(emotion.emotion)]}dd 100%)`,
                      }}
                    >
                      {/* 내부 하이라이트 효과 */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                      <span className="text-gray-600 font-semibold text-center text-sm leading-tight relative z-10 drop-shadow-sm">
                        {emotion.emotion}
                      </span>
                    </div>
                    {/* 세로 정렬된 정보 */}
                    <div className="text-center space-y-1">
                      <div className=" text-gray-800 text-base">{emotion.count}회</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

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
                onClick={() => gotoDiary(analysis.recentDiary.diaryId)}
              >
                <div className="rounded-xl ">
                  <div className="overflow-hidden">
                    <motion.div
                      initial={false}
                      animate={{
                        height: showFullContent ? "auto" : "9rem",
                        opacity: 1,
                      }}
                      transition={{
                        height: { duration: 0.4, ease: "easeInOut" },
                        opacity: { duration: 0.3 },
                      }}
                      className="relative"
                    >
                      <p className="text-black mb-4">{analysis.recentDiary.content}</p>
                    </motion.div>
                  </div>

                  {/* 더보기 버튼 */}
                  {analysis.recentDiary.content.length > 150 && (
                    <div className="relative mb-4">
                      <AnimatePresence>
                        {!showFullContent && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"
                          ></motion.div>
                        )}
                      </AnimatePresence>
                      <motion.button
                        onClick={e => {
                          e.stopPropagation();
                          setShowFullContent(!showFullContent);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="relative z-10 w-full py-2 px-4 bg-gray-100 rounded-lg text-sm text-gray-700   transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <motion.div
                          animate={{ rotate: showFullContent ? 180 : 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </motion.div>
                        <span>{showFullContent ? "접기" : "더보기"}</span>
                      </motion.button>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm ">
                    <div className="flex items-center">
                      {formatDate(analysis.recentDiary.writtenDate)}
                    </div>
                    {analysis.recentDiary.latitude && analysis.recentDiary.longitude && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>

        {/* 관계 분석 결론 */}
        <div>
          <div className="flex items-center mb-3">
            <BarChart className="w-6 h-6 text-black mr-3" />
            <h3 className="text-xl font-bold text-gray-900">관계 분석 리포트</h3>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-3xl shadow-xl p-6"
          >
            <div className="space-y-4 text-[17px] leading-relaxed text-black">
              <p>
                <span
                  className="font-bold px-1 rounded dark:bg-opacity-90 text-gray-700"
                  style={{
                    backgroundColor: `${strongestEmotionColor}A0`,
                  }}
                >
                  {analysis.targetName}
                </span>
                님과{" "}
                <span
                  className="font-bold px-1 rounded dark:bg-opacity-90 text-gray-700"
                  style={{
                    backgroundColor: `${strongestEmotionColor}A0`,
                  }}
                >
                  {analysis.totalDiaries}
                </span>
                번의 순간을 기록했어요.
              </p>

              {/* {analysis.emotionStats.length > 0 && (
                <p>
                  그 시간 속에서 느낀 감정들은 주로{" "}
                  <span
                    className="font-bold px-1 rounded"
                    style={{
                      backgroundColor: `${strongestEmotionColor}30`,
                    }}
                  >
                    {analysis.emotionStats
                      .map(e => e.emotion)
                      .slice(0, 2)
                      .join(", ")}
                  </span>
                  였어요.
                  {isMostlyPositive(analysis.emotionStats)
                    ? " 전반적으로 따뜻하고 긍정적인 분위기가 느껴졌어요."
                    : isMostlyNegative(analysis.emotionStats)
                      ? " 감정의 파동이 다소 크고, 신중함이 엿보였어요."
                      : " 다양한 감정들이 오갔고, 관계에 깊이가 느껴졌어요."}
                </p>
              )} */}

              {analysis.topActivities.length > 0 && (
                <p>
                  특히{" "}
                  <span
                    className="font-bold px-1 rounded dark:bg-opacity-90 text-gray-700"
                    style={{
                      backgroundColor: `${strongestEmotionColor}A0`,
                    }}
                  >
                    {analysis.topActivities[0][0]}
                  </span>{" "}
                  활동에서 많은 시간을 함께 보냈답니다.
                </p>
              )}

              <p>
                현재 두 사람의 친밀도는{" "}
                <span
                  className="font-bold px-1 rounded dark:bg-opacity-90 text-gray-700"
                  style={{
                    backgroundColor: `${strongestEmotionColor}A0`,
                  }}
                >
                  {analysis.intimacyScore}
                </span>
                점으로, <br />
                <span
                  className="font-bold px-1 rounded dark:bg-opacity-90 text-gray-700"
                  style={{
                    backgroundColor: `${strongestEmotionColor}A0`,
                  }}
                >
                  {getRelationshipStatus(analysis.intimacyScore)}
                </span>{" "}
                관계를 이어가고 있어요.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RelationDetail;
