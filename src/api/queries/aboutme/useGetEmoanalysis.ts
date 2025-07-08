// api/queries/diary/useGetEmoanalysis.ts
import { useQuery } from "@tanstack/react-query";
import { getEmotionAnalysis } from "../../services/emotionAnalysis";

export const useGetEmotionAnalysis = (token: string) => {
  return useQuery({
    queryKey: ["EmotionAnalysis", token],
    queryFn: () => getEmotionAnalysis(token),
    enabled: !!token ,
    staleTime: 1000 * 60 * 5,
  });
};
