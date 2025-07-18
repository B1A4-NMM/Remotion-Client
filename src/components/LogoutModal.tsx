import React from "react";
import { Dialog, DialogContent, DialogFooter, DialogOverlay, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { AlertTriangle } from "lucide-react";

interface LogoutModalProps {
  open: boolean;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ open, onConfirm }) => {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogOverlay className="!bg-black/50" />
      <DialogContent className="max-w-[320px] w-full rounded-2xl bg-[#FAF6F4] dark:bg-[#4A3551] border border-[#D6D3F0] dark:border-[#6B4F6B] shadow-lg px-6 pt-12 pb-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            세션이 만료되었습니다
          </DialogTitle>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
            보안을 위해 다시 로그인해주세요.
          </p>
          <Button onClick={onConfirm} className="w-full bg-red-600 hover:bg-red-700 text-white">
            로그인 페이지로 이동
          </Button>
        </div>
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
};

export default LogoutModal;
