import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch }) => {
  return (
    <div className="bg-white rounded-b-2xl shadow-xl p-4 mb-4 animate-slide-down-fade">
      <div className="mb-6 text-center">
        <p className="text-base font-medium text-gray-900">활동과 대상을 조합해서</p>
        <p className="text-base font-medium text-gray-900">마음에 남은 순간을 검색해보세요</p>
        <ul className="mt-2 space-y-1 text-sm text-gray-400">
          <li>・처음으로 민수랑 깊은 대화를 나눴던 밤</li>
          <li>・팀장이 내 아이디어를 처음 칭찬해줬을 때</li>
        </ul>
      </div>
      <div className="flex items-center bg-gray-100 rounded-xl px-4 py-2">
        <input
          className="w-full bg-transparent outline-none text-base"
          placeholder="예: 채린이랑 고깃집 갔던 날"
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
