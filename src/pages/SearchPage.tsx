import React, { useState } from "react";
import { useSearchDiaries } from "../api/queries/home/useSearchDiaries";
import { useGetBookmarkDiaries } from "../api/queries/home/useGetBookmarkDiaries";
import DiaryCards from "../components/home/DiaryCards";
import DiaryCardsSkeleton from "../components/home/DiaryCardsSkeleton";
import SearchBar from "../components/home/SearchBar";
import SearchCategories from "../components/home/SearchCategories";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteDiary } from "../api/queries/home/useDeleteDiary";

function mapApiDiaryToDiaryCard(apiDiary: {
  diaryId: number;
  emotions?: Array<{ emotionType: string }>;
  targets?: string[];
  activities?: string[];
  photoPath?: string | string[];
  latitude?: number;
  longitude?: number;
  content: string;
  writtenDate: string;
  isBookmarked?: boolean;
}) {
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // 일반 검색 쿼리
  const { data, isLoading, refetch } = useSearchDiaries(searchQuery, !!searchQuery);

  // 북마크 쿼리
  const {
    data: bookmarkData,
    isLoading: bookmarkLoading,
    fetchNextPage: fetchNextBookmarkPage,
    hasNextPage: hasNextBookmarkPage,
    isFetchingNextPage: isFetchingNextBookmarkPage,
  } = useGetBookmarkDiaries(selectedCategory === "bookmark" ? 0 : undefined);

  console.log("🔍 북마크 쿼리 상태:");
  console.log("  - selectedCategory:", selectedCategory);
  console.log("  - bookmarkLoading:", bookmarkLoading);
  console.log("  - bookmarkData:", bookmarkData);

  const queryClient = useQueryClient();
  const deleteDiaryMutation = useDeleteDiary();

  // 북마크 데이터를 평면화
  const bookmarkDiaries =
    bookmarkData?.pages?.flatMap(page => page.item?.diaries?.map(mapApiDiaryToDiaryCard) ?? []) ??
    [];

  console.log("📚 북마크 데이터 처리:");
  console.log("  - bookmarkData:", bookmarkData);
  console.log("  - bookmarkDiaries:", bookmarkDiaries);
  console.log("  - bookmarkDiaries 길이:", bookmarkDiaries.length);
  console.log("  - hasNextPage:", hasNextBookmarkPage);

  // 현재 표시할 데이터 결정
  const currentDiaries =
    selectedCategory === "bookmark"
      ? bookmarkDiaries
      : (data?.diaries?.map(mapApiDiaryToDiaryCard) ?? []);

  const handleDeleteDiary = (diaryId: number) => {
    deleteDiaryMutation.mutate(
      { diaryId: String(diaryId) },
      {
        onSuccess: () => {
          // 검색 결과를 다시 불러오거나, 쿼리 무효화
          if (selectedCategory === "bookmark") {
            queryClient.invalidateQueries({ queryKey: ["bookmarkDiaries"] });
          } else {
            refetch();
          }
        },
      }
    );
  };

  const handleCategorySelect = (category: "photo" | "place" | "bookmark" | "date") => {
    console.log("🔍 카테고리 선택됨:", category);
    setSelectedCategory(category);

    // 북마크 카테고리 선택 시 검색바에 툴팁 표시
    if (category === "bookmark") {
      console.log("📚 북마크 카테고리 선택됨");
      setInputValue("북마크된 일기 보여줘");
      setSearchQuery(""); // 검색 쿼리 초기화
      // 북마크 쿼리 무효화하여 새로 로드
      queryClient.invalidateQueries({ queryKey: ["bookmarkDiaries"] });
    } else if (category === "date") {
      console.log("📅 날짜 카테고리 선택됨");
      setInputValue("날짜로 검색");
      setSearchQuery(""); // 검색 쿼리 초기화
    } else {
      setInputValue(""); // 다른 카테고리 선택 시 검색바 초기화
      setSearchQuery("");
    }
  };

  const handleDateSelect = (date: string) => {
    console.log("📅 날짜 선택됨:", date);
    setSelectedDate(date);
    setInputValue(`${date} 일기`);
    setSearchQuery(""); // 검색 쿼리 초기화
    setSelectedCategory("date");
  };

  // 무한 스크롤 처리
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    console.log("📜 스크롤 이벤트:", {
      scrollTop,
      scrollHeight,
      clientHeight,
      selectedCategory,
      hasNextBookmarkPage,
      isFetchingNextBookmarkPage,
    });

    if (
      selectedCategory === "bookmark" &&
      scrollHeight - scrollTop <= clientHeight * 1.5 &&
      hasNextBookmarkPage &&
      !isFetchingNextBookmarkPage
    ) {
      console.log("🚀 다음 북마크 페이지 로드");
      fetchNextBookmarkPage();
    }
  };

  return (
    <div className="max-w-xl mx-auto text-foreground h-screen flex flex-col">
      {/* 검색 바 */}
      <div className="flex-shrink-0">
        <SearchBar
          value={inputValue}
          onChange={setInputValue}
          onSearch={() => setSearchQuery(inputValue)}
        />
      </div>

      {/* 카테고리 - 검색 전 초기 상태에서만 표시 */}
      {!searchQuery && !selectedCategory && !selectedDate && (
        <div className="flex-shrink-0">
          <SearchCategories
            onCategorySelect={handleCategorySelect}
            selectedCategory={selectedCategory}
            onDateSelect={handleDateSelect}
          />
        </div>
      )}

      {/* 검색 결과 */}
      <div className="flex-1 overflow-y-auto px-4" onScroll={handleScroll}>
        {selectedCategory === "bookmark" ? (
          // 북마크 뷰
          bookmarkLoading ? (
            <div className="mt-4">
              <DiaryCardsSkeleton />
            </div>
          ) : (
            <div>
              <DiaryCards diaries={bookmarkDiaries} onDeleteDiary={handleDeleteDiary} />
              {/* 북마크 무한 스크롤 로딩 */}
              {isFetchingNextBookmarkPage && (
                <div className="mt-4">
                  <DiaryCardsSkeleton />
                </div>
              )}
            </div>
          )
        ) : (
          // 일반 검색 뷰
          searchQuery &&
          (isLoading ? (
            <div className="mt-4">
              <DiaryCardsSkeleton />
            </div>
          ) : (
            <DiaryCards diaries={currentDiaries} onDeleteDiary={handleDeleteDiary} />
          ))
        )}
      </div>
    </div>
  );
};

export default SearchPage;
