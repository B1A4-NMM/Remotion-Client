// src/types/relation.ts

// 기본 감정 타입
export interface Emotion {
    emotion: string;
    count: number;
    intensity: number;
  }
  
  // 일기 내 감정 타입 (count 필드가 없음)
  export interface DiaryEmotion {
    emotion: string;
    intensity: number;
  }
  
  // 날짜별 감정 데이터
  export interface DailyEmotions {
    date: string;
    emotions: Emotion[];
  }
  
  // 일기 데이터
  export interface Diary {
    diaryId: number;
    title: string;
    writtenDate: string;
    content: string;
    photoPath: string[];
    audioPath: string;
    isBookmarked: boolean;
    latitude: number;
    longitude: number;
    activities: string[];
    emotions: DiaryEmotion[];
    targets: string[];
  }
  
  // 메인 관계 데이터 타입
  export interface RelationData {
    targetId: number;
    targetName: string;
    emotions: DailyEmotions[];
    diaries: Diary[];
  }
  
  // 필요에 따라 추가할 수 있는 유틸리티 타입들
  export type EmotionType = 
    | "무난"
    | "행복"
    | "슬픔"
    | "화남"
    | "불안"
    | "기쁨"
    | "사랑"
    | "짜증"
    | "친밀"
    | "존경"
    | "애정";
  
  // API 응답 타입 (필요시 사용)
  export interface RelationApiResponse {
    data: RelationData;
    success: boolean;
    message?: string;
  }
  
  // 선택적 필드가 있는 경우를 위한 Partial 타입
  export type PartialRelationData = Partial<RelationData>;
  
  // 일기 생성/수정용 타입
  export interface CreateDiaryData {
    title: string;
    content: string;
    photoPath?: string[];
    audioPath?: string;
    latitude?: number;
    longitude?: number;
    activities?: string[];
    emotions: DiaryEmotion[];
    targets: string[];
  }
  
  // 감정 통계용 타입
  export interface EmotionStats {
    emotion: string;
    totalCount: number;
    averageIntensity: number;
    occurrences: number;
  }
  