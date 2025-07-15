// queries/useGetTriggerRoutine.ts
import { useQuery } from "@tanstack/react-query";
import { getTriggerRoutine } from "@/api/services/routine";

export const useGetTriggerRoutine = () => {
  return useQuery({
    queryKey: ["triggerRoutines"],
    queryFn: getTriggerRoutine,
    staleTime: 1000 * 60 * 5, // 5분 동안 캐싱
  });
};
