import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import Blob from "../Blob/Blob";
import BookmarkIcon from "../../assets/img/bookmark.svg";
import FilterIcon from "../../assets/img/filter.svg";
import DiaryActionModal from "./DiaryActionModal";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogOverlay,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { useDeleteDiary } from "../../api/queries/home/useDeleteDiary";
import dayjs from "dayjs";

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
  diaries?: Diary[];
}

const DiaryCards: React.FC<DiaryCardsProps> = props => {
  const { diaries } = props;
  const deleteDiaryMutation = useDeleteDiary();
  const token = localStorage.getItem("accessToken") || "";
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-6 w-full max-w-[420px] mx-auto">
      {diaries &&
        diaries.length > 0 &&
        diaries.map(diary => {
          const images = diary.photoUrl
            ? Array.isArray(diary.photoUrl)
              ? diary.photoUrl
              : [diary.photoUrl]
            : [];
          const filteredImages = images.filter(img => !!img && img.trim() !== "");
          const isEmotionOnly = !diary.map && (!diary.photoUrl || filteredImages.length === 0);

          // 1. 감정만 있는 경우
          if (isEmotionOnly) {
            return (
              <div
                key={diary.id}
                className="w-full bg-white rounded-2xl shadow-md p-3 flex flex-col"
              >
                <div className="flex gap-4 items-center rounded-2xl bg-gradient-to-b from-[#f5f6fa] to-[#e0e3ef] mb-4 py-[14px] px-[20px]">
                  <div className="w-[70px] h-[70px] flex items-center justify-center rounded-full overflow-hidden">
                    <Canvas className="w-full h-full">
                      <Blob diaryContent={{ emotions: diary.emotions }} />
                    </Canvas>
                  </div>
                  <div className="flex-1 min-w-0">
                    {/* 감정 요약 */}
                    <div className="text-[14px] font-medium text-gray-700 truncate ">
                      {diary.emotions && diary.emotions.length > 0
                        ? `${diary.emotions
                            .slice(0, 2)
                            .map(e => e.emotion)
                            .join(
                              ", "
                            )}${diary.emotions.length > 2 ? ` 외 ${diary.emotions.length - 2}가지 감정` : ""}`
                        : "감정 없음"}
                    </div>
                    {/* 타겟 요약 */}
                    <div className="text-xs text-[#85848F] truncate">
                      {diary.targets && diary.targets.length > 0
                        ? `${diary.targets.slice(0, 3).join(", ")}${diary.targets.length >= 4 ? " 등" : ""}`
                        : "나혼자"}
                    </div>
                    {/* 액티비티 요약 */}
                    <div className="text-xs text-[#85848F] truncate">
                      {diary.activities && diary.activities.length > 0
                        ? `${diary.activities.slice(0, 3).join(", ")}${diary.activities.length >= 3 ? " 등" : ""}`
                        : "활동 없음"}
                    </div>
                  </div>
                </div>
                {/* 본문 */}
                <div className="text-base text-gray-800 leading-relaxed break-words mb-3 line-clamp-4">
                  {diary.content}
                </div>
                {/* 구분선 */}
                <hr className="border-t border-[#E5E5EA] mb-2" />
                {/* 날짜 & 오른쪽 아이콘들 */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {dayjs(diary.date).format("YYYY년 MM월 DD일")}
                  </span>
                  <div className="flex items-center gap-2">
                    {diary.bookmarked && (
                      <img src={BookmarkIcon} alt="북마크" className="w-5 h-5 cursor-pointer" />
                    )}
                    <DiaryActionModal
                      open={openId === diary.id}
                      setOpen={v => setOpenId(v ? diary.id : null)}
                      onDelete={() => {
                        deleteDiaryMutation.mutate({ token, diaryId: String(diary.id) });
                      }}
                      trigger={
                        <img
                          src={FilterIcon}
                          alt="필터"
                          className="w-5 h-5 cursor-pointer"
                          onClick={() => setOpenId(diary.id)}
                        />
                      }
                      titleHidden={true}
                      diaryId={diary.id}
                      isBookmarked={diary.bookmarked}
                    />
                  </div>
                </div>
              </div>
            );
          }
          // 2. 지도 + 사진 1장 이상
          else if (diary.map && filteredImages.length >= 1) {
            // 사진이 여러 장이면 1장만 + 지도
            return (
              <div
                key={diary.id}
                className="w-full bg-white rounded-2xl shadow-md p-3 flex flex-col"
              >
                <div
                  className="grid grid-cols-3 gap-2 rounded-2xl mb-2"
                  style={{ height: "120px" }}
                >
                  {/* Blob */}
                  <div className="col-span-1 h-full">
                    <div className="h-full w-full max-h-[120px] rounded-2xl bg-gradient-to-b from-[#f5f6fa] to-[#e0e3ef] flex flex-col items-center justify-center py-2">
                      {/* 감정 요약 (위) */}
                      <div className="text-xs text-[#85848F] font-medium text-center ">
                        {diary.emotions && diary.emotions.length > 0
                          ? `${diary.emotions
                              .slice(0, 2)
                              .map(e => e.emotion)
                              .join(", ")}${diary.emotions.length > 2 ? " 등" : ""}`
                          : "감정 없음"}
                      </div>
                      <div className="w-full h-full max-w-[120px] max-h-[120px] flex items-center justify-center rounded-full overflow-hidden mx-auto">
                        <Canvas className="w-full h-full">
                          <Blob diaryContent={{ emotions: diary.emotions }} />
                        </Canvas>
                      </div>
                      {/* 대상 요약 (아래) */}
                      <div className="text-xs text-[#85848F] text-center">
                        {diary.targets && diary.targets.length > 0
                          ? `${diary.targets.slice(0, 2).join(", ")}${diary.targets.length > 2 ? " 등" : ""}`
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
                      src={`https://maps.googleapis.com/maps/api/staticmap?center=${diary.map?.lat},${diary.map?.lng}&zoom=15&size=200x200&markers=color:red%7C${diary.map?.lat},${diary.map?.lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`}
                      alt="map-preview"
                      className="rounded-lg object-cover w-full h-full"
                      style={{ aspectRatio: "1 / 1" }}
                    />
                  </div>
                </div>
                {/* 본문/날짜/아이콘 등 기존과 동일하게... */}
                <div className="text-base text-gray-800 leading-relaxed break-words mb-3 line-clamp-4">
                  {diary.content}
                </div>
                <hr className="border-t border-[#E5E5EA] mb-2" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {dayjs(diary.date).format("YYYY년 MM월 DD일")}
                  </span>
                  <div className="flex items-center gap-2">
                    {diary.bookmarked && (
                      <img src={BookmarkIcon} alt="북마크" className="w-5 h-5 cursor-pointer" />
                    )}
                    <DiaryActionModal
                      open={openId === diary.id}
                      setOpen={v => setOpenId(v ? diary.id : null)}
                      onDelete={() => {
                        deleteDiaryMutation.mutate({ token, diaryId: String(diary.id) });
                      }}
                      trigger={
                        <img
                          src={FilterIcon}
                          alt="필터"
                          className="w-5 h-5 cursor-pointer"
                          onClick={() => setOpenId(diary.id)}
                        />
                      }
                      titleHidden={true}
                      diaryId={diary.id}
                      isBookmarked={diary.bookmarked}
                    />
                  </div>
                </div>
              </div>
            );
          }
          // 3. 지도만 있고 사진 없음
          else if (diary.map && filteredImages.length === 0) {
            return (
              <div
                key={diary.id}
                className="w-full bg-white rounded-2xl shadow-md p-3 flex flex-col"
              >
                <div
                  className="grid grid-cols-3 gap-2 rounded-2xl mb-2"
                  style={{ height: "130px" }}
                >
                  {/* Blob */}
                  <div className="col-span-1 h-full">
                    <div className="h-full w-full max-h-[120px] rounded-2xl bg-gradient-to-b from-[#f5f6fa] to-[#e0e3ef] flex flex-col items-center justify-center py-2">
                      {/* 감정 요약 (위) */}
                      <div className="text-xs text-[#85848F] font-medium text-center ">
                        {diary.emotions && diary.emotions.length > 0
                          ? `${diary.emotions
                              .slice(0, 2)
                              .map(e => e.emotion)
                              .join(", ")}${diary.emotions.length > 2 ? " 등" : ""}`
                          : "감정 없음"}
                      </div>
                      <div className="w-full h-full max-w-[120px] max-h-[120px] flex items-center justify-center rounded-full overflow-hidden mx-auto">
                        <Canvas className="w-full h-full">
                          <Blob diaryContent={{ emotions: diary.emotions }} />
                        </Canvas>
                      </div>
                      {/* 대상 요약 (아래) */}
                      <div className="text-xs text-[#85848F] text-center">
                        {diary.targets && diary.targets.length > 0
                          ? `${diary.targets.slice(0, 2).join(", ")}${diary.targets.length > 2 ? " 등" : ""}`
                          : "나 혼자"}
                      </div>
                    </div>
                  </div>
                  {/* 지도만 */}
                  <div className="col-span-2 h-full flex items-center">
                    <img
                      src={`https://maps.googleapis.com/maps/api/staticmap?center=${diary.map?.lat},${diary.map?.lng}&zoom=15&size=200x200&markers=color:red%7C${diary.map?.lat},${diary.map?.lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`}
                      alt="map-preview"
                      className="rounded-lg object-cover w-full h-full"
                      style={{ aspectRatio: "2 / 1" }}
                    />
                  </div>
                </div>
                {/* 본문/날짜/아이콘 등 기존과 동일하게... */}
                <div className="text-base text-gray-800 leading-relaxed break-words mb-3 line-clamp-4">
                  {diary.content}
                </div>
                <hr className="border-t border-[#E5E5EA] mb-2" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {dayjs(diary.date).format("YYYY년 MM월 DD일")}
                  </span>
                  <div className="flex items-center gap-2">
                    {diary.bookmarked && (
                      <img src={BookmarkIcon} alt="북마크" className="w-5 h-5 cursor-pointer" />
                    )}
                    <DiaryActionModal
                      open={openId === diary.id}
                      setOpen={v => setOpenId(v ? diary.id : null)}
                      onDelete={() => {
                        deleteDiaryMutation.mutate({ token, diaryId: String(diary.id) });
                      }}
                      trigger={
                        <img
                          src={FilterIcon}
                          alt="필터"
                          className="w-5 h-5 cursor-pointer"
                          onClick={() => setOpenId(diary.id)}
                        />
                      }
                      titleHidden={true}
                      diaryId={diary.id}
                      isBookmarked={diary.bookmarked}
                    />
                  </div>
                </div>
              </div>
            );
          }
          // 4. 지도 없고 사진 2장 이상
          else if (!diary.map && filteredImages.length >= 2) {
            return (
              <div
                key={diary.id}
                className="w-full bg-white rounded-2xl shadow-md p-3 flex flex-col"
              >
                <div
                  className="grid grid-cols-3 gap-2 rounded-2xl mb-2"
                  style={{ height: "120px" }}
                >
                  {/* Blob */}
                  <div className="col-span-1 h-full">
                    <div className="h-full w-full max-h-[120px] rounded-2xl bg-gradient-to-b from-[#f5f6fa] to-[#e0e3ef] flex flex-col items-center justify-center py-2">
                      {/* 감정 요약 (위) */}
                      <div className="text-xs text-[#85848F] font-medium text-center ">
                        {diary.emotions && diary.emotions.length > 0
                          ? `${diary.emotions
                              .slice(0, 2)
                              .map(e => e.emotion)
                              .join(", ")}${diary.emotions.length > 2 ? " 등" : ""}`
                          : "감정 없음"}
                      </div>
                      <div className="w-full h-full max-w-[120px] max-h-[120px] flex items-center justify-center rounded-full overflow-hidden mx-auto">
                        <Canvas className="w-full h-full">
                          <Blob diaryContent={{ emotions: diary.emotions }} />
                        </Canvas>
                      </div>
                      {/* 대상 요약 (아래) */}
                      <div className="text-xs text-[#85848F] text-center">
                        {diary.targets && diary.targets.length > 0
                          ? `${diary.targets.slice(0, 2).join(", ")}${diary.targets.length > 2 ? " 등" : ""}`
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
                  {diary.content}
                </div>
                <hr className="border-t border-[#E5E5EA] mb-2" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {dayjs(diary.date).format("YYYY년 MM월 DD일")}
                  </span>
                  <div className="flex items-center gap-2">
                    {diary.bookmarked && (
                      <img src={BookmarkIcon} alt="북마크" className="w-5 h-5 cursor-pointer" />
                    )}
                    <DiaryActionModal
                      open={openId === diary.id}
                      setOpen={v => setOpenId(v ? diary.id : null)}
                      onDelete={() => {
                        deleteDiaryMutation.mutate({ token, diaryId: String(diary.id) });
                      }}
                      trigger={
                        <img
                          src={FilterIcon}
                          alt="필터"
                          className="w-5 h-5 cursor-pointer"
                          onClick={() => setOpenId(diary.id)}
                        />
                      }
                      titleHidden={true}
                      diaryId={diary.id}
                      isBookmarked={diary.bookmarked}
                    />
                  </div>
                </div>
              </div>
            );
          }
          // 5. 지도 없고 사진 1장
          else if (!diary.map && filteredImages.length === 1) {
            return (
              <div
                key={diary.id}
                className="w-full bg-white rounded-2xl shadow-md p-3 flex flex-col"
              >
                <div
                  className="grid grid-cols-3 gap-2 rounded-2xl mb-2"
                  style={{ height: "120px" }}
                >
                  {/* Blob */}
                  <div className="col-span-1 h-full">
                    <div className="h-full w-full max-h-[120px] rounded-2xl bg-gradient-to-b from-[#f5f6fa] to-[#e0e3ef] flex flex-col items-center justify-center py-2">
                      {/* 감정 요약 (위) */}
                      <div className="text-xs text-[#85848F] font-medium text-center ">
                        {diary.emotions && diary.emotions.length > 0
                          ? `${diary.emotions
                              .slice(0, 2)
                              .map(e => e.emotion)
                              .join(", ")}${diary.emotions.length > 2 ? " 등" : ""}`
                          : "감정 없음"}
                      </div>
                      <div className="w-full h-full max-w-[120px] max-h-[120px] flex items-center justify-center rounded-full overflow-hidden mx-auto">
                        <Canvas className="w-full h-full">
                          <Blob diaryContent={{ emotions: diary.emotions }} />
                        </Canvas>
                      </div>
                      {/* 대상 요약 (아래) */}
                      <div className="text-xs text-[#85848F] text-center">
                        {diary.targets && diary.targets.length > 0
                          ? `${diary.targets.slice(0, 2).join(", ")}${diary.targets.length > 2 ? " 등" : ""}`
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
                  {diary.content}
                </div>
                <hr className="border-t border-[#E5E5EA] mb-2" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {dayjs(diary.date).format("YYYY년 MM월 DD일")}
                  </span>
                  <div className="flex items-center gap-2">
                    {diary.bookmarked && (
                      <img src={BookmarkIcon} alt="북마크" className="w-5 h-5 cursor-pointer" />
                    )}
                    <DiaryActionModal
                      open={openId === diary.id}
                      setOpen={v => setOpenId(v ? diary.id : null)}
                      onDelete={() => {
                        deleteDiaryMutation.mutate({ token, diaryId: String(diary.id) });
                      }}
                      trigger={
                        <img
                          src={FilterIcon}
                          alt="필터"
                          className="w-5 h-5 cursor-pointer"
                          onClick={() => setOpenId(diary.id)}
                        />
                      }
                      titleHidden={true}
                      diaryId={diary.id}
                      isBookmarked={diary.bookmarked}
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
                key={diary.id}
                className="w-full bg-white rounded-2xl shadow-md p-3 flex flex-col"
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
