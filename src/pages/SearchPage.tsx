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
  const bookmarkDiaries = bookmarkData?.pages?.flatMap(page => page.item?.diaries ?? []) ?? [];

  const {
    data: photoData,
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
      : Array.isArray(data)
        ? data // API 응답이 직접 배열인 경우
        : data?.diaries || []; // API 응답이 { diaries: [...] } 형태인 경우

  // API 응답을 DiaryCards에서 사용하는 형식으로 변환
  const transformedDiaries = currentDiaries.map((diary: any) => {
    console.log("🔍 변환 전 diary:", diary);
    console.log("🔍 diary.id 값:", diary.id);
    console.log("🔍 diary.id 타입:", typeof diary.id);

    const transformed = {
      diaryId: diary.diaryId || diary.id,
      emotions: diary.emotions || diary.emotion || [], // 배열 형태
      targets: diary.targets || [], // 배열 형태
      activities: diary.activities || [], // 배열 형태
      photoPath: diary.photoPath || diary.photoUrl || [], // 배열 형태
      latitude: diary.latitude,
      longitude: diary.longitude,
      content: diary.content,
      writtenDate: diary.writtenDate || diary.date,
      title: diary.title,
      relate_sentence: diary.relate_sentence,
      search_sentence: diary.search_sentence,
      isBookmarked: diary.isBookmarked || diary.bookmarked,
    };

    console.log("🔍 변환 후 diary:", transformed);
    console.log("🔍 변환 후 diaryId:", transformed.diaryId);
    console.log("🔍 변환 후 emotions:", transformed.emotions);
    console.log("🔍 변환 후 targets:", transformed.targets);
    console.log("🔍 변환 후 activities:", transformed.activities);
    console.log("🔍 변환 후 photoPath:", transformed.photoPath);
    return transformed;
  });

  console.log("🔍 SearchPage currentDiaries 디버깅:");
  console.log("  - selectedCategory:", selectedCategory);
  console.log("  - data:", data);
  console.log("  - currentDiaries:", currentDiaries);
  console.log("  - transformedDiaries:", transformedDiaries);
  console.log("  - transformedDiaries[0]:", transformedDiaries[0]);
  console.log("  - transformedDiaries[0]?.diaryId:", transformedDiaries[0]?.diaryId);
  if (currentDiaries[0]) {
    console.log("  - currentDiaries[0]의 모든 키:", Object.keys(currentDiaries[0]));
    console.log("  - currentDiaries[0]의 모든 값:", Object.values(currentDiaries[0]));
  }

  // 디버깅 로그 추가
  console.log("🔍 SearchPage 데이터 흐름 디버깅:");
  console.log("  - selectedCategory:", selectedCategory);
  console.log("  - searchQuery:", searchQuery);
  console.log("  - inputValue:", inputValue);
  console.log("  - API 응답 data:", data);
  console.log("  - data 타입:", typeof data);
  console.log("  - Array.isArray(data):", Array.isArray(data));
  console.log("  - isLoading:", isLoading);
  console.log("  - searchQuery 존재 여부:", !!searchQuery);

  // API 응답 구조 분석
  if (data) {
    console.log("📊 API 응답 구조 분석:");
    console.log("  - data 전체:", data);
    console.log("  - data 키들:", Object.keys(data));

    if (Array.isArray(data)) {
      console.log("  - 배열 길이:", data.length);
      data.forEach((item, index) => {
        console.log(`  - 배열[${index}]:`, item);
        console.log(`  - 배열[${index}] 키들:`, Object.keys(item || {}));
        if (item?.diaries) {
          console.log(`  - 배열[${index}] diaries 개수:`, item.diaries.length);
        }
      });
    } else if (data.diaries) {
      console.log("  - diaries 개수:", data.diaries.length);
      console.log("  - 첫 번째 diary:", data.diaries[0]);
    }
  }

  console.log("  - currentDiaries:", currentDiaries);
  console.log("  - currentDiaries 길이:", currentDiaries.length);
  console.log("  - transformedDiaries:", transformedDiaries);
  console.log("  - transformedDiaries 길이:", transformedDiaries.length);

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
      setInputValue("북마크된 일기 보여줘");
      setSearchQuery(""); // 검색 쿼리 초기화
      // 북마크 쿼리 무효화하여 새로 로드
      queryClient.invalidateQueries({ queryKey: ["bookmarkDiaries"] });
    } else if (category === "date") {
      console.log("📅 날짜 카테고리 선택됨");
      setInputValue(""); // 날짜 카테고리 선택 시 검색바 비움
      setSearchQuery(""); // 검색 쿼리 초기화
    } else if (category === "photo") {
      setInputValue("사진 모아보기"); // 날짜 카테고리 선택 시 검색바 비움
      setSearchQuery(""); // 검색 쿼리 초기화
    } else {
      setInputValue(""); // 다른 카테고리 선택 시 검색바 초기화
      setSearchQuery("");
    }
  };

  const handleDateSelect = (date: string) => {
    console.log("📅 SearchPage handleDateSelect 호출됨:", date);
    // 날짜를 YYYY-MM-DD 형식으로 변환 (API용)
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    // 검색바에 표시할 한국어 형식 (앞의 0 제거)
    const displayMonth = String(parseInt(month));
    const displayDay = String(parseInt(day));
    const displayDate = `${year}년 ${displayMonth}월 ${displayDay}일 일기`;

    console.log("📅 변환된 날짜:", formattedDate);
    console.log("📅 표시용 날짜:", displayDate);

    // 검색바에는 한국어 형식으로 표시, API에는 YYYY-MM-DD 형식으로 전송
    setInputValue(displayDate);
    setSearchQuery(formattedDate);
    setSelectedCategory("date"); // 날짜 카테고리로 설정
    console.log("📅 검색바 값 설정 및 검색 실행:", formattedDate);
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
          <div className="mt-4 text-center text-gray-500">장소별 일기 기능은 준비 중입니다.</div>
        );

      case "date":
        // 날짜 카테고리의 경우 일반 검색과 동일하게 처리
        return (
          searchQuery &&
          (isLoading ? (
            <div className="mt-4">
              <DiaryCardsSkeleton />
            </div>
          ) : (
            <DiaryCards diaries={transformedDiaries} onDeleteDiary={handleDeleteDiary} />
          ))
        );

      default:
        // 일반 검색 또는 카테고리가 없는 경우
        console.log("🔍 default 케이스 실행:");
        console.log("  - searchQuery:", searchQuery);
        console.log("  - isLoading:", isLoading);
        console.log("  - currentDiaries:", currentDiaries);
        console.log("  - currentDiaries 길이:", currentDiaries.length);
        return (
          searchQuery &&
          (isLoading ? (
            <div className="mt-4">
              <DiaryCardsSkeleton />
            </div>
          ) : (
            <DiaryCards diaries={transformedDiaries} onDeleteDiary={handleDeleteDiary} />
          ))
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
