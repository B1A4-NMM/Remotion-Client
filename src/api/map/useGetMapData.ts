// src/api/queries/map/useGetMapData.ts
import { useQuery } from "@tanstack/react-query";
import { getMapData } from "./../services/getMapData";

export const useGetMapData = () => {
  return useQuery({
    queryKey: ["mapData"],
    queryFn: getMapData,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
