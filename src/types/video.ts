// types/video.ts
export interface VideoApiResponse {
  videoId: string[];  // 문자열 배열로 변경
  message: string;
}

export interface VideoDetails {
  id: string;
  title: string;
  description: string;
}

export interface VideoType {
  id: string;
  title: string;
  description: string;
}