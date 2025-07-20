// types/video.ts
export interface VideoApiResponse {
  videoId: string[];
  emotion: string;
  message: string;
}

export interface VideoDetails {
  id: string;
  title: string;
  description: string;
}

// 개별 비디오 아이템용 타입 (UI에서 사용)
export interface VideoItem {
  videoId: string;
  emotion: string;
  message: string;
}

// 네비게이션 시 전달할 데이터 타입
export interface VideoNavigationData {
  videoIds: string[];
  selectedVideoId: string;
  emotion: string;
  message: string;
}
