// api/queries/diary/useGetEmoanalysis.ts
import { useQuery } from "@tanstack/react-query";
import { getEmotionAnalysis } from "../../services/emotionAnalysis";

export const useGetEmotionAnalysis = () => {
  return useQuery({
    queryKey: ["EmotionAnalysis"],
    queryFn: () => {
      console.log("useGetEmotionAnalysis - queryFn 실행");
      return getEmotionAnalysis();
    },
    staleTime: 1000 * 60 * 5,
  });
};
