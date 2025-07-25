// src/api/queries/relation/useGetRelation.ts
import { useQuery } from "@tanstack/react-query";
import { getRelation } from "../../services/relation";

export const useGetRelation = () => {
  return useQuery({
    queryKey: ["relation"],
    queryFn: getRelation,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
