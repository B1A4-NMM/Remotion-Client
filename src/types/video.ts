// types/video.ts
export interface VideoApiResponse {
    videoId: string | VideoDetails;  // API 응답에 따라 조정
    message: string;
  }
  
  export interface VideoDetails {
    id: string;
    title: string;
    description: string;
    // 추가 필요한 필드들
  }
  
  export interface VideoType {
    id: string;
    title: string;
    description: string;
  }
  