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

export const patchDiaryBookmark = async (diaryId: number, isBookmarked: boolean) => {
  const response = await api.patch(`/diary/bookmark/${diaryId}`, {
    id: diaryId,
    isBookmarked,
  });
  return response.data;
};

export const getInfiniteDiaries = async (cursor: number = 0, limit: number = 10) => {
  const response = await api.get("/diary/home", {
    params: { cursor, limit },
  });
  return response.data;
};

export const searchDiaries = async (q: string) => {
  console.log("[searchDiaries] 검색 쿼리 파라미터 date:", q);
  const response = await api.get("/diary/date", {
    params: { date: q },
  });
  console.log("[searchDiaries] 응답 데이터:", response.data);
  return response.data; // { diaries: [...], totalCount: N }
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
