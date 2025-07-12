import React from "react";
import { Canvas } from "@react-three/fiber";
import Blob from "../home/Blob/Blob";
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
const DiaryCards = () => {
  return (
    <div className="w-full max-w-[380px] bg-white rounded-2xl shadow-md p-3 flex flex-col mx-auto">
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
        학습할 수 있을지에 대해 걱정이 앞서는데 '어떻게든 되겠지 해내겠지 뭐'라고 생각하는 중이다.
        그리고 지금 자정이 넘었는데 배가 ...
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
  );
};

export default DiaryCards;
