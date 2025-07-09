import { useQuery } from "@tanstack/react-query";
import { getDayDate } from "./../../services/getDayDate"; // 경로는 실제 위치에 맞게 수정해줘

/**
 * 감정 데이터 조회 훅
 *
 * @param id 기준이 되는 일기의 ID
 * @param period 조회할 기간(일)
 */
export const useGetDiaryHealth = (id: string, period: number) => {
  console.log("🌀 useGetDiaryHealth 호출됨");
  console.log("📌 id:", id);
  console.log("📅 period:", period);

  return useQuery({
    queryKey: ["mentalData", id, period],
    queryFn: () => {
      console.log("🚀 queryFn 실행됨");
      return getDayDate(id, period);
    },
    enabled: !!id && !!period, // id와 period가 존재할 때만 실행
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유지
  });
};
