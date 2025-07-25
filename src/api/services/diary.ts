import api from "../axios";

export const postDiary = async (formData: FormData) => {
  const BASE_URL = import.meta.env.VITE_SOCIAL_AUTH_URL;

  const token = localStorage.getItem("accessToken");
  console.log("📦 FormData 전송 중...");
  for (const pair of formData.entries()) {
    console.log(`${pair[0]}:`, pair[1]);
  }

  const response = await api.post("/diary", formData);
  return response.data;
};

export const patchDiaryBookmark = async (diaryId: number) => {
  console.log("🔍 patchDiaryBookmark 호출:");
  console.log("  - diaryId:", diaryId);
  console.log("  - URL:", `/diary/bookmark/${diaryId}`);

  const response = await api.patch(`/diary/bookmark/${diaryId}`);
  console.log("  - 응답:", response.data);
  return response.data;
};

export const getInfiniteDiaries = async (cursor: number = 0, limit: number = 10) => {
  const response = await api.get("/diary/home", {
    params: { cursor, limit },
  });
  return response.data;
};

export const searchDiaries = async (q: string) => {
  console.log("🔍 [searchDiaries] 검색 시작:");
  console.log("  - 검색 쿼리:", q);
  console.log("  - 파라미터 타입:", typeof q);

  // 날짜 형식인지 확인 (YYYY-MM-DD 또는 YYYY년 MM월 DD일)
  const isDateQuery = /^\d{4}-\d{2}-\d{2}$/.test(q) || /^\d{4}년 \d{1,2}월 \d{1,2}일/.test(q);

  if (isDateQuery) {
    // 날짜 검색인 경우
    console.log("📅 [searchDiaries] 날짜 검색으로 인식");
    console.log("  - API 엔드포인트: /diary/date");
    console.log("  - 전송 파라미터: { date:", q, "}");

    const response = await api.get("/diary/date", {
      params: { date: q },
      paramsSerializer: params => {
        const usp = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          usp.append(key, String(value));
        });
        return usp.toString();
      },
    });

    console.log("📥 [searchDiaries] 날짜 검색 API 응답:");
    console.log("  - 응답 상태:", response.status);
    console.log("  - 응답 헤더:", response.headers);
    console.log("  - 응답 데이터:", response.data);
    console.log("  - 응답 데이터 타입:", typeof response.data);
    console.log("  - 응답 데이터 구조:", Object.keys(response.data || {}));

    if (response.data?.diaries) {
      console.log("  - 일기 개수:", response.data.diaries.length);
      console.log("  - 첫 번째 일기:", response.data.diaries[0]);
    }

    return response.data;
  } else {
    // 일반 검색인 경우
    console.log("🔍 [searchDiaries] 일반 검색으로 인식");
    console.log("  - API 엔드포인트: /diary/search");
    console.log("  - 전송 파라미터: { q:", q, "}");

    const response = await api.get("/diary/search", {
      params: { q: q },
    });

    console.log("📥 [searchDiaries] 일반 검색 API 응답:");
    console.log("  - 응답 상태:", response.status);
    console.log("  - 응답 헤더:", response.headers);
    console.log("  - 응답 데이터:", response.data);
    console.log("  - 응답 데이터 타입:", typeof response.data);
    console.log("  - 응답 데이터 구조:", Object.keys(response.data || {}));

    if (response.data?.diaries) {
      console.log("  - 일기 개수:", response.data.diaries.length);
      console.log("  - 첫 번째 일기:", response.data.diaries[0]);
    }

    return response.data;
  }
};

// 북마크된 일기들 가져오기
export const getBookmarkDiaries = async (page: number = 0) => {
  console.log("🌐 getBookmarkDiaries API 호출:", `/diary/bookmark?page=${page}`);
  const response = await api.get(`/diary/bookmark?page=${page}`);
  console.log("📥 북마크 API 응답:", response.data);
  return response.data;
};

// 특정 날짜의 일기 가져오기
export const getDiaryByDate = async (date: string) => {
  console.log("🌐 getDiaryByDate API 호출:", `/diary/date/${date}`);
  const response = await api.get(`/diary/date/${date}`);
  console.log("📥 날짜별 일기 API 응답:", response.data);
  return response.data;
};

export const getWrittenDays = async (year: number, month: number) => {
  console.log("🌐 getWrittenDays API 호출:", `/diary/writtenDays?year=${year}&month=${month}`);
  const response = await api.get(`/diary/writtenDays?year=${year}&month=${month}`);
  console.log("📥 일기 쓴 날짜 API 응답:", response.data);
  return response.data;
};

export const getInfinitephotos = async (cursor: number = 0, limit: number = 10) => {
  const response = await api.get("/diary/photos", {
    params: { cursor, limit },
  });
  return response.data;
};
