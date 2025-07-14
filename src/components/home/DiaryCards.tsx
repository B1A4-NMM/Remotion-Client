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
          let gridImages = images;
          let gridCols = "grid-cols-" + (1 + images.length);
          let blobSize = "w-[160px] h-[160px]";
          if (images.length >= 3) {
            gridImages = images.slice(0, 2);
            gridCols = "grid-cols-3";
            blobSize = "w-[120px] h-[120px]";
          } else if (images.length === 2) {
            gridCols = "grid-cols-3";
            blobSize = "w-[120px] h-[120px]";
          } else if (images.length === 1) {
            gridCols = "grid-cols-2";
            blobSize = "w-[140px] h-[140px]";
          }
          const isEmotionOnly = !diary.map && (!diary.photoUrl || diary.photoUrl.length === 0);
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
          } else if (images.length === 1 || (diary.map && images.length === 0)) {
            // 사진 1개만 있거나 지도만 있을 때
            return (
              <div
                key={diary.id}
                className="w-full bg-white rounded-2xl shadow-md p-3 flex flex-col"
              >
                <div className="grid grid-cols-3 gap-2 items-center mb-2">
                  {/* Blob (1칸, 배경) */}
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
                  {/* 사진/지도 (2칸, 넓게) */}
                  <div className="col-span-2 h-full flex items-center">
                    {images.length === 1 ? (
                      <img
                        src={images[0]}
                        alt="diary-photo-0"
                        className="rounded-lg object-cover w-full h-full max-h-[120px]"
                        style={{ aspectRatio: "2 / 1" }}
                      />
                    ) : (
                      <img
                        src={`https://maps.googleapis.com/maps/api/staticmap?center=${diary.map.lat},${diary.map.lng}&zoom=15&size=200x200&markers=color:red%7C${diary.map.lat},${diary.map.lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`}
                        alt="map-preview"
                        className="rounded-lg object-cover w-full h-full max-h-[120px]"
                        style={{ aspectRatio: "2 / 1" }}
                      />
                    )}
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
          // 각 diary별로 open 상태 관리
          return (
            <div key={diary.id} className="w-full bg-white rounded-2xl shadow-md p-3 flex flex-col">
              {/* 상단: Blob + 사진(들) 분할 */}
              <div
                className={`grid grid-cols-3 gap-2 items-center rounded-2xl mb-2`}
                style={{ height: "130px" }}
              >
                {/* 1. Blob */}
                <div className="flex items-center justify-center rounded-full overflow-hidden aspect-square mx-auto w-[110px] h-[110px]">
                  <Canvas className="w-full h-full">
                    <Blob diaryContent={{ emotions: diary.emotions }} />
                  </Canvas>
                </div>
                {/* 2,3. 사진/지도 */}
                {gridImages.length > 0 && diary.map ? (
                  <>
                    {/* 사진 */}
                    <img
                      src={gridImages[0]}
                      alt="diary-photo-0"
                      className="rounded-lg object-cover aspect-square w-full max-w-[140px] mx-auto h-full"
                    />
                    {/* 지도 */}
                    <img
                      src={`https://maps.googleapis.com/maps/api/staticmap?center=${diary.map.lat},${diary.map.lng}&zoom=15&size=200x200&markers=color:red%7C${diary.map.lat},${diary.map.lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`}
                      alt="map-preview"
                      className="rounded-lg object-cover aspect-square w-full max-w-[140px] mx-auto h-full"
                    />
                  </>
                ) : gridImages.length > 0 ? (
                  // 사진만 있을 때: 오른쪽 2칸을 사진이 차지
                  <img
                    src={gridImages[0]}
                    alt="diary-photo-0"
                    className="rounded-lg object-cover w-full h-full max-h-[120px] col-span-2"
                    style={{ aspectRatio: "2 / 1" }}
                  />
                ) : diary.map ? (
                  // 지도만 있을 때: 오른쪽 2칸을 지도 미리보기가 차지
                  <img
                    src={`https://maps.googleapis.com/maps/api/staticmap?center=${diary.map.lat},${diary.map.lng}&zoom=15&size=200x200&markers=color:red%7C${diary.map.lat},${diary.map.lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`}
                    alt="map-preview"
                    className="rounded-lg object-cover w-full h-full max-h-[120px] col-span-2"
                    style={{ aspectRatio: "2 / 1" }}
                  />
                ) : (
                  // 아무것도 없으면 빈칸 2개
                  <>
                    <div />
                    <div />
                  </>
                )}
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
                  <img
                    src={BookmarkIcon}
                    alt="북마크"
                    className={`w-5 h-5 cursor-pointer ${diary.bookmarked ? "opacity-100" : "opacity-40"}`}
                  />
                  <DiaryActionModal
                    open={openId === diary.id}
                    setOpen={v => setOpenId(v ? diary.id : null)}
                    onDelete={() => {
                      deleteDiaryMutation.mutate(
                        { token, diaryId: String(diary.id) },
                        { onSuccess: () => setOpenId(null) }
                      );
                    }}
                    trigger={<img src={FilterIcon} alt="필터" className="w-5 h-5 cursor-pointer" />}
                    titleHidden={true}
                    diaryId={diary.id}
                    isBookmarked={diary.bookmarked}
                  />
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default DiaryCards;
