// 내가 보내는 데이터

export interface TodayEmotion {
  emotionType: string;
  intensity: number;
}

export interface TodayDiary {
  diaryId: number;
  title: string;
  writtenDate: string;
  emotions: string[];
  targets: string[];
}

export interface TodayDiaryResponse {
  todayEmotions: TodayEmotion[];
  todayDiaries: TodayDiary[];
}

// Home 페이지용 새로운 타입
export interface HomeDiary {
  diaryId: number;
  title: string;
  writtenDate: string;
  content: string;
  photoPath: string;
  audioPath: string;
  isBookmarked: boolean;
  latitude: number;
  longitude: number;
  emotions: string[];
  targets: string[];
}

export interface HomeResponse {
  item: {
    diaries: HomeDiary[];
    continuousWritingDate: number;
    totalDiaryCount: number;
    emotionCountByMonth: number;
  };
  hasMore: boolean;
  nextCursor: number;
}

export interface DiaryPayload {
  content: string;
  writtenDate: string;
  weather: string;
  token: string;
}

// 내가 받는 데이터
export interface DiaryResponse {
  diaryId: number;
  title: string;
  writtenDate: string;
  content: string;
  photoPath: string;
  audioPath: string;
  isBookmarked: boolean;
  latitude: number;
  longitude: number;
  activity_analysis: ActivityAnalysis[];
}

export interface ActivityAnalysis {
  activity: string;
  peoples: Person[];
  self_emotions: SelfEmotions;
  state_emotions: StateEmotions;
  problem: Problem[];
  strength: string;
}

export interface Person {
  name: string;
  interactions: {
    emotion: string[];
    emotion_intensity: number[];
  };
  name_intimacy: string;
}

export interface SelfEmotions {
  emotion: string[];
  emotion_intensity: number[];
}

export interface StateEmotions {
  emotion: string[];
  emotion_intensity: number[];
}

export interface Problem {
  situation: string;
  cause: string;
  approach: string;
  outcome: string;
}

export interface Reflection {
  achievements: string[];
  shortcomings: string[];
  tomorrow_mindset: string;
  todo: string[];
}

export interface TodoItem {
  content: string;
}

export interface EmotionSummary {
  emotion: string;
  intensity: number;
  count: number;
}

export interface MemberSummaryResponse {
  Relation: EmotionSummary[];
  Self: EmotionSummary[];
  State: EmotionSummary[];
}

// EmotionChart에서 사용할 수 있도록 변환하는 타입
export interface EmotionData {
  name: string;
  count: number;
}

export interface ProcessedMemberSummary {
  relationData: {
    connected: EmotionData[];
    distanced: EmotionData[];
  };
  stateData: {
    elevated: EmotionData[];
    tense: EmotionData[];
    calm: EmotionData[];
    lethargic: EmotionData[];
  };
  selfData: {
    positive: EmotionData[];
    negative: EmotionData[];
  };
}

export interface Character {
  character: string;
}

export type AnimalKey =
  | "호랑이"
  | "새"
  | "개"
  | "고양이"
  | "팬더"
  | "펭귄"
  | "나무늘보"
  | "다람쥐"
  | "독수리"
  | "코브라"
  | "여우"
  | "박쥐"
  | "고래"
  | "거북이"
  | "개구리"
  | "문어"
  | "unknown";

export interface AnimalTypeProps {
  animalType: {
    character: AnimalKey;
  };
}

export interface EmotionAnalysisItem {
  emotion: string;
  intensity: number;
  count: number;
}

export interface EmotionAnalysisResponse {
  Relation: EmotionAnalysisItem[];
  Self: EmotionAnalysisItem[];
  State: EmotionAnalysisItem[];
}

export interface WrittenDaysResponse {
  writtenDays: number[];
}
