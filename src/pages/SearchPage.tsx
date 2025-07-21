import React, { useState } from "react";
import { useSearchDiaries } from "../api/queries/home/useSearchDiaries";
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
          <div className="space-y-4 mt-4">
            {/* 스켈레톤 카드들 */}
            {[1, 2, 3].map(index => (
              <div key={index} className="w-full bg-white rounded-lg shadow-md p-3 animate-pulse">
                <div className="grid grid-cols-3 gap-2 rounded-lg mb-2" style={{ height: "120px" }}>
                  {/* Blob 스켈레톤 */}
                  <div className="col-span-1 h-full">
                    <div className="h-full w-full rounded-lg bg-gray-200 flex flex-col items-center justify-center py-2">
                      <div className="w-16 h-16 rounded-full bg-gray-300 mb-2"></div>
                      <div className="w-12 h-3 bg-gray-300 rounded mb-1"></div>
                      <div className="w-16 h-3 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                  {/* 사진 스켈레톤 */}
                  <div className="col-span-2 grid grid-cols-2 gap-1 h-full">
                    <div className="bg-gray-200 rounded-lg"></div>
                    <div className="bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
                {/* 텍스트 스켈레톤 */}
                <div className="space-y-2 mb-3">
                  <div className="w-full h-4 bg-gray-200 rounded"></div>
                  <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                  <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
                </div>
                {/* 하단 스켈레톤 */}
                <div className="flex items-center justify-between">
                  <div className="w-20 h-3 bg-gray-200 rounded"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <DiaryCards diaries={diaries} onDeleteDiary={handleDeleteDiary} />
        ))}
    </div>
  );
};

export default SearchPage;
