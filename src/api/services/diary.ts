import api from "../axios";

export const postDiary = async (formData: FormData) => {
  const BASE_URL = import.meta.env.VITE_SOCIAL_AUTH_URL;

  const token = localStorage.getItem("accessToken");
  for (const pair of formData.entries()) {
  }

  const response = await api.post("/diary", formData);
  return response.data;
};

export const patchDiaryBookmark = async (diaryId: number) => {

  const response = await api.patch(`/diary/bookmark/${diaryId}`);
  return response.data;
};

export const getInfiniteDiaries = async (cursor: number = 0, limit: number = 10) => {
  const response = await api.get("/diary/home", {
    params: { cursor, limit },
  });
  return response.data;
};

export const searchDiaries = async (q: string) => {

  // 날짜 형식인지 확인 (YYYY-MM-DD 또는 YYYY년 MM월 DD일)
  const isDateQuery = /^\d{4}-\d{2}-\d{2}$/.test(q) || /^\d{4}년 \d{1,2}월 \d{1,2}일/.test(q);

  if (isDateQuery) {
    // 날짜 검색인 경우

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


    if (response.data?.diaries) {
    }

    return response.data;
  } else {
    // 일반 검색인 경우

    const response = await api.get("/diary/search", {
      params: { q: q },
    });


    if (response.data?.diaries) {
    }

    return response.data;
  }
};

// 북마크된 일기들 가져오기
export const getBookmarkDiaries = async (page: number = 0) => {
  const response = await api.get(`/diary/bookmark?page=${page}`);
  return response.data;
};

// 특정 날짜의 일기 가져오기
export const getDiaryByDate = async (date: string) => {
  const response = await api.get(`/diary/date/${date}`);
  return response.data;
};

export const getWrittenDays = async (year: number, month: number) => {
  const response = await api.get(`/diary/writtenDays?year=${year}&month=${month}`);
  return response.data;
};

export const getInfinitephotos = async (cursor: number = 0, limit: number = 10) => {
  const response = await api.get("/diary/photos", {
    params: { cursor, limit },
  });
  return response.data;
};
