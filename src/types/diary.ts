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
  content: string;
  people: Person[];
  activity: Activity[];
  todos: TodoItem[];
}

export interface Person {
  name: string;
  feel: Emotion[];
}

export interface Emotion {
  emotionType: string;
  intensity: number;
}

export interface Activity {
  activityContent: string;
}

export interface TodoItem {
  content: string;
}
