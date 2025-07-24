import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { getWrittenDays } from "../../services/diary";

export const useGetWrittenDays = (
  year: number,
  month: number,
  options?: Partial<
    UseQueryOptions<{ writtenDays: number[] }, Error, { writtenDays: number[] }, readonly unknown[]>
  >,
) => {
    return useQuery({
    queryKey: ["writtenDays", year, month],
    queryFn: () => getWrittenDays(year, month),
    staleTime: 5 * 60 * 1000, // 5분
    enabled: options?.enabled ?? true,
    ...options,
  });
};
