// api/queries/action/useGetVideo.ts
import { useQuery } from '@tanstack/react-query';
import { getVideo } from '../../services/recommendVideo';
import type { VideoApiResponse } from '../../../types/video';

export const useGetVideo = (token: string, period = 0) =>
  useQuery<VideoApiResponse>({
    queryKey: ['video', token, period],
    queryFn: () => getVideo(token, period),
    enabled: !!token,
    staleTime: 1_000 * 60 * 5,
    retry: 2,
  });
