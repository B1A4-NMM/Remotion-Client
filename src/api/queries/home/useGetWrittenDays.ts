import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { getWrittenDays } from "../../services/diary";

export const useGetWrittenDays = (
  year: number,
  month: number,
  options?: Partial<
    UseQueryOptions<{ writtenDays: number[] }, Error, { writtenDays: number[] }, readonly unknown[]>
  >
) => {
  return useQuery({
    queryKey: ["writtenDays", year, month],
    queryFn: () => getWrittenDays(year, month),

    enabled: options?.enabled ?? true,
    ...options,
  });
};
