import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch }) => {
  return (
    <div
      className="bg-white rounded-bl-2xl rounded-br-2xl shadow-xl p-4 animate-slide-down-fade w-full mb-4"
      style={{ borderRadius: "0 0 16px 16px" }}
    >
      <div className="mb-6 text-center">
        <p className="text-base font-medium text-gray-900">활동과 대상을 조합해서</p>
        <p className="text-base font-medium text-gray-900">마음에 남은 순간을 검색해보세요</p>
        <ul className="mt-2 space-y-1 text-sm text-gray-400">
          <li>・구철이가 발냄새 났던 날들</li>
          <li>・팀장이 내 아이디어를 처음 칭찬해줬을 때</li>
        </ul>
      </div>
      <div className="flex items-center bg-gray-100 rounded-xl px-4 py-2">
        <input
          className="w-full bg-transparent outline-none text-base dark:text-gray-700"
          placeholder="예: 원겸이가 회의에 빠졌던 날 "
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") onSearch();
          }}
        />
        <button onClick={onSearch} aria-label="검색">
          <Search className="w-5 h-5 text-gray-500 ml-3" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
