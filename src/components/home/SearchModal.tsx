import React from "react";
import { Search } from "lucide-react"; // Lucide 아이콘 사용 (or 원하는 아이콘으로 교체)

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ open, onClose }) => {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50"
      style={{ pointerEvents: open ? "auto" : "none" }}
    >
      {/* 반투명 배경 */}
      <div
        className="fixed inset-0 bg-black/30"
        style={{
          opacity: open ? 1 : 0,
          transition: "opacity 0.2s",
          pointerEvents: open ? "auto" : "none",
        }}
        onClick={onClose}
      />
      {/* 슬라이드 시트 */}
      <div
        className="relative w-full max-w-md mx-auto bg-white rounded-b-2xl shadow-xl p-8"
        style={{
          position: "relative",
          top: 0,
          left: 0,
          right: 0,
          transform: open ? "translateY(0)" : "translateY(-120%)",
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          zIndex: 60,
          marginTop: 0,
        }}
      >
        {/* 닫기 버튼 */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
          onClick={onClose}
          aria-label="닫기"
        >
          ✕
        </button>

        {/* 안내 문구 */}
        <div className="mb-6 text-center">
          <p className="text-base font-medium text-gray-900">활동과 대상을 조합해서</p>
          <p className="text-base font-medium text-gray-900">마음에 남은 순간을 검색해보세요</p>
          <p className="text-sm text-gray-500 mt-2">예를 들어 이런 식이에요:</p>
          <ul className="mt-2 space-y-1 text-sm text-gray-600">
            <li>・처음으로 민수랑 깊은 대화를 나눴던 밤</li>
            <li>・채린이랑 손잡고 걸었던 한강길</li>
            <li>・팀장이 내 아이디어를 처음 칭찬해줬을 때</li>
          </ul>
        </div>

        {/* 검색창 */}
        <div className="flex items-center bg-gray-100 rounded-xl px-4 py-3">
          <input
            className="w-full bg-transparent outline-none text-base"
            placeholder="예: 채린이랑 고깃집 갔던 날"
          />
          <Search className="w-5 h-5 text-gray-500 ml-3" />
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
