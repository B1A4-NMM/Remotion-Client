// 내가 보내는 데이터
export interface DiaryPayload {
  content: string;
  writtenDate: string;
  weather: string;
  token: string;
}

// 내가 받는 데이터
export interface DiaryResponse {
  activity_analysis: ActivityAnalysis[];
  reflection: Reflection;
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