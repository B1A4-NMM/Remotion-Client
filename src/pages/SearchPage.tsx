import React, { useState } from "react";
import { useSearchDiaries } from "../api/queries/home/useSearchDiaries";
import { Search } from "lucide-react";
import DiaryCards from "../components/home/DiaryCards";
import SearchBar from "../components/home/SearchBar";

function mapApiDiaryToDiaryCard(apiDiary: any) {
  return {
    id: apiDiary.diaryId,
    emotion: apiDiary.emotions?.[0]?.emotionType || "",
    emotions: apiDiary.emotions || [],
    targets: apiDiary.targets,
    activities: apiDiary.activities,
    photoUrl: Array.isArray(apiDiary.photoPath)
      ? apiDiary.photoPath
      : apiDiary.photoPath
        ? [apiDiary.photoPath]
        : [],
    map:
      apiDiary.latitude && apiDiary.longitude
        ? { lat: apiDiary.latitude, lng: apiDiary.longitude }
        : null,
    content: apiDiary.content,
    date: apiDiary.writtenDate,
    keywords: [],
    behaviors: [],
    bookmarked: apiDiary.isBookmarked,
  };
}

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);

  const { data, isLoading } = useSearchDiaries(searchQuery, searchActive);
  const diaries = data?.diaries?.map(mapApiDiaryToDiaryCard) ?? [];

  return (
    <div className="max-w-xl mx-auto  px-4">
      {/* 검색 바 */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onSearch={() => setSearchActive(true)}
      />
      {/* 검색 결과 */}
      {searchActive && (isLoading ? <div>검색 중...</div> : <DiaryCards diaries={diaries} />)}
    </div>
  );
};

export default SearchPage;
