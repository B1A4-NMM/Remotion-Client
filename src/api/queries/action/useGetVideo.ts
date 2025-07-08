// api/queries/diary/useGetVideo.ts
import { useQuery } from "@tanstack/react-query";
import { getVideo } from "../../services/recommendVideo";

export const useGetVideo = (token: string, period:number=0) => {
  return useQuery({
    queryKey: ["VidouseGetVideo", token],
    queryFn: () => getVideo(token, period),
    enabled: !!token ,
    staleTime: 1000 * 60 * 5,
  });
};
