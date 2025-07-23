import React, { useState } from "react";
import { useSearchDiaries } from "../api/queries/home/useSearchDiaries";
import { useGetBookmarkDiaries } from "../api/queries/home/useGetBookmarkDiaries";

import DiaryCards from "../components/home/DiaryCards";
import DiaryCardsSkeleton from "../components/home/DiaryCardsSkeleton";
import SearchBar from "../components/home/SearchBar";
import SearchCategories from "../components/home/SearchCategories";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteDiary } from "../api/queries/home/useDeleteDiary";
import { useInfinitePhotos } from "@/api/queries/home/useInfinitePhotos";
import PhotoMosaic from "@/components/home/PhotoMosaic";

function mapApiDiaryToDiaryCard(apiDiary: {
  diaryId: number;
  emotions?: Array<{ emotion: string; intensity: number }>;
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
    emotion: apiDiary.emotions?.[0]?.emotion || "", // emotionType → emotion
    emotions: apiDiary.emotions?.map(e => ({ emotion: e.emotion, intensity: e.intensity })) || [],
    targets: apiDiary.targets || [],
    activities: apiDiary.activities || [],
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
    bookmarked: apiDiary.isBookmarked || false,
  };
}

const SearchPage = () => {
  const [inputValue, setInputValue] = useState(""); // 입력창 값
  const [searchQuery, setSearchQuery] = useState(""); // 실제 검색 요청에 쓸 값
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  const queryClient = useQueryClient();
  const deleteDiaryMutation = useDeleteDiary();

  // 북마크 데이터를 평면화
  const bookmarkDiaries =
    bookmarkData?.pages?.flatMap(page => page.item?.diaries?.map(mapApiDiaryToDiaryCard) ?? []) ??
    [];

    const {
      data: photoData,
      isLoading: photoLoading,
      fetchNextPage: fetchNextPhotoPage,
      hasNextPage: hasNextPhotoPage,
      isFetchingNextPage: isFetchingNextPhotoPage,
    } = useInfinitePhotos();
  
    // 사진 데이터를 평면화
    const allPhotos = photoData?.pages?.flatMap(page => page.photos) ?? [];

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
          } else if (selectedCategory === "date") {
            queryClient.invalidateQueries({ queryKey: ["diaryByDate"] });
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
      setInputValue("북마크된 일기 보여줘 임구철");
      setSearchQuery(""); // 검색 쿼리 초기화
      // 북마크 쿼리 무효화하여 새로 로드
      queryClient.invalidateQueries({ queryKey: ["bookmarkDiaries"] });
    } else if (category === "date") {
      console.log("📅 날짜 카테고리 선택됨");
      setInputValue(""); // 날짜 카테고리 선택 시 검색바 비움
      setSearchQuery(""); // 검색 쿼리 초기화
    }else if (category === "photo") {
      setInputValue("사진 모아보기"); // 날짜 카테고리 선택 시 검색바 비움
      setSearchQuery(""); // 검색 쿼리 초기화
    } else {
      setInputValue(""); // 다른 카테고리 선택 시 검색바 초기화
      setSearchQuery("");
    }
  };

  const handleDateSelect = (date: string) => {
    console.log("📅 SearchPage handleDateSelect 호출됨:", date);
    // 날짜를 한국어 형식으로 변환
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const koreanDate = `${year}년 ${month}월 ${day}일`;
    console.log("📅 변환된 날짜:", koreanDate);

    // 검색바에 날짜 입력하고 검색 실행
    const searchText = `${koreanDate} 일기`;
    console.log("📅 setInputValue 호출 전:", searchText);
    setInputValue(searchText);
    setSearchQuery(searchText);
    console.log("📅 검색바 값 설정 및 검색 실행:", searchText);
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

  const renderSearchResults = () => {
    if (!searchQuery && !selectedCategory) {
      return null;
    }
  
    switch (selectedCategory) {
      case "bookmark":
        return bookmarkLoading ? (
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
        );
  
      case "photo":
        return (
          <PhotoMosaic
            photos={allPhotos}
            onLoadMore={fetchNextPhotoPage}
            hasNextPage={hasNextPhotoPage}
            isFetchingNextPage={isFetchingNextPhotoPage}
          />
        );
  
      case "place":
        // 장소 카테고리 처리 (향후 구현)
        return (
          <div className="mt-4 text-center text-gray-500">
            장소별 일기 기능은 준비 중입니다.
          </div>
        );
  
      case "date":
        // 날짜 카테고리의 경우 일반 검색과 동일하게 처리
        return searchQuery && (
          isLoading ? (
            <div className="mt-4">
              <DiaryCardsSkeleton />
            </div>
          ) : (
            <DiaryCards diaries={currentDiaries} onDeleteDiary={handleDeleteDiary} />
          )
        );
  
      default:
        // 일반 검색 또는 카테고리가 없는 경우
        return searchQuery && (
          isLoading ? (
            <div className="mt-4">
              <DiaryCardsSkeleton />
            </div>
          ) : (
            <DiaryCards diaries={currentDiaries} onDeleteDiary={handleDeleteDiary} />
          )
        );
    }
  };
  

  return (
    <div className="max-w-xl mx-auto text-foreground h-screen flex flex-col">
      <div className="flex-shrink-0">
        <SearchBar
          value={inputValue}
          onChange={setInputValue}
          onSearch={() => {
            setSearchQuery(inputValue);
            setSelectedCategory(null);
          }}
        />
      </div>

      {!searchQuery && !selectedCategory && (
        <div className="flex-shrink-0">
          <SearchCategories
            onCategorySelect={handleCategorySelect}
            selectedCategory={selectedCategory}
            onDateSelect={handleDateSelect}
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4" onScroll={handleScroll}>
        {renderSearchResults()}
      </div>
    </div>
  );
};

export default SearchPage;
