import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogOverlay,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import BookmarkIcon from "../../assets/img/bookmark.svg";
import React from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { usePatchDiaryBookmark } from "../../api/queries/home/usePatchDiaryBookmark";

interface DiaryActionModalProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  onDelete: () => void;
  onToggleBookmark?: () => void;
  trigger: React.ReactNode;
  titleHidden?: boolean;
  diaryId: number;
  isBookmarked: boolean;
}

const DiaryActionModal: React.FC<DiaryActionModalProps> = ({
  open,
  setOpen,
  onDelete,
  onToggleBookmark,
  trigger,
  titleHidden = false,
  diaryId,
  isBookmarked,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogOverlay className="!bg-transparent" />
      <DialogContent
        className="max-w-[320px] w-full rounded-2xl bg-[#FAF6F4] border border-[#D6D3F0] shadow-lg px-6 pt-12 pb-6"
        tabIndex={0}
      >
        {titleHidden ? (
          <VisuallyHidden>
            <DialogTitle>일기 관리</DialogTitle>
          </VisuallyHidden>
        ) : (
          <DialogTitle className="text-base font-semibold text-gray-900 mb-3">
            일기 관리
          </DialogTitle>
        )}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => {
              if (onToggleBookmark) onToggleBookmark();
              setOpen(false);
            }}
            tabIndex={-1}
            className="flex items-center justify-center gap-2 rounded-xl bg-white border border-[#E5E5EA] text-gray-900 w-full h-11 text-sm font-medium transition-colors focus:outline-none focus:ring-0 focus:border-[#E5E5EA] focus-visible:outline-none focus-visible:border-[#E5E5EA] hover:bg-white hover:border-[#E5E5EA] hover:text-gray-900 active:bg-white active:border-[#E5E5EA] active:text-gray-900 shadow-none"
          >
            <img
              src={BookmarkIcon}
              alt="북마크"
              className="w-4 h-4 block align-middle shrink-0 outline-none border-none"
              tabIndex={-1}
              draggable={false}
            />
            {isBookmarked ? "북마크 해제하기" : "북마크 추가하기"}
          </button>
          <button
            type="button"
            onClick={onDelete}
            tabIndex={-1}
            className="flex items-center justify-center gap-2 rounded-xl bg-white border border-[#E5E5EA] text-gray-900 w-full h-11 text-sm font-medium transition-colors focus:outline-none focus:ring-0 focus:border-[#E5E5EA] focus-visible:outline-none focus-visible:border-[#E5E5EA] hover:bg-white hover:border-[#E5E5EA] hover:text-gray-900 active:bg-white active:border-[#E5E5EA] active:text-gray-900 shadow-none"
          >
            <Trash2
              className="w-4 h-4 block align-middle shrink-0 outline-none border-none"
              tabIndex={-1}
            />
            일기 삭제하기
          </button>
        </div>
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
};

export default DiaryActionModal;
