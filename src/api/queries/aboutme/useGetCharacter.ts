// api/queries/diary/useGetCharacter.ts
import { useQuery } from "@tanstack/react-query";
import { getCharacter } from "@/api/services/character";

export const useGetCharacter = (token: string) => {
  return useQuery({
    queryKey: ["character", token],
    queryFn: () => getCharacter(token),
    enabled: !!token,
  });
};
