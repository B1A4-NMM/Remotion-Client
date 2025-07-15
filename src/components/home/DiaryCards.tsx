import React, { useState, forwardRef } from "react";
import { Canvas } from "@react-three/fiber";
import Blob from "../Blob/Blob";
import BookmarkIcon from "../../assets/img/bookmark.svg";
import FilterIcon from "../../assets/img/filter.svg";
import DiaryActionModal from "./DiaryActionModal";
import dayjs from "dayjs";
import { useDeleteDiary } from "../../api/queries/home/useDeleteDiary";
import { useNavigate } from "react-router-dom";

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

  return (
    <div className="flex flex-col gap-6 w-full max-w-[420px] mx-auto">
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
        const isEmotionOnly =
          !mappedDiary.map && (!mappedDiary.photoUrl || filteredImages.length === 0);
        const isLast = index === diaries.length - 1;
        // 1. 감정만 있는 경우
        if (isEmotionOnly) {
          return (
            <div
              key={mappedDiary.id}
              ref={isLast && lastItemRef ? lastItemRef : undefined}
              className="w-full bg-white rounded-2xl shadow-md p-3 flex flex-col cursor-pointer"
              onClick={() => handleCardClick(mappedDiary.id)}
            >
              <div className="flex gap-4 items-center rounded-2xl bg-gradient-to-b from-[#f5f6fa] to-[#e0e3ef] mb-4 py-[14px] px-[20px]">
                <div className="w-[70px] h-[70px] flex items-center justify-center rounded-full overflow-hidden">
                  <Canvas className="w-full h-full">
                    <Blob diaryContent={{ emotions: mappedDiary.emotions }} />
                  </Canvas>
                </div>
                <div className="flex-1 min-w-0">
                  {/* 감정 요약 */}
                  <div className="text-[14px] font-medium text-gray-700 truncate ">
                    {mappedDiary.emotions && mappedDiary.emotions.length > 0
                      ? `${mappedDiary.emotions
                          .slice(0, 2)
                          .map(e => e.emotion)
                          .join(
                            ", "
                          )}${mappedDiary.emotions.length > 2 ? ` 외 ${mappedDiary.emotions.length - 2}가지 감정` : ""}`
                      : "감정 없음"}
                  </div>
                  {/* 타겟 요약 */}
                  <div className="text-xs text-[#85848F] truncate">
                    {mappedDiary.targets && mappedDiary.targets.length > 0
                      ? `${mappedDiary.targets.slice(0, 3).join(", ")}${mappedDiary.targets.length >= 4 ? " 등" : ""}`
                      : "나혼자"}
                  </div>
                  {/* 액티비티 요약 */}
                  <div className="text-xs text-[#85848F] truncate">
                    {mappedDiary.activities && mappedDiary.activities.length > 0
                      ? `${mappedDiary.activities.slice(0, 3).join(", ")}${mappedDiary.activities.length >= 3 ? " 등" : ""}`
                      : "활동 없음"}
                  </div>
                </div>
              </div>
              {/* 본문 */}
              <div className="text-base text-gray-800 leading-relaxed break-words mb-3 line-clamp-4">
                {mappedDiary.content}
              </div>
              {/* 구분선 */}
              <hr className="border-t border-[#E5E5EA] mb-2" />
              {/* 날짜 & 오른쪽 아이콘들 */}
              <div className="flex items-center justify-between" onClick={e => e.stopPropagation()}>
                <span className="text-xs text-gray-400">
                  {dayjs(mappedDiary.date).format("YYYY년 MM월 DD일")}
                </span>
                <div className="flex items-center gap-2">
                  {mappedDiary.bookmarked && (
                    <img src={BookmarkIcon} alt="북마크" className="w-5 h-5 cursor-pointer" />
                  )}
                  <DiaryActionModal
                    open={openId === mappedDiary.id}
                    setOpen={v => setOpenId(v ? mappedDiary.id : null)}
                    onDelete={() => {
                      if (onDeleteDiary) onDeleteDiary(mappedDiary.id);
                    }}
                    onToggleBookmark={() => {
                      if (onToggleBookmark) onToggleBookmark(mappedDiary.id);
                    }}
                    trigger={
                      <img
                        src={FilterIcon}
                        alt="필터"
                        className="w-5 h-5 cursor-pointer"
                        onClick={(e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
                          e.stopPropagation();
                          setOpenId(mappedDiary.id);
                        }}
                      />
                    }
                    titleHidden={true}
                    diaryId={mappedDiary.id}
                    isBookmarked={mappedDiary.bookmarked}
                  />
                </div>
              </div>
            </div>
          );
        }
        // 2. 지도 + 사진 1장 이상
        else if (mappedDiary.map && filteredImages.length >= 1) {
          // 사진이 여러 장이면 1장만 + 지도
          return (
            <div
              key={mappedDiary.id}
              ref={isLast && lastItemRef ? lastItemRef : undefined}
              className="w-full bg-white rounded-2xl shadow-md p-3 flex flex-col cursor-pointer"
              onClick={() => handleCardClick(mappedDiary.id)}
            >
              <div className="grid grid-cols-3 gap-2 rounded-2xl mb-2" style={{ height: "120px" }}>
                {/* Blob */}
                <div className="col-span-1 h-full">
                  <div className="h-full w-full max-h-[120px] rounded-2xl bg-gradient-to-b from-[#f5f6fa] to-[#e0e3ef] flex flex-col items-center justify-center py-2">
                    {/* 감정 요약 (위) */}
                    <div className="text-xs text-[#85848F] font-medium text-center ">
                      {mappedDiary.emotions && mappedDiary.emotions.length > 0
                        ? `${mappedDiary.emotions
                            .slice(0, 2)
                            .map(e => e.emotion)
                            .join(", ")}${mappedDiary.emotions.length > 2 ? " 등" : ""}`
                        : "감정 없음"}
                    </div>
                    <div className="w-full h-full max-w-[120px] max-h-[120px] flex items-center justify-center rounded-full overflow-hidden mx-auto">
                      <Canvas className="w-full h-full">
                        <Blob diaryContent={{ emotions: mappedDiary.emotions }} />
                      </Canvas>
                    </div>
                    {/* 대상 요약 (아래) */}
                    <div className="text-xs text-[#85848F] text-center">
                      {mappedDiary.targets && mappedDiary.targets.length > 0
                        ? `${mappedDiary.targets.slice(0, 2).join(", ")}${mappedDiary.targets.length > 2 ? " 등" : ""}`
                        : "나 혼자"}
                    </div>
                  </div>
                </div>
                {/* 사진 1장 + 지도 1장 */}
                <div className="col-span-2 grid grid-cols-2 gap-1 h-full">
                  <img
                    src={filteredImages[0]}
                    alt="diary-photo-0"
                    className="rounded-lg object-cover w-full h-full"
                    style={{ aspectRatio: "1 / 1" }}
                  />
                  <img
                    src={`https://maps.googleapis.com/maps/api/staticmap?center=${mappedDiary.map?.lat},${mappedDiary.map?.lng}&zoom=15&size=200x200&markers=color:red%7C${mappedDiary.map?.lat},${mappedDiary.map?.lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`}
                    alt="map-preview"
                    className="rounded-lg object-cover w-full h-full"
                    style={{ aspectRatio: "1 / 1" }}
                  />
                </div>
              </div>
              {/* 본문/날짜/아이콘 등 기존과 동일하게... */}
              <div className="text-base text-gray-800 leading-relaxed break-words mb-3 line-clamp-4">
                {mappedDiary.content}
              </div>
              <hr className="border-t border-[#E5E5EA] mb-2" />
              <div className="flex items-center justify-between" onClick={e => e.stopPropagation()}>
                <span className="text-xs text-gray-400">
                  {dayjs(mappedDiary.date).format("YYYY년 MM월 DD일")}
                </span>
                <div className="flex items-center gap-2">
                  {mappedDiary.bookmarked && (
                    <img src={BookmarkIcon} alt="북마크" className="w-5 h-5 cursor-pointer" />
                  )}
                  <DiaryActionModal
                    open={openId === mappedDiary.id}
                    setOpen={v => setOpenId(v ? mappedDiary.id : null)}
                    onDelete={() => {
                      if (onDeleteDiary) onDeleteDiary(mappedDiary.id);
                    }}
                    onToggleBookmark={() => {
                      if (onToggleBookmark) onToggleBookmark(mappedDiary.id);
                    }}
                    trigger={
                      <img
                        src={FilterIcon}
                        alt="필터"
                        className="w-5 h-5 cursor-pointer"
                        onClick={(e: React.MouseEvent<HTMLImageElement, MouseEvent>) =>
                          setOpenId(mappedDiary.id)
                        }
                      />
                    }
                    titleHidden={true}
                    diaryId={mappedDiary.id}
                    isBookmarked={mappedDiary.bookmarked}
                  />
                </div>
              </div>
            </div>
          );
        }
        // 3. 지도만 있고 사진 없음
        else if (mappedDiary.map && filteredImages.length === 0) {
          return (
            <div
              key={mappedDiary.id}
              ref={isLast && lastItemRef ? lastItemRef : undefined}
              className="w-full bg-white rounded-2xl shadow-md p-3 flex flex-col cursor-pointer"
              onClick={() => handleCardClick(mappedDiary.id)}
            >
              <div className="grid grid-cols-3 gap-2 rounded-2xl mb-2" style={{ height: "130px" }}>
                {/* Blob */}
                <div className="col-span-1 h-full">
                  <div className="h-full w-full max-h-[120px] rounded-2xl bg-gradient-to-b from-[#f5f6fa] to-[#e0e3ef] flex flex-col items-center justify-center py-2">
                    {/* 감정 요약 (위) */}
                    <div className="text-xs text-[#85848F] font-medium text-center ">
                      {mappedDiary.emotions && mappedDiary.emotions.length > 0
                        ? `${mappedDiary.emotions
                            .slice(0, 2)
                            .map(e => e.emotion)
                            .join(", ")}${mappedDiary.emotions.length > 2 ? " 등" : ""}`
                        : "감정 없음"}
                    </div>
                    <div className="w-full h-full max-w-[120px] max-h-[120px] flex items-center justify-center rounded-full overflow-hidden mx-auto">
                      <Canvas className="w-full h-full">
                        <Blob diaryContent={{ emotions: mappedDiary.emotions }} />
                      </Canvas>
                    </div>
                    {/* 대상 요약 (아래) */}
                    <div className="text-xs text-[#85848F] text-center">
                      {mappedDiary.targets && mappedDiary.targets.length > 0
                        ? `${mappedDiary.targets.slice(0, 2).join(", ")}${mappedDiary.targets.length > 2 ? " 등" : ""}`
                        : "나 혼자"}
                    </div>
                  </div>
                </div>
                {/* 지도만 */}
                <div className="col-span-2 h-full flex items-center">
                  <img
                    src={`https://maps.googleapis.com/maps/api/staticmap?center=${mappedDiary.map?.lat},${mappedDiary.map?.lng}&zoom=15&size=200x200&markers=color:red%7C${mappedDiary.map?.lat},${mappedDiary.map?.lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`}
                    alt="map-preview"
                    className="rounded-lg object-cover w-full h-full"
                    style={{ aspectRatio: "2 / 1" }}
                  />
                </div>
              </div>
              {/* 본문/날짜/아이콘 등 기존과 동일하게... */}
              <div className="text-base text-gray-800 leading-relaxed break-words mb-3 line-clamp-4">
                {mappedDiary.content}
              </div>
              <hr className="border-t border-[#E5E5EA] mb-2" />
              <div className="flex items-center justify-between" onClick={e => e.stopPropagation()}>
                <span className="text-xs text-gray-400">
                  {dayjs(mappedDiary.date).format("YYYY년 MM월 DD일")}
                </span>
                <div className="flex items-center gap-2">
                  {mappedDiary.bookmarked && (
                    <img src={BookmarkIcon} alt="북마크" className="w-5 h-5 cursor-pointer" />
                  )}
                  <DiaryActionModal
                    open={openId === mappedDiary.id}
                    setOpen={v => setOpenId(v ? mappedDiary.id : null)}
                    onDelete={() => {
                      if (onDeleteDiary) onDeleteDiary(mappedDiary.id);
                    }}
                    onToggleBookmark={() => {
                      if (onToggleBookmark) onToggleBookmark(mappedDiary.id);
                    }}
                    trigger={
                      <img
                        src={FilterIcon}
                        alt="필터"
                        className="w-5 h-5 cursor-pointer"
                        onClick={(e: React.MouseEvent<HTMLImageElement, MouseEvent>) =>
                          setOpenId(mappedDiary.id)
                        }
                      />
                    }
                    titleHidden={true}
                    diaryId={mappedDiary.id}
                    isBookmarked={mappedDiary.bookmarked}
                  />
                </div>
              </div>
            </div>
          );
        }
        // 4. 지도 없고 사진 2장 이상
        else if (!mappedDiary.map && filteredImages.length >= 2) {
          return (
            <div
              key={mappedDiary.id}
              ref={isLast && lastItemRef ? lastItemRef : undefined}
              className="w-full bg-white rounded-2xl shadow-md p-3 flex flex-col cursor-pointer"
              onClick={() => handleCardClick(mappedDiary.id)}
            >
              <div className="grid grid-cols-3 gap-2 rounded-2xl mb-2" style={{ height: "120px" }}>
                {/* Blob */}
                <div className="col-span-1 h-full">
                  <div className="h-full w-full max-h-[120px] rounded-2xl bg-gradient-to-b from-[#f5f6fa] to-[#e0e3ef] flex flex-col items-center justify-center py-2">
                    {/* 감정 요약 (위) */}
                    <div className="text-xs text-[#85848F] font-medium text-center ">
                      {mappedDiary.emotions && mappedDiary.emotions.length > 0
                        ? `${mappedDiary.emotions
                            .slice(0, 2)
                            .map(e => e.emotion)
                            .join(", ")}${mappedDiary.emotions.length > 2 ? " 등" : ""}`
                        : "감정 없음"}
                    </div>
                    <div className="w-full h-full max-w-[120px] max-h-[120px] flex items-center justify-center rounded-full overflow-hidden mx-auto">
                      <Canvas className="w-full h-full">
                        <Blob diaryContent={{ emotions: mappedDiary.emotions }} />
                      </Canvas>
                    </div>
                    {/* 대상 요약 (아래) */}
                    <div className="text-xs text-[#85848F] text-center">
                      {mappedDiary.targets && mappedDiary.targets.length > 0
                        ? `${mappedDiary.targets.slice(0, 2).join(", ")}${mappedDiary.targets.length > 2 ? " 등" : ""}`
                        : "나 혼자"}
                    </div>
                  </div>
                </div>
                {/* 사진 2장 */}
                <div className="col-span-2 grid grid-cols-2 gap-1 h-full">
                  <img
                    src={filteredImages[0]}
                    alt="diary-photo-0"
                    className="rounded-lg object-cover w-full h-full"
                    style={{ aspectRatio: "1 / 1" }}
                  />
                  <img
                    src={filteredImages[1]}
                    alt="diary-photo-1"
                    className="rounded-lg object-cover w-full h-full"
                    style={{ aspectRatio: "1 / 1" }}
                  />
                </div>
              </div>
              {/* 본문/날짜/아이콘 등 기존과 동일하게... */}
              <div className="text-base text-gray-800 leading-relaxed break-words mb-3 line-clamp-4">
                {mappedDiary.content}
              </div>
              <hr className="border-t border-[#E5E5EA] mb-2" />
              <div className="flex items-center justify-between" onClick={e => e.stopPropagation()}>
                <span className="text-xs text-gray-400">
                  {dayjs(mappedDiary.date).format("YYYY년 MM월 DD일")}
                </span>
                <div className="flex items-center gap-2">
                  {mappedDiary.bookmarked && (
                    <img src={BookmarkIcon} alt="북마크" className="w-5 h-5 cursor-pointer" />
                  )}
                  <DiaryActionModal
                    open={openId === mappedDiary.id}
                    setOpen={v => setOpenId(v ? mappedDiary.id : null)}
                    onDelete={() => {
                      if (onDeleteDiary) onDeleteDiary(mappedDiary.id);
                    }}
                    onToggleBookmark={() => {
                      if (onToggleBookmark) onToggleBookmark(mappedDiary.id);
                    }}
                    trigger={
                      <img
                        src={FilterIcon}
                        alt="필터"
                        className="w-5 h-5 cursor-pointer"
                        onClick={(e: React.MouseEvent<HTMLImageElement, MouseEvent>) =>
                          setOpenId(mappedDiary.id)
                        }
                      />
                    }
                    titleHidden={true}
                    diaryId={mappedDiary.id}
                    isBookmarked={mappedDiary.bookmarked}
                  />
                </div>
              </div>
            </div>
          );
        }
        // 5. 지도 없고 사진 1장
        else if (!mappedDiary.map && filteredImages.length === 1) {
          return (
            <div
              key={mappedDiary.id}
              ref={isLast && lastItemRef ? lastItemRef : undefined}
              className="w-full bg-white rounded-2xl shadow-md p-3 flex flex-col cursor-pointer"
              onClick={() => handleCardClick(mappedDiary.id)}
            >
              <div className="grid grid-cols-3 gap-2 rounded-2xl mb-2" style={{ height: "120px" }}>
                {/* Blob */}
                <div className="col-span-1 h-full">
                  <div className="h-full w-full max-h-[120px] rounded-2xl bg-gradient-to-b from-[#f5f6fa] to-[#e0e3ef] flex flex-col items-center justify-center py-2">
                    {/* 감정 요약 (위) */}
                    <div className="text-xs text-[#85848F] font-medium text-center ">
                      {mappedDiary.emotions && mappedDiary.emotions.length > 0
                        ? `${mappedDiary.emotions
                            .slice(0, 2)
                            .map(e => e.emotion)
                            .join(", ")}${mappedDiary.emotions.length > 2 ? " 등" : ""}`
                        : "감정 없음"}
                    </div>
                    <div className="w-full h-full max-w-[120px] max-h-[120px] flex items-center justify-center rounded-full overflow-hidden mx-auto">
                      <Canvas className="w-full h-full">
                        <Blob diaryContent={{ emotions: mappedDiary.emotions }} />
                      </Canvas>
                    </div>
                    {/* 대상 요약 (아래) */}
                    <div className="text-xs text-[#85848F] text-center">
                      {mappedDiary.targets && mappedDiary.targets.length > 0
                        ? `${mappedDiary.targets.slice(0, 2).join(", ")}${mappedDiary.targets.length > 2 ? " 등" : ""}`
                        : "나 혼자"}
                    </div>
                  </div>
                </div>
                {/* 사진 1장 */}
                <div className="col-span-2 h-full flex items-center">
                  <img
                    src={filteredImages[0]}
                    alt="diary-photo-0"
                    className="rounded-lg object-cover w-full h-full"
                    style={{ aspectRatio: "2 / 1" }}
                  />
                </div>
              </div>
              {/* 본문/날짜/아이콘 등 기존과 동일하게... */}
              <div className="text-base text-gray-800 leading-relaxed break-words mb-3 line-clamp-4">
                {mappedDiary.content}
              </div>
              <hr className="border-t border-[#E5E5EA] mb-2" />
              <div className="flex items-center justify-between" onClick={e => e.stopPropagation()}>
                <span className="text-xs text-gray-400">
                  {dayjs(mappedDiary.date).format("YYYY년 MM월 DD일")}
                </span>
                <div className="flex items-center gap-2">
                  {mappedDiary.bookmarked && (
                    <img src={BookmarkIcon} alt="북마크" className="w-5 h-5 cursor-pointer" />
                  )}
                  <DiaryActionModal
                    open={openId === mappedDiary.id}
                    setOpen={v => setOpenId(v ? mappedDiary.id : null)}
                    onDelete={() => {
                      if (onDeleteDiary) onDeleteDiary(mappedDiary.id);
                    }}
                    onToggleBookmark={() => {
                      if (onToggleBookmark) onToggleBookmark(mappedDiary.id);
                    }}
                    trigger={
                      <img
                        src={FilterIcon}
                        alt="필터"
                        className="w-5 h-5 cursor-pointer"
                        onClick={(e: React.MouseEvent<HTMLImageElement, MouseEvent>) =>
                          setOpenId(mappedDiary.id)
                        }
                      />
                    }
                    titleHidden={true}
                    diaryId={mappedDiary.id}
                    isBookmarked={mappedDiary.bookmarked}
                  />
                </div>
              </div>
            </div>
          );
        }
        // 6. fallback
        else {
          return (
            <div
              key={mappedDiary.id}
              ref={isLast && lastItemRef ? lastItemRef : undefined}
              className="w-full bg-white rounded-2xl shadow-md p-3 flex flex-col cursor-pointer"
              onClick={() => handleCardClick(mappedDiary.id)}
            >
              <div className="flex items-center justify-center h-24 text-gray-400">
                표시할 수 없는 조합입니다.
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

export default DiaryCards;
