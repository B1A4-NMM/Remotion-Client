// api/queries/diary/useGetCharacter.ts
import { useQuery } from "@tanstack/react-query";
import { getCharacter } from "@/api/services/character";

export const useGetCharacter = () => {
  return useQuery({
    queryKey: ["character"],
    queryFn: () => getCharacter(),
  });
};
