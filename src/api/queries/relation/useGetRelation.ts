// src/api/queries/relation/useGetRelation.ts
import { useQuery } from "@tanstack/react-query";
import { getRelation } from "../../relation";

export const useGetRelation = () => {
  return useQuery({
    queryKey: ["relation"],
    queryFn: getRelation,
  });
};
