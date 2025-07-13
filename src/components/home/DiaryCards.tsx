import React from "react";
import { Canvas } from "@react-three/fiber";
import Blob from "../Blob/Blob";
import BookmarkIcon from "../../assets/img/bookmark.svg";
import FilterIcon from "../../assets/img/filter.svg";
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

interface Diary {
  id: number;
  emotion: string;
  emotions: string[];
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
  return (
    <div className="flex flex-col gap-6 w-full max-w-[420px] mx-auto">
      {/* 기존 하드코딩 예시 카드 (수정하지 않음) */}
      <div className="w-full bg-white rounded-2xl shadow-md p-3 flex flex-col">
        {/* 상단: Blob + 감정/키워드/행동 요약 (배경색, 라운드, 그라데이션) */}
        <div className="flex gap-4 items-center rounded-2xl bg-gradient-to-b from-[#f5f6fa] to-[#e0e3ef] mb-4">
          <div className="w-[80px] h-[100px] flex items-center justify-center rounded-full overflow-hidden">
            <Canvas className="w-full h-full">
              <Blob diaryContent={null} />
            </Canvas>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-medium text-gray-700 truncate ">
              부끄러움, 뉘우침 외 3가지
            </div>
            <div className="text-xs text-[#85848F] truncate">수빈, 하린 등</div>
            <div className="text-xs text-[#85848F] truncate">브런치 먹음, 전 직장 지나감 등</div>
          </div>
        </div>

        {/* 본문 */}
        <div className="text-base text-gray-800 leading-relaxed break-words mb-3">
          내일은 크래프톤 정글에 입소하는 날이다. 가족들이랑 반년 가까이 떨어질 생각을 하니 좀
          막막하고, 오랜만에 기숙사에서 어린 친구들과 동거동락할 생각에 좀 긴장된다. 특히 내가 잘
          학습할 수 있을지에 대해 걱정이 앞서는데
        </div>

        {/* 구분선 */}
        <hr className="border-t border-[#E5E5EA] mb-2" />

        {/* 날짜 & 오른쪽 아이콘들 */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">2024년 7월 10일</span>
          <div className="flex items-center gap-2">
            <img src={BookmarkIcon} alt="북마크" className="w-5 h-5 cursor-pointer" />
            <Dialog>
              <DialogTrigger asChild>
                <img src={FilterIcon} alt="필터" className="w-5 h-5 cursor-pointer" />
              </DialogTrigger>
              {/* 오버레이를 완전 투명하게 */}
              <DialogOverlay className="!bg-transparent" />
              <DialogContent className="max-w-[320px] w-full rounded-2xl bg-[#FAF6F4] border border-[#D6D3F0] shadow-lg px-6 pt-12 pb-6">
                <div className="flex flex-col gap-3">
                  <Button
                    variant="outline"
                    className="flex items-center justify-center gap-2  rounded-xl"
                  >
                    <img src={BookmarkIcon} alt="북마크" className="w-4 h-4" />
                    북마크
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center justify-center gap-2  rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                    일기 삭제하기
                  </Button>
                </div>
                <DialogFooter />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      {/* props로 받은 diaries가 있으면 아래에 map으로 렌더링 */}
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
                <div className="flex gap-4 items-center rounded-2xl bg-gradient-to-b from-[#f5f6fa] to-[#e0e3ef] mb-4">
                  <div className="w-[80px] h-[100px] flex items-center justify-center rounded-full overflow-hidden">
                    <Canvas className="w-full h-full">
                      <Blob diaryContent={diary.emotions} />
                    </Canvas>
                  </div>
                  <div className="flex-1 min-w-0">
                    {/* 감정 요약 */}
                    <div className="text-[15px] font-medium text-gray-700 truncate ">
                      {diary.emotions && diary.emotions.length > 0
                        ? `${diary.emotions.slice(0, 2).join(", ")}${diary.emotions.length > 2 ? ` 외 ${diary.emotions.length - 2}가지` : ""}`
                        : "감정 없음"}
                    </div>
                    {/* 타겟 요약 */}
                    <div className="text-xs text-[#85848F] truncate">
                      {diary.targets && diary.targets.length > 0
                        ? `${diary.targets.slice(0, 3).join(", ")}${diary.targets.length >= 4 ? " 등" : ""}`
                        : "타겟 없음"}
                    </div>
                    {/* 액티비티 요약 */}
                    <div className="text-xs text-[#85848F] truncate">
                      {diary.activities && diary.activities.length > 0
                        ? `${diary.activities.slice(0, 3).join(", ")}${diary.activities.length >= 3 ? " 등" : ""}`
                        : "액티비티 없음"}
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
                  <span className="text-xs text-gray-400">{diary.date}</span>
                  <div className="flex items-center gap-2">{/* 북마크 등 아이콘 */}</div>
                </div>
              </div>
            );
          }
          return (
            <div key={diary.id} className="w-full bg-white rounded-2xl shadow-md p-3 flex flex-col">
              {/* 상단: Blob + 사진(들) 분할 */}
              <div className={`grid ${gridCols} gap-2 items-center rounded-2xl mb-2`}>
                {/* Blob */}
                <div
                  className={`flex items-center justify-center rounded-full overflow-hidden aspect-square mx-auto ${blobSize}`}
                >
                  <Canvas className="w-full h-full">
                    <Blob diaryContent={diary.emotion} />
                  </Canvas>
                </div>
                {/* 사진들 */}
                {gridImages.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`diary-photo-${idx}`}
                    className="rounded-lg object-cover aspect-square w-full max-w-[140px] mx-auto"
                  />
                ))}
              </div>
              {/* 키워드/행동 summary */}
              {/* <div className="flex-1 min-w-0 mb-2">
                <div className="text-[15px] font-medium text-gray-700 truncate ">
                  {diary.keywords && diary.keywords.length > 0
                    ? diary.keywords.join(", ")
                    : "키워드 없음"}
                </div>
                <div className="text-xs text-[#85848F] truncate">
                  {diary.behaviors && diary.behaviors.length > 0
                    ? diary.behaviors.join(", ")
                    : "행동 없음"}
                </div>
              </div> */}
              {/* 본문 */}
              <div className="text-base text-gray-800 leading-relaxed break-words mb-3 line-clamp-4">
                {diary.content}
              </div>
              {/* 구분선 */}
              <hr className="border-t border-[#E5E5EA] mb-2" />
              {/* 날짜 & 오른쪽 아이콘들 */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{diary.date}</span>
                <div className="flex items-center gap-2">
                  <img
                    src={BookmarkIcon}
                    alt="북마크"
                    className={`w-5 h-5 cursor-pointer ${diary.bookmarked ? "opacity-100" : "opacity-40"}`}
                  />
                  <Dialog>
                    <DialogTrigger asChild>
                      <img src={FilterIcon} alt="필터" className="w-5 h-5 cursor-pointer" />
                    </DialogTrigger>
                    <DialogOverlay className="!bg-transparent" />
                    <DialogContent className="max-w-[320px] w-full rounded-2xl bg-[#FAF6F4] border border-[#D6D3F0] shadow-lg px-6 pt-12 pb-6">
                      <div className="flex flex-col gap-3">
                        <Button
                          variant="outline"
                          className="flex items-center justify-center gap-2  rounded-xl"
                        >
                          <img src={BookmarkIcon} alt="북마크" className="w-4 h-4" />
                          북마크
                        </Button>
                        <Button
                          variant="outline"
                          className="flex items-center justify-center gap-2  rounded-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                          일기 삭제하기
                        </Button>
                      </div>
                      <DialogFooter />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default DiaryCards;
