import api from "../axios";

/**
 * 특정 일기 ID 기준으로 감정 데이터 조회
 *
 * @param id 기준이 되는 일기의 ID (path param)
 * @param period 조회할 기간(일) (query param)
 * @returns 감정 통계 데이터
 */
export const getDayDate = async (id: string, period: number) => {

  const response = await api.get(`/diary/date/emotion/${id}`, {
    params: { period },
    paramsSerializer: params => {
      const usp = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        usp.append(key, String(value));
      });
      return usp.toString();
    },
  });

  return response.data;
};
