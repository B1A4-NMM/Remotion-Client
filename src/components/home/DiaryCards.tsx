import React, { useState, forwardRef } from "react";
import { Canvas } from "@react-three/fiber";
import Blob from "../Blob/Blob";
import BookmarkIcon from "../../assets/img/Bookmark.svg";
import FilterIcon from "../../assets/img/Filter.svg";
import DiaryActionModal from "./DiaryActionModal";
import dayjs from "dayjs";
import { useDeleteDiary } from "../../api/queries/home/useDeleteDiary";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import VirtualizedBlobCard from "../Blob/VirtualizedBlobCard";

interface Diary {
  id: number;
  emotion: string;
  emotions: { emotion: string; intensity: number }[];
  targets: string[];
  activities: string[];
  photoUrl: string | string[] | null;
  map: { lat: number; lng: number } | null;
  content: string;
  date: string;
  keywords: string[];
  behaviors: string[];
  bookmarked: boolean;
}

interface DiaryCardsProps {
  diaries: Diary[];
  onDeleteDiary?: (diaryId: number) => void;
  onToggleBookmark?: (diaryId: number) => void;
  lastItemRef?: (node: HTMLDivElement | null) => void;
}

const DiaryCards: React.FC<DiaryCardsProps> = ({
  diaries,
  onDeleteDiary,
  onToggleBookmark,
  lastItemRef,
}) => {
  const [openId, setOpenId] = useState<number | null>(null);
  const navigate = useNavigate();

  if (!diaries || diaries.length === 0) {
    return <div className="w-full text-center py-8 text-gray-400">검색 결과가 없습니다.</div>;
  }

  const handleCardClick = (diaryId: number) => {
    navigate(`/result/${diaryId}?view=record`);
  };

  // 공통 컴포넌트들
  const renderBlobSection = (diary: Diary, index: number) => (
    <div className="h-full w-[170px] max-h-[170px] rounded-lg bg-gradient-to-b from-[#f5f6fa] to-[#e0e3ef] flex flex-col items-center justify-center py-2">
      <div className="text-base text-[#85848F] font-medium text-center mb-1">
        {diary.emotions && diary.emotions.length > 0
          ? `${diary.emotions
              .slice(0, 2)
              .map(e => e.emotion)
              .join(", ")}${diary.emotions.length > 2 ? " 등" : ""}`
          : "감정 없음"}
      </div>
      <div className="w-full h-full max-w-[170px] max-h-[170px] flex items-center justify-center rounded-full overflow-hidden mx-auto">
        <VirtualizedBlobCard
          key={diary.id}
          diaryContent={{ emotions: diary.emotions }}
          index={index}
        />
      </div>
      <div className="text-base text-[#85848F] text-center mt-1">
        {diary.targets && diary.targets.length > 0
          ? `${diary.targets.slice(0, 2).join(", ")}${diary.targets.length > 2 ? " 등" : ""}`
          : "나 혼자"}
      </div>
    </div>
  );

  const renderMapSection = (diary: Diary) => (
    <div className="relative w-full h-full">
      <img
        src={`https://maps.googleapis.com/maps/api/staticmap?center=${diary.map?.lat},${diary.map?.lng}&zoom=15&size=200x200&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`}
        alt="map-preview"
        className="rounded-lg object-cover w-full h-full"
      />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          <rect x="10" y="12" width="4" height="10" fill="#666666" rx="2" />
          <circle cx="12" cy="10" r="6" fill="#FF4444" stroke="#CC0000" strokeWidth="1" />
          <circle cx="12" cy="10" r="2" fill="white" />
        </svg>
      </div>
    </div>
  );

  const renderFooter = (diary: Diary) => (
    <>
      <div className="text-base text-gray-800 leading-relaxed break-words mb-3 line-clamp-4">
        {diary.content}
      </div>
      <hr className="border-t border-[#E5E5EA] mb-2" />
      <div className="flex items-center justify-between" onClick={e => e.stopPropagation()}>
        <span className="text-xs text-gray-400">
          {dayjs(diary.date).format("YYYY년 M월 DD일")}
        </span>
        <div className="flex items-center gap-2">
          {diary.bookmarked && (
            <img src={BookmarkIcon} alt="북마크" className="w-5 h-5 cursor-pointer" />
          )}
          <DiaryActionModal
            open={openId === diary.id}
            setOpen={v => setOpenId(v ? diary.id : null)}
            onDelete={() => {
              if (onDeleteDiary) onDeleteDiary(diary.id);
            }}
            onToggleBookmark={() => {
              if (onToggleBookmark) onToggleBookmark(diary.id);
            }}
            trigger={
              <img
                src={FilterIcon}
                alt="필터"
                className="w-5 h-5 cursor-pointer"
                onClick={(e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
                  e.stopPropagation();
                  setOpenId(diary.id);
                }}
              />
            }
            titleHidden={true}
            diaryId={diary.id}
            isBookmarked={diary.bookmarked}
          />
        </div>
      </div>
    </>
  );

  return (
    <div className="flex flex-col gap-3 w-full max-w-[420px] mx-auto">
      {diaries.map((mappedDiary, index) => {
        const images = mappedDiary.photoUrl
          ? Array.isArray(mappedDiary.photoUrl)
            ? mappedDiary.photoUrl.filter(img => typeof img === "string")
            : typeof mappedDiary.photoUrl === "string"
              ? [mappedDiary.photoUrl]
              : []
          : [];
        
        const filteredImages = images.filter(
          (img: string | null | undefined) => typeof img === "string" && img.trim() !== ""
        );
        
        const isLast = index === diaries.length - 1;
        const hasMap = !!mappedDiary.map;
        const imageCount = filteredImages.length;

        // 케이스 1: Blob만 (사진 0개, 지도 없음)
        if (!hasMap && imageCount === 0) {
          return (
            <div
              key={mappedDiary.id}
              ref={isLast && lastItemRef ? lastItemRef : undefined}
              className="w-full bg-white rounded-[20px] shadow-md p-3 flex flex-col cursor-pointer"
              onClick={() => handleCardClick(mappedDiary.id)}
            >
              <div className="flex gap-4 items-center rounded-lg bg-gradient-to-b from-[#f5f6fa] to-[#e0e3ef] mb-4 py-[14px] px-[20px]">
                <div className="w-[70px] h-[70px] flex items-center justify-center rounded-full overflow-hidden">
                  <VirtualizedBlobCard
                    key={mappedDiary.id}
                    diaryContent={{ emotions: mappedDiary.emotions }}
                    index={index}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-medium text-gray-700 truncate">
                    {mappedDiary.emotions && mappedDiary.emotions.length > 0
                      ? `${mappedDiary.emotions
                          .slice(0, 2)
                          .map(e => e.emotion)
                          .join(", ")}${mappedDiary.emotions.length > 2 ? ` 외 ${mappedDiary.emotions.length - 2}가지 감정` : ""}`
                      : "감정 없음"}
                  </div>
                  <div className="text-xs text-[#85848F] truncate">
                    {mappedDiary.targets && mappedDiary.targets.length > 0
                      ? `${mappedDiary.targets.slice(0, 3).join(", ")}${mappedDiary.targets.length >= 4 ? " 등" : ""}`
                      : "나혼자"}
                  </div>
                  <div className="text-xs text-[#85848F] truncate">
                    {mappedDiary.activities && mappedDiary.activities.length > 0
                      ? `${mappedDiary.activities.slice(0, 3).join(", ")}${mappedDiary.activities.length >= 3 ? " 등" : ""}`
                      : "활동 없음"}
                  </div>
                </div>
              </div>
              {renderFooter(mappedDiary)}
            </div>
          );
        }

        // 케이스 2: Blob + 지도 (사진 0개, 지도 있음)
        if (hasMap && imageCount === 0) {
          return (
            <div
              key={mappedDiary.id}
              ref={isLast && lastItemRef ? lastItemRef : undefined}
              className="w-full bg-white rounded-[20px] shadow-md p-3 flex flex-col cursor-pointer "
              onClick={() => handleCardClick(mappedDiary.id)}
            >
              <div className="grid grid-cols-2 gap-2 rounded-lg mb-2" style={{ height: "170px"}}>
                <div className="col-span-1 h-full">
                  {renderBlobSection(mappedDiary, index)}
                </div>
                <div className="col-span-1 h-full flex items-center max-h-[170px]">
                  {renderMapSection(mappedDiary)}
                </div>
              </div>
              {renderFooter(mappedDiary)}
            </div>
          );
        }

        // 케이스 3: Blob + 사진1 (사진 1개, 지도 없음)
        if (!hasMap && imageCount === 1) {
          return (
            <div
              key={mappedDiary.id}
              ref={isLast && lastItemRef ? lastItemRef : undefined}
              className="w-full bg-white rounded-[20px] shadow-md p-3 flex flex-col cursor-pointer"
              onClick={() => handleCardClick(mappedDiary.id)}
            >
              <div className="grid grid-cols-2 gap-2 rounded-lg mb-2" style={{ height: "170px"}}>
                <div className="col-span-1 h-full">
                  {renderBlobSection(mappedDiary, index)}
                </div>
                <div className="col-span-1 h-full flex items-center max-h-[170px]">
                  <img
                    src={filteredImages[0]}
                    alt="diary-photo-0"
                    className="rounded-lg object-cover w-full h-full"
                  />
                </div>
              </div>
              {renderFooter(mappedDiary)}
            </div>
          );
        }

        // 케이스 4: Blob + 사진1 + 지도 (사진 1개, 지도 있음)
        if (hasMap && imageCount === 1) {
          return (
            <div
              key={mappedDiary.id}
              ref={isLast && lastItemRef ? lastItemRef : undefined}
              className="w-full bg-white rounded-[20px] shadow-md p-3 flex flex-col cursor-pointer"
              onClick={() => handleCardClick(mappedDiary.id)}
            >
              <div className="grid grid-cols-2 gap-2 rounded-lg mb-2" style={{ height: "170px"}}>
                {/* 왼쪽: Blob 섹션 */}
                <div className="col-span-1">
                  {renderBlobSection(mappedDiary, index)}
                </div>
                
                {/* 오른쪽: 지도 + 사진을 세로로 배치 */}
                <div className="grid grid-rows-2 gap-2 h-full max-h-[170px]">
                  <div>
                    <img
                      src={filteredImages[0]}
                      alt="diary-photo-0"
                      className="rounded-lg object-cover w-full h-full"
                      />
                  </div>                    
                      <div>
                        {renderMapSection(mappedDiary)}
                      </div>
                </div>
              </div>
              {renderFooter(mappedDiary)}
            </div>
          );
        }
        

        // 케이스 5: Blob + 사진2 (사진 2개, 지도 없음)
        if (!hasMap && imageCount === 2) {
          return (
            <div
              key={mappedDiary.id}
              ref={isLast && lastItemRef ? lastItemRef : undefined}
              className="w-full bg-white rounded-[20px] shadow-md p-3 flex flex-col cursor-pointer"
              onClick={() => handleCardClick(mappedDiary.id)}
            >
              <div className="grid grid-cols-2 gap-2 rounded-lg mb-2" style={{ height: "170px"}}>
                {/* 왼쪽: Blob 섹션 */}
                <div className="col-span-1">
                  {renderBlobSection(mappedDiary, index)}
                </div>
                
                {/* 오른쪽: 지도 + 사진을 세로로 배치 */}
                <div className="grid grid-rows-2 gap-2 h-full max-h-[170px]">
                  <div>
                    <img
                      src={filteredImages[0]}
                      alt="diary-photo-0"
                      className="rounded-lg object-cover w-full h-full"
                      />
                  </div>                    
                  <img
                      src={filteredImages[1]}
                      alt="diary-photo-1"
                      className="rounded-lg object-cover w-full h-full"
                      />
                </div>
              </div>
              {renderFooter(mappedDiary)}
            </div>
          );
        }

       // 케이스 6: Blob + 사진2 + 지도 (사진 2개, 지도 있음)
        if (hasMap && imageCount === 2) {
          return (
            <div
              key={mappedDiary.id}
              ref={isLast && lastItemRef ? lastItemRef : undefined}
              className="w-full bg-white rounded-[20px] shadow-md p-3 flex flex-col cursor-pointer"
              onClick={() => handleCardClick(mappedDiary.id)}
            >
              <div className="grid grid-cols-2 gap-2 rounded-lg mb-2" style={{ height: "170px" }}>
                <div className="col-span-0 h-full">
                  {renderBlobSection(mappedDiary, index)}
                </div>
                <div className="col-span-1 grid grid-rows-2 gap-2 h-full max-h-[170px] max-w-[170px]">
                  {/* 위쪽: 지도 (가로로 긴 직사각형) */}
                  <div className="row-span-1 ">
                    {renderMapSection(mappedDiary)}
                  </div>
                  {/* 아래쪽: 사진 2개 (정사각형) */}
                  <div className="grid grid-cols-2 gap-2 ">
                    <img
                      src={filteredImages[0]}
                      alt="diary-photo-0"
                      className="aspect-square rounded-lg object-cover w-full"
                    />
                    <img
                      src={filteredImages[1]}
                      alt="diary-photo-1"
                      className="aspect-square rounded-lg object-cover w-full"
                    />
                  </div>
                </div>
              </div>
              {renderFooter(mappedDiary)}
            </div>
          );
        }

        // 케이스 7: Blob + 사진3 (사진 3개, 지도 없음)
        if (!hasMap && imageCount === 3) {
          return (
            <div
              key={mappedDiary.id}
              ref={isLast && lastItemRef ? lastItemRef : undefined}
              className="w-full bg-white rounded-[20px] shadow-md p-3 flex flex-col cursor-pointer"
              onClick={() => handleCardClick(mappedDiary.id)}
            >
              <div className="grid grid-cols-2 gap-2 rounded-lg mb-2" style={{ height: "170px" }}>
                <div className="col-span-0 h-full">
                  {renderBlobSection(mappedDiary, index)}
                </div>
                <div className="col-span-1 grid grid-rows-2 gap-2 h-full max-h-[170px] max-w-[170px]">
                  {/* 위쪽: 사진 1개 (가로로 긴 직사각형) */}
                  <div className="row-span-1">
                    <img
                      src={filteredImages[0]}
                      alt="diary-photo-0"
                      className="rounded-lg object-cover w-full h-full"
                    />
                  </div>
                  {/* 아래쪽: 사진 2개 (정사각형) */}
                  <div className="grid grid-cols-2 gap-2">
                    <img
                      src={filteredImages[1]}
                      alt="diary-photo-1"
                      className="aspect-square rounded-lg object-cover w-full"
                    />
                    <img
                      src={filteredImages[2]}
                      alt="diary-photo-2"
                      className="aspect-square rounded-lg object-cover w-full"
                    />
                  </div>
                </div>
              </div>
              {renderFooter(mappedDiary)}
            </div>
          );
        }

        // 케이스 8: Blob + 사진3 + 지도 (사진 3개, 지도 있음)
        if (hasMap && imageCount === 3) {
          return (
            <div
              key={mappedDiary.id}
              ref={isLast && lastItemRef ? lastItemRef : undefined}
              className="w-full bg-white rounded-[20px] shadow-md p-3 flex flex-col cursor-pointer"
              onClick={() => handleCardClick(mappedDiary.id)}
            >
              <div className="flex gap-2 rounded-lg mb-2 " style={{ height: "170px" }}>
                {/* 왼쪽: 고정된 Blob */}
                <div className="w-[170px] h-full">
                  {renderBlobSection(mappedDiary, index)}
                </div>
                
                {/* 오른쪽: 4분할 그리드 (2x2) */}
                <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-2 max-h-[170px] max-w-[170px]">
                  <img
                    src={filteredImages[0]}
                    alt="diary-photo-0"
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                  <img
                    src={filteredImages[1]}
                    alt="diary-photo-1"
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                  <img
                    src={filteredImages[2]}
                    alt="diary-photo-2"
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                  <div className="aspect-square w-full">
                    {renderMapSection(mappedDiary)}
                  </div>
                </div>
              </div>
              {renderFooter(mappedDiary)}
            </div>
          );
        }
        
        // 케이스 9: Blob + 사진4 (사진 4개, 지도 없음)
        if (!hasMap && imageCount === 4) {
          return (
            <div
              key={mappedDiary.id}
              ref={isLast && lastItemRef ? lastItemRef : undefined}
              className="w-full bg-white rounded-[20px] shadow-md p-3 flex flex-col cursor-pointer"
              onClick={() => handleCardClick(mappedDiary.id)}
            >
              <div className="flex gap-2 rounded-lg mb-2 max-h-" style={{ height: "170px" }}>
                {/* 왼쪽: 고정된 Blob */}
                <div className="w-[170px] h-full">
                  {renderBlobSection(mappedDiary, index)}
                </div>
                
                {/* 오른쪽: 4분할 그리드 (2x2) */}
                <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-2 max-h-[170px] max-w-[170px]">
                  <img
                    src={filteredImages[0]}
                    alt="diary-photo-0"
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                  <img
                    src={filteredImages[1]}
                    alt="diary-photo-1"
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                  <img
                    src={filteredImages[2]}
                    alt="diary-photo-2"
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                  <img
                    src={filteredImages[3]}
                    alt="diary-photo-3"
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                </div>
              </div>
              {renderFooter(mappedDiary)}
            </div>
          );
        }
        
        // 케이스 10: Blob + 사진4 + 지도 (사진 4개, 지도 있음) - 마지막 2개 사진은 블러 처리 + +2 표시
        if (hasMap && imageCount === 4) {
          return (
            <div
              key={mappedDiary.id}
              ref={isLast && lastItemRef ? lastItemRef : undefined}
              className="w-full bg-white rounded-[20px] shadow-md p-3 flex flex-col cursor-pointer"
              onClick={() => handleCardClick(mappedDiary.id)}
            >
              <div className="flex gap-2 rounded-lg mb-2 "  style={{ height: "170px" }}>
                {/* 왼쪽: 고정된 Blob */}
                <div className="w-[170px] h-full">
                  {renderBlobSection(mappedDiary, index)}
                </div>
                
                {/* 오른쪽: 4분할 그리드 (2x2) */}
                <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-2 max-h-[170px] max-w-[170px]">
                  {/* 첫 번째: 사진 */}
                  <img
                    src={filteredImages[0]}
                    alt="diary-photo-0"
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                  
                  {/* 두 번째: 사진 */}
                  <img
                    src={filteredImages[1]}
                    alt="diary-photo-1"
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                  
                  {/* 세 번째: 지도 */}
                  <div className="aspect-square w-full">
                    {renderMapSection(mappedDiary)}
                  </div>
                  
                  {/* 네 번째: 블러 처리된 이미지 + "+2" 표시 */}
                  <div className="relative aspect-square w-full">
                    <img
                      src={filteredImages[2]}
                      alt="diary-photo-2"
                      className="aspect-square w-full rounded-lg object-cover filter blur-sm"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg font-bold">+2</span>
                    </div>
                  </div>
                </div>
              </div>
              {renderFooter(mappedDiary)}
            </div>
          );
        }

        // Fallback - 예외 상황
        return (
          <div
            key={mappedDiary.id}
            ref={isLast && lastItemRef ? lastItemRef : undefined}
            className="w-full bg-white rounded-[20px] shadow-md p-3 flex flex-col cursor-pointer"
            onClick={() => handleCardClick(mappedDiary.id)}
          >
            <div className="flex items-center justify-center h-24 text-gray-400">
              표시할 수 없는 조합입니다.
            </div>
            {renderFooter(mappedDiary)}
          </div>
        );
      })}
    </div>
  );
};

export default DiaryCards;
