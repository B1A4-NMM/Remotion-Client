import axios from "axios";

/**
 * 특정 일기 ID 기준으로 감정 데이터 조회
 *
 * @param id 기준이 되는 일기의 ID (path param)
 * @param period 조회할 기간(일) (query param)
 * @returns 감정 통계 데이터
 */
export const getDayDate = async (id: string, period: number) => {
  const BASE_URL = import.meta.env.VITE_SOCIAL_AUTH_URL;
  const token = localStorage.getItem("accessToken");

  console.log("📊 걍 데이터 요청 중...");
  console.log("📝 id:", id);
  console.log("📅 period:", period);

  const response = await axios.get(`${BASE_URL}/diary/date/emotion/${id}`, {
    params: { period },
    headers: {
      Authorization: `Bearer ${token}`,
    },
    paramsSerializer: params => {
      const usp = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        usp.append(key, String(value));
      });
      return usp.toString();
    },
  });

  console.log("✅재벌 :", response.data);
  return response.data;
};
