import React, { useState } from "react";
import { Bookmark, BookMarked, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

interface ResultHeaderProps {
  writtenDate: string;
}

const ResultHeader: React.FC<ResultHeaderProps> = ({ writtenDate }) => {
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked ] = useState(false);

  const handleBookmark=()=>{
    setIsBookmarked(!isBookmarked);
  }

  return (
    <div className="w-full mb-8">
      {/* ✅ 메인 헤더 */}
      <div className="flex items-start justify-between px-4 pt-6 pb-4 shadow-sm rounded-3xl">
        {/* 왼쪽: 시각 + 날짜 */}
        <div className="flex flex-col">
          <span className="text-sm text-black mt-1">
            {dayjs(writtenDate).format("YYYY년 M월 D일")}
          </span>
          <span className="text-sm text-black">
            {dayjs(writtenDate).format("dddd")}
          </span>
        </div>

        {/* 오른쪽: 액션 버튼들 */}
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-full bg-white shadow transition-colors"
            aria-label="북마크"
            onClick={handleBookmark}
          >
            <Bookmark className="w-5 h-5"
            style={{ fill: isBookmarked ? '#EF7C80' : 'none' , color: isBookmarked? '#EF7C80' : 'black' }} />
          </button>

          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white shadow transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultHeader;
