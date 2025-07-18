import React, { useState } from "react";
import { Bookmark, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/ko";

interface ResultHeaderProps {
  writtenDate: string;
}

const ResultHeader: React.FC<ResultHeaderProps> = ({ writtenDate }) => {
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  dayjs.locale("ko");

  return (
    <div className="sticky mb-8 z-10 top-0 w-full bg-[#F5F5F5]/80 backdrop-blur-md rounded-b-3xl">
      <div className="w-full">
        <div className="flex items-start justify-between px-4 pt-6 pb-4 w-full">
          <div className="flex flex-col">
            <span className="text-sm text-foreground mt-1">
              {dayjs(writtenDate).format("YYYY년 M월 D일")}
            </span>
            <span className="text-sm text-foreground">{dayjs(writtenDate).format("dddd")}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-full shadow transition-colors"
              aria-label="북마크"
              onClick={handleBookmark}
            >
              <Bookmark
                className="w-5 h-5"
                style={{
                  fill: isBookmarked ? "#EF7C80" : "none",
                  color: isBookmarked ? "#EF7C80" : "black",
                }}
              />
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
