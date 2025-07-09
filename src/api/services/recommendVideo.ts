// api/services/recommendVideo.ts
import axios from 'axios';
import type { VideoApiResponse } from '../../types/video';

export const getVideo = async (
  token: string,
  period = 0
): Promise<VideoApiResponse> => {
  const BASE_URL = import.meta.env.VITE_SOCIAL_AUTH_URL;

  const { data } = await axios.get<VideoApiResponse>(
    `${BASE_URL}/recommend/video`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { period },
    }
  );

  return data; 
};
