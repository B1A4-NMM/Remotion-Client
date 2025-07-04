// 내가 보내는 데이터
export interface DiaryPayload {
  content: string;
  writtenDate: string;
  weather: string;
  token: string;
}
// 내가 받는 데이터
export interface DiaryResponse {
  id: number;
  title: string;
  photo_path?: string;
  content: string;
  people: Person[];
  selfEmotion: Emotion[];
  stateEmotion: Emotion[];
  activity: Activity[];
  todos: TodoItem[];
  createdAt?: string;
}

interface Person {
  name: string;
  feel: {
    emotionType: string;
    intensity: number;
  }[];
  count: number;
}

export interface Emotion {
  emotionType: string;
  intensity: number;
}

interface Activity {
  activityContent: string;
  strength: string;
}

export interface TodoItem {
  content: string;
}
