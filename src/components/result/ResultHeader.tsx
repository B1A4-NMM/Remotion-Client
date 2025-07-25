import React, { useState, useEffect } from "react";
import { Bookmark, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import BookmarkIcon from "../../assets/img/Bookmark.svg";
import { usePatchDiaryBookmark } from "../../api/queries/home/usePatchDiaryBookmark";

interface ResultHeaderProps {
  writtenDate: string;
  diaryId?: number;
  isBookmarked?: boolean;
}

const ResultHeader: React.FC<ResultHeaderProps> = ({
  writtenDate,
  diaryId,
  isBookmarked = false,
}) => {
  const navigate = useNavigate();
  const [localBookmarked, setLocalBookmarked] = useState(isBookmarked);
  const { mutate: patchBookmark } = usePatchDiaryBookmark();

  // props의 isBookmarked가 변경되면 로컬 상태도 업데이트
  useEffect(() => {
    setLocalBookmarked(isBookmarked);
  }, [isBookmarked]);

  const handleBookmark = () => {

    if (diaryId !== undefined) {
      const newBookmarkedState = !localBookmarked;

      // 로컬 상태 먼저 업데이트 (즉시 UI 반영)
      setLocalBookmarked(newBookmarkedState);

      // API 호출
      patchBookmark({ diaryId, isBookmarked: newBookmarkedState });
    } else {
      console.warn("⚠️ diaryId가 없어서 API 호출 안됨");
    }
  };

  dayjs.locale("ko");

  return (
    <div className="sticky top-0 z-50 w-full bg-[#FAF6F4]/80 dark:bg-[#181718]/80 backdrop-blur-md shadow-sm rounded-2xl mb-8">
      <div className="w-full">
        <div className="flex items-start justify-between px-4 pt-6 pb-4 w-full">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-foreground mt-1">
              {dayjs(writtenDate).format("YYYY년 M월 D일 dddd")}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-full shadow transition-colors"
              aria-label="북마크"
              onClick={handleBookmark}
            >
              {localBookmarked ? (
                <img src={BookmarkIcon} alt="북마크" className="w-5 h-5" />
              ) : (
                <Bookmark className="w-5 h-5 text-black dark:text-white" />
              )}
            </button>

            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-full shadow transition-colors"
              aria-label="닫기"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultHeader;
