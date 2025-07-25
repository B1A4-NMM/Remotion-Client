// api/services/recommendVideo.ts
import api from "../axios";
import type { VideoApiResponse } from "../../types/video";

export const getVideo = async (period:number): Promise<VideoApiResponse> => {
  const { data } = await api.get<VideoApiResponse>("/recommend/video", {
    params: { period },
  });

  return data;
};
