// api/queries/action/useGetVideo.ts
import { useQuery } from "@tanstack/react-query";
import { getVideo } from "../../services/recommendVideo";
import type { VideoApiResponse } from "../../../types/video";

export const useGetVideo = (period = 0) =>
  useQuery<VideoApiResponse>({
    queryKey: ["video", period],
    queryFn: () => getVideo(period),
  });
