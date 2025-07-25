import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogOverlay,
  DialogTitle,
} from "../ui/dialog";
import { Trash2 } from "lucide-react";
import BookmarkIcon from "../../assets/img/Bookmark.svg";
import React from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { usePatchDiaryBookmark } from "../../api/queries/home/usePatchDiaryBookmark";

interface DiaryActionModalProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  onDelete: () => void;
  trigger: React.ReactNode;
  titleHidden?: boolean;
  diaryId: number;
  isBookmarked: boolean;
}

const DiaryActionModal: React.FC<DiaryActionModalProps> = ({
  open,
  setOpen,
  onDelete,
  trigger,
  titleHidden = false,
  diaryId,
  isBookmarked,
}) => {
  const { mutate: patchBookmark } = usePatchDiaryBookmark();

  const handleToggleBookmark = () => {
    patchBookmark(
      { diaryId },
      {
        onSuccess: () => {
          setOpen(false);
        },
        onError: error => {
          console.error("북마크 토글 실패:", error);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogOverlay className="!bg-transparent" />
      <DialogContent
        className="max-w-[320px] w-full rounded-2xl bg-[#FAF6F4] dark:bg-[#4A3551] border border-[#D6D3F0] dark:border-[#6B4F6B] shadow-lg px-6 pt-12 pb-6"
        tabIndex={0}
      >
        {titleHidden ? (
          <VisuallyHidden>
            <DialogTitle>일기 관리</DialogTitle>
          </VisuallyHidden>
        ) : (
          <DialogTitle className="text-base font-semibold text-gray-900 dark:text-white mb-3">
            일기 관리
          </DialogTitle>
        )}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleToggleBookmark}
            tabIndex={-1}
            className="flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-[#6B4F6B] border border-[#E5E5EA] dark:border-[#8B6B8B] text-gray-900 dark:text-white w-full h-11 text-sm font-medium transition-colors focus:outline-none focus:ring-0 focus:border-[#E5E5EA] dark:focus:border-[#8B6B8B] focus-visible:outline-none focus-visible:border-[#E5E5EA] dark:focus-visible:border-[#8B6B8B] hover:bg-white dark:hover:bg-[#7B5F7B] hover:border-[#E5E5EA] dark:hover:border-[#9B7B9B] hover:text-gray-900 dark:hover:text-white active:bg-white dark:active:bg-[#6B4F6B] active:border-[#E5E5EA] dark:active:border-[#8B6B8B] active:text-gray-900 dark:active:text-white shadow-none"
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
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            tabIndex={-1}
            className="flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-[#6B4F6B] border border-[#E5E5EA] dark:border-[#8B6B8B] text-gray-900 dark:text-white w-full h-11 text-sm font-medium transition-colors focus:outline-none focus:ring-0 focus:border-[#E5E5EA] dark:focus:border-[#8B6B8B] focus-visible:outline-none focus-visible:border-[#E5E5EA] dark:focus-visible:border-[#8B6B8B] hover:bg-white dark:hover:bg-[#7B5F7B] hover:border-[#E5E5EA] dark:hover:border-[#9B7B9B] hover:text-gray-900 dark:hover:text-white active:bg-white dark:active:bg-[#6B4F6B] active:border-[#E5E5EA] dark:active:border-[#8B6B8B] active:text-gray-900 dark:active:text-white shadow-none"
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
