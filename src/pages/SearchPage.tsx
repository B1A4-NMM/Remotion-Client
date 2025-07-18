import React, { useState } from "react";
import { useSearchDiaries } from "../api/queries/home/useSearchDiaries";
import { Search } from "lucide-react";
import DiaryCards from "../components/home/DiaryCards";
import SearchBar from "../components/home/SearchBar";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteDiary } from "../api/queries/home/useDeleteDiary";

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
  const [inputValue, setInputValue] = useState(""); // 입력창 값
  const [searchQuery, setSearchQuery] = useState(""); // 실제 검색 요청에 쓸 값
  const [searchActive, setSearchActive] = useState(false);

  const { data, isLoading, refetch } = useSearchDiaries(searchQuery, !!searchQuery);
  const diaries = data?.diaries?.map(mapApiDiaryToDiaryCard) ?? [];

  const queryClient = useQueryClient();
  const deleteDiaryMutation = useDeleteDiary();
  const handleDeleteDiary = (diaryId: number) => {
    deleteDiaryMutation.mutate(
      { diaryId: String(diaryId) },
      {
        onSuccess: () => {
          // 검색 결과를 다시 불러오거나, 쿼리 무효화
          refetch();
        },
      }
    );
  };

  return (
    <div className="max-w-xl mx-auto px-4   text-foreground min-h-screen">
      {/* 검색 바 */}
      <SearchBar
        value={inputValue}
        onChange={setInputValue}
        onSearch={() => setSearchQuery(inputValue)} // 버튼 클릭 시에만 쿼리 업데이트
      />
      {/* 검색 결과 */}
      {searchQuery &&
        (isLoading ? (
          <div>검색 중...</div>
        ) : (
          <DiaryCards diaries={diaries} onDeleteDiary={handleDeleteDiary} />
        ))}
    </div>
  );
};

export default SearchPage;
