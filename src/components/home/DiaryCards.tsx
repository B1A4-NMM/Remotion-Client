import React, { useState } from "react";
import BookmarkIcon from "../../assets/img/Bookmark.svg";
import FilterIcon from "../../assets/img/Filter.svg";
import DiaryActionModal from "./DiaryActionModal";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import VirtualizedBlobCard from "../Blob/VirtualizedBlobCard";

interface Diary {
  diaryId: number;
  emotions?: Array<{ emotion: string; intensity: number }>;
  targets?: string[];
  activities?: string[];
  photoPath?: string | string[];
  latitude?: number;
  longitude?: number;
  content: string;
  writtenDate: string;
  title?: string;
  relate_sentence?: string;
  search_sentence?: string;
  isBookmarked?: boolean;
}

interface DiaryCardsProps {
  diaries: Diary[];
  onDeleteDiary?: (diaryId: number) => void;
  lastItemRef?: (node: HTMLDivElement | null) => void;
}

const DiaryCards: React.FC<DiaryCardsProps> = ({ diaries, onDeleteDiary, lastItemRef }) => {
  const [openId, setOpenId] = useState<number | null>(null);
  const navigate = useNavigate();
  console.log("🔍 DiaryCards 컴포넌트:");
  console.log("  - diaries:", diaries);
  console.log("  - diaries[0]:", diaries[0]);
  console.log("  - diaries[0]?.diaryId:", diaries[0]?.diaryId);
  console.log("  - diaries[0]?.id:", (diaries[0] as any)?.id);
  console.log("  - diaries[0]의 모든 키:", diaries[0] ? Object.keys(diaries[0]) : []);

  if (!diaries || diaries.length === 0) {
    return <div className="w-full text-center py-8 text-gray-400">검색 결과가 없습니다.</div>;
  }

  const handleCardClick = (diaryId: number) => {
    console.log("🔍 handleCardClick 호출:");
    console.log("  - diaryId:", diaryId);
    console.log("  - diaryId 타입:", typeof diaryId);

    if (!diaryId) {
      console.error("❌ diaryId가 undefined입니다!");
      return;
    }

    navigate(`/result/${diaryId}?view=record`);
  };

  // 공통 컴포넌트들
  const renderBlobSection = (diary: Diary, index: number) => (
    <div className="h-full w-full rounded-lg bg-gradient-to-b from-[#f5f6fa] to-[#e0e3ef] flex flex-col items-center justify-center p-2">
      <div className="text-base text-[#85848F] font-medium text-center mb-2">
        {diary.emotions && diary.emotions.length > 0
          ? `${diary.emotions
              .slice(0, 2)
              .map(e => e.emotion)
              .join(", ")}${diary.emotions.length > 2 ? " 등" : ""}`
          : "감정 없음"}
      </div>
      <div className="w-full h-full flex items-center justify-center rounded-full overflow-hidden mx-auto">
        <VirtualizedBlobCard
          key={diary.diaryId}
          diaryContent={{ emotions: diary.emotions }}
          index={index}
        />
      </div>
      <div className="text-base text-[#85848F] text-center mt-2">
        {diary.targets && diary.targets.length > 0
          ? `${diary.targets.slice(0, 2).join(", ")}${diary.targets.length > 2 ? " 등" : ""}`
          : "나 혼자"}
      </div>
    </div>
  );

  const renderMapSection = (diary: Diary) => (
    <div className="relative w-full h-full">
      <img
        src={`https://maps.googleapis.com/maps/api/staticmap?center=${diary.latitude},${diary.longitude}&zoom=15&size=200x200&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`}
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

  // relate_sentence를 형광색으로 표시하는 함수
  const highlightRelateSentence = (content: string, relateSentence: string) => {
    console.log("🔍 highlightRelateSentence 호출:");
    console.log("  - content:", content);
    console.log("  - relateSentence:", relateSentence);
    console.log("  - relateSentence 타입:", typeof relateSentence);

    if (!relateSentence || !content) {
      console.log("  - 조건문에서 early return");
      return content;
    }

    // 대소문자를 구분하지 않고 검색
    const lowerContent = content.toLowerCase();
    const lowerRelateSentence = relateSentence.toLowerCase();

    const parts = [];
    let lastIndex = 0;
    let currentIndex = 0;

    while ((currentIndex = lowerContent.indexOf(lowerRelateSentence, lastIndex)) !== -1) {
      // 일치하지 않는 부분 추가
      if (currentIndex > lastIndex) {
        parts.push(content.substring(lastIndex, currentIndex));
      }

      // 하이라이트된 부분 추가
      const highlighted = content.substring(currentIndex, currentIndex + relateSentence.length);
      parts.push(
        <span key={currentIndex} className="bg-green-300/40 text-black font-medium px-1 rounded">
          {highlighted}
        </span>
      );

      lastIndex = currentIndex + relateSentence.length;
    }

    // 마지막 부분 추가
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return <>{parts}</>;
  };

  const renderFooter = (diary: Diary) => {
    console.log(
      `Diary ${diary.diaryId} bookmarked:`,
      diary.isBookmarked,
      typeof diary.isBookmarked
    );
    console.log("🔍 renderFooter에서 diary 정보:");
    console.log("  - diary:", diary);
    console.log("  - diary.diaryId:", diary.diaryId);
    console.log("  - diary.diaryId 타입:", typeof diary.diaryId);
    console.log("  - diary의 모든 키:", Object.keys(diary));
    console.log("  - diary의 모든 값:", Object.values(diary));

    // diaryId가 undefined인지 확인
    if (!diary.diaryId) {
      console.error("❌ renderFooter에서 diary.diaryId가 undefined입니다!");
      console.error("  - 전체 diary 객체:", diary);
    }

    return (
      <>
        <div className="text-base text-gray-800 leading-relaxed break-words mb-4 line-clamp-4">
          {(() => {
            console.log("🔍 renderFooter에서 diary 정보:");
            console.log("  - diary.relate_sentence:", diary.relate_sentence);
            console.log("  - diary.content:", diary.content);

            return diary.relate_sentence
              ? highlightRelateSentence(diary.content, diary.relate_sentence)
              : diary.content;
          })()}
        </div>
        <hr className="border-t border-[#E5E5EA] mb-3" />
        <div className="flex items-center justify-between" onClick={e => e.stopPropagation()}>
          <span className="text-xs text-gray-400">
            {dayjs(diary.writtenDate).format("YYYY년 M월 D일")}
          </span>
          <div className="flex items-center gap-3">
            {Boolean(diary.isBookmarked) && (
              <img src={BookmarkIcon} alt="북마크" className="w-5 h-5 cursor-pointer" />
            )}
            <DiaryActionModal
              open={openId === diary.diaryId}
              setOpen={v => setOpenId(v ? diary.diaryId : null)}
              onDelete={() => {
                if (onDeleteDiary) onDeleteDiary(diary.diaryId);
              }}
              trigger={
                <img
                  src={FilterIcon}
                  alt="필터"
                  className="w-5 h-5 cursor-pointer"
                  onClick={(e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
                    e.stopPropagation();
                    setOpenId(diary.diaryId);
                  }}
                />
              }
              titleHidden={true}
              diaryId={diary.diaryId}
              isBookmarked={diary.isBookmarked || false}
            />
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-[420px] mx-auto">
      {diaries.map((mappedDiary, index) => {
        console.log(`🔍 mappedDiary[${index}]:`, mappedDiary);
        console.log(`🔍 mappedDiary[${index}].diaryId:`, mappedDiary.diaryId);
        console.log(`🔍 mappedDiary[${index}].id:`, (mappedDiary as any).id);
        console.log(`🔍 mappedDiary[${index}]의 모든 키:`, Object.keys(mappedDiary));
        console.log(`🔍 mappedDiary[${index}]의 모든 값:`, Object.values(mappedDiary));

        // diaryId가 undefined인지 확인
        if (!mappedDiary.diaryId) {
          console.error(`❌ mappedDiary[${index}]의 diaryId가 undefined입니다!`);
          console.error(`  - 전체 객체:`, mappedDiary);
        }

        const images = mappedDiary.photoPath
          ? Array.isArray(mappedDiary.photoPath)
            ? mappedDiary.photoPath.filter((img: string | unknown) => typeof img === "string")
            : typeof mappedDiary.photoPath === "string"
              ? [mappedDiary.photoPath]
              : []
          : [];

        const filteredImages = images.filter(
          (img: string | null | undefined) => typeof img === "string" && img.trim() !== ""
        );

        const isLast = index === diaries.length - 1;
        const hasMap = !!(mappedDiary.latitude && mappedDiary.longitude);
        const imageCount = filteredImages.length;

        // 케이스 1: Blob만 (사진 0개, 지도 없음)
        if (!hasMap && imageCount === 0) {
          return (
            <div
              key={mappedDiary.diaryId}
              ref={isLast && lastItemRef ? lastItemRef : undefined}
              className="w-full bg-white rounded-[20px] shadow-md p-4 flex flex-col cursor-pointer"
              onClick={() => {
                console.log("🔍 onClick 이벤트 (케이스 1):");
                console.log("  - mappedDiary:", mappedDiary);
                console.log("  - mappedDiary.diaryId:", mappedDiary.diaryId);
                console.log("  - mappedDiary.id:", (mappedDiary as any).id);
                console.log("  - mappedDiary의 모든 키:", Object.keys(mappedDiary));
                console.log("  - mappedDiary의 모든 값:", Object.values(mappedDiary));

                // diaryId가 없으면 id를 시도
                const idToUse = mappedDiary.diaryId || (mappedDiary as any).id;
                console.log("  - 사용할 ID:", idToUse);
                handleCardClick(idToUse);
              }}
            >
              <div className="flex gap-2 items-center rounded-lg bg-gradient-to-b from-[#f5f6fa] to-[#e0e3ef] mb-4 p-4">
                <div className="w-[70px] h-[70px] flex-shrink-0 flex items-center justify-center rounded-full overflow-hidden">
                  <VirtualizedBlobCard
                    key={mappedDiary.diaryId}
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
                          .join(
                            ", "
                          )}${mappedDiary.emotions.length > 2 ? ` 외 ${mappedDiary.emotions.length - 2}가지 감정` : ""}`
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
              key={mappedDiary.diaryId}
              ref={isLast && lastItemRef ? lastItemRef : undefined}
              className="w-full bg-white rounded-[20px] shadow-md p-4 flex flex-col cursor-pointer "
              onClick={() => handleCardClick(mappedDiary.diaryId)}
            >
              <div className="grid grid-cols-2 gap-2 rounded-lg mb-4 h-[170px] ">
                <div className="col-span-1 h-full max-h-[170px]">
                  {renderBlobSection(mappedDiary, index)}
                </div>
                <div className="col-span-1 h-full flex items-center">
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
              key={mappedDiary.diaryId}
              ref={isLast && lastItemRef ? lastItemRef : undefined}
              className="w-full bg-white rounded-[20px] shadow-md p-4 flex flex-col cursor-pointer"
              onClick={() => handleCardClick(mappedDiary.diaryId)}
            >
              <div className="flex gap-2 rounded-lg mb-4 h-[170px]">
                <div className="w-1/2 h-full">{renderBlobSection(mappedDiary, index)}</div>
                <div className="col-span-1 h-full w-full flex items-center">
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
              key={mappedDiary.diaryId}
              ref={isLast && lastItemRef ? lastItemRef : undefined}
              className="w-full bg-white rounded-[20px] shadow-md p-4 flex flex-col cursor-pointer"
              onClick={() => handleCardClick(mappedDiary.diaryId)}
            >
              <div className="flex gap-2 rounded-lg mb-4 h-[170px]">
                <div className="w-1/2 h-full">{renderBlobSection(mappedDiary, index)}</div>
                <div className="grid grid-rows-2 gap-2 w-full">
                  <div className=" h-full">
                    <img
                      src={filteredImages[0]}
                      alt="diary-photo-0"
                      className="rounded-lg object-cover w-full h-full"
                    />
                  </div>
                  <div className="h-full">{renderMapSection(mappedDiary)}</div>
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
              key={mappedDiary.diaryId}
              ref={isLast && lastItemRef ? lastItemRef : undefined}
              className="w-full bg-white rounded-[20px] shadow-md p-4 flex flex-col cursor-pointer"
              onClick={() => handleCardClick(mappedDiary.diaryId)}
            >
              <div className="flex gap-2 rounded-lg mb-4 h-[170px]">
                <div className="w-1/2 h-full">{renderBlobSection(mappedDiary, index)}</div>
                <div className="grid grid-rows-2 gap-2 h-full w-full">
                  <div className="h-full">
                    <img
                      src={filteredImages[0]}
                      alt="diary-photo-0"
                      className="rounded-lg object-cover w-full h-full"
                    />
                  </div>
                  <div className="h-full">
                    <img
                      src={filteredImages[1]}
                      alt="diary-photo-1"
                      className="rounded-lg object-cover w-full h-full"
                    />
                  </div>
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
              key={mappedDiary.diaryId}
              ref={isLast && lastItemRef ? lastItemRef : undefined}
              className="w-full bg-white rounded-[20px] shadow-md p-4 flex flex-col cursor-pointer"
              onClick={() => handleCardClick(mappedDiary.diaryId)}
            >
              <div className="flex gap-2 rounded-lg mb-4 h-[170px]">
                <div className="w-1/2 h-full">{renderBlobSection(mappedDiary, index)}</div>
                <div className="col-span-1 grid grid-rows-2 gap-2 h-full">
                  <div className="row-span-1 h-full">{renderMapSection(mappedDiary)}</div>
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <img
                      src={filteredImages[0]}
                      alt="diary-photo-0"
                      className="aspect-square rounded-lg object-cover h-full"
                    />
                    <img
                      src={filteredImages[1]}
                      alt="diary-photo-1"
                      className="aspect-square rounded-lg object-cover h-full"
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
              key={mappedDiary.diaryId}
              ref={isLast && lastItemRef ? lastItemRef : undefined}
              className="w-full bg-white rounded-[20px] shadow-md p-4 flex flex-col cursor-pointer"
              onClick={() => handleCardClick(mappedDiary.diaryId)}
            >
              <div className="flex gap-2 rounded-lg mb-4 h-[170px]">
                <div className="w-1/2 h-full">{renderBlobSection(mappedDiary, index)}</div>
                <div className="col-span-1 grid grid-rows-2 gap-2 h-full">
                  <div className="row-span-1">
                    <img
                      src={filteredImages[0]}
                      alt="diary-photo-0"
                      className="rounded-lg object-cover w-full h-full"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 h-full">
                    <img
                      src={filteredImages[1]}
                      alt="diary-photo-1"
                      className="aspect-square rounded-lg object-cover w-full h-full"
                    />
                    <img
                      src={filteredImages[2]}
                      alt="diary-photo-2"
                      className="aspect-square rounded-lg object-cover w-full h-full"
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
              key={mappedDiary.diaryId}
              ref={isLast && lastItemRef ? lastItemRef : undefined}
              className="w-full bg-white rounded-[20px] shadow-md p-4 flex flex-col cursor-pointer"
              onClick={() => handleCardClick(mappedDiary.diaryId)}
            >
              <div className="flex gap-2 rounded-lg mb-4 h-[170px]">
                <div className="w-1/2 h-full">{renderBlobSection(mappedDiary, index)}</div>
                <div className="w-1/2 grid grid-cols-2 grid-rows-2 gap-2 h-full">
                  <img
                    src={filteredImages[0]}
                    alt="diary-photo-0"
                    className="aspect-square w-full rounded-lg object-cover h-full"
                  />
                  <img
                    src={filteredImages[1]}
                    alt="diary-photo-1"
                    className="aspect-square w-full rounded-lg object-cover h-full"
                  />
                  <img
                    src={filteredImages[2]}
                    alt="diary-photo-2"
                    className="aspect-square w-full rounded-lg object-cover h-full"
                  />
                  <div className="aspect-square w-full h-full">{renderMapSection(mappedDiary)}</div>
                </div>
              </div>
              {renderFooter(mappedDiary)}
            </div>
          );
        }

        // 케이스 9: Blob + 사진4 (사진 4개, 지도 없음)
        if (!hasMap && imageCount >= 4) {
          return (
            <div
              key={mappedDiary.diaryId}
              ref={isLast && lastItemRef ? lastItemRef : undefined}
              className="w-full bg-white rounded-[20px] shadow-md p-4 flex flex-col cursor-pointer"
              onClick={() => handleCardClick(mappedDiary.diaryId)}
            >
              <div className="flex gap-2 rounded-lg mb-4 h-[170px]">
                <div className="w-1/2 h-full">{renderBlobSection(mappedDiary, index)}</div>
                <div className="w-1/2 grid grid-cols-2 grid-rows-2 gap-2 w-full">
                  <img
                    src={filteredImages[0]}
                    alt="diary-photo-0"
                    className="aspect-square w-full rounded-lg object-cover h-full"
                  />
                  <img
                    src={filteredImages[1]}
                    alt="diary-photo-1"
                    className="aspect-square w-full rounded-lg object-cover h-full"
                  />
                  <img
                    src={filteredImages[2]}
                    alt="diary-photo-2"
                    className="aspect-square w-full rounded-lg object-cover h-full"
                  />
                  <div className="relative aspect-square w-full h-full">
                    <img
                      src={filteredImages[3]}
                      alt="diary-photo-3"
                      className="aspect-square w-full rounded-lg object-cover filter blur-sm"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg font-bold ">+{imageCount - 3}</span>
                    </div>
                  </div>
                </div>
              </div>
              {renderFooter(mappedDiary)}
            </div>
          );
        }

        // 케이스 10: Blob + 사진4 + 지도 (사진 4개, 지도 있음) - 마지막 2개 사진은 블러 처리 + +2 표시
        if (hasMap && imageCount >= 4) {
          return (
            <div
              key={mappedDiary.diaryId}
              ref={isLast && lastItemRef ? lastItemRef : undefined}
              className="w-full bg-white rounded-[20px] shadow-md p-4 flex flex-col cursor-pointer "
              onClick={() => handleCardClick(mappedDiary.diaryId)}
            >
              <div className="flex gap-2 rounded-lg mb-4 h-[170px]">
                <div className="w-1/2 h-full">{renderBlobSection(mappedDiary, index)}</div>
                <div className="w-1/2 grid grid-cols-2 grid-rows-2 gap-2 w-full">
                  <img
                    src={filteredImages[0]}
                    alt="diary-photo-0"
                    className="aspect-square w-full rounded-lg object-cover h-full"
                  />
                  <img
                    src={filteredImages[1]}
                    alt="diary-photo-1"
                    className="aspect-square w-full rounded-lg object-cover h-full"
                  />
                  <div className="aspect-square w-full h-full">{renderMapSection(mappedDiary)}</div>
                  <div className="relative aspect-square w-full h-full">
                    <img
                      src={filteredImages[2]}
                      alt="diary-photo-2"
                      className="aspect-square w-full rounded-lg object-cover filter blur-sm h-full"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg font-bold">+{imageCount - 2}</span>
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
            key={mappedDiary.diaryId}
            ref={isLast && lastItemRef ? lastItemRef : undefined}
            className="w-full bg-white rounded-[20px] shadow-md p-4 flex flex-col cursor-pointer"
            onClick={() => handleCardClick(mappedDiary.diaryId)}
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
