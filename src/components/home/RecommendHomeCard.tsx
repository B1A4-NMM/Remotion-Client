import React, { useEffect, useState } from "react";
import { getRecommendActivityWeekdayTomorrow } from "@/api/services/recommend";
import { Card, CardContent } from "@/components/ui/card";

// 추천 멘트 타입 정의
interface RecommendType {
  diaryId?: any;
  activity?: string;
  comment?: string;
}

const RecommendHomeCard = () => {
  const [recommend, setRecommend] = useState<RecommendType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    const fetchRecommend = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getRecommendActivityWeekdayTomorrow();
        setRecommend(data || null);
      } catch (err: any) {
        setError("추천 멘트 불러오기 실패: " + (err?.message || ""));
      } finally {
        setLoading(false);
      }
    };
    fetchRecommend();
  }, []);

  if (!visible) return null;

  return (
    <Card className="w-full max-w-md mx-auto my-4 bg-white/80  rounded-2xl border border-gray-200 relative">
      {/* X 닫기 버튼 */}
      <button
        className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
        aria-label="닫기"
        onClick={() => setVisible(false)}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="5" y1="5" x2="15" y2="15" stroke="currentColor" strokeLinecap="round" />
          <line x1="15" y1="5" x2="5" y2="15" stroke="currentColor" strokeLinecap="round" />
        </svg>
      </button>
      <CardContent className="p-6 flex flex-col items-center justify-center min-h-[130px]   rounded-xl ">
        {loading ? (
          <div className="flex items-center gap-2 animate-pulse text-gray-400 text-sm">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            잠시만요... 마음을 정리하는 중이에요.
          </div>
        ) : error ? (
          <span className="text-sm text-red-500 italic">추천 문장을 불러오지 못했어요.</span>
        ) : (
          <>
            <span className="text-sm text-gray-500 mb-2">
              🕊️ 오늘 하루, 당신의 마음은 어땠나요?
            </span>
            <span className="text-center text-[16px] text-gray-800 font-normal whitespace-pre-line leading-relaxed tracking-wide">
              {recommend?.comment ||
                "오늘도 고생 많았어요.\n마음 한 켠에 남은 감정을 천천히 꺼내볼까요?"}
            </span>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendHomeCard;
