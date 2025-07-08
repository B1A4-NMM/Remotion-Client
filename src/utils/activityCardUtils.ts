// utils/activityCardUtils.ts

import type { DiaryResponse, ActivityAnalysis } from '../types/diary';

export interface ActivityCardData {
  activity: string;
  problem_summary: string;
  peoples_emotions: Array<{
    name: string;
    emotions: Array<[string, number]>;
    name_intimacy: string;
  }>;
  self_emotions: Array<[string, number]>;
  state_emotions: Array<[string, number]>;
  strength: string;
}
  
export const processActivityData = (data: DiaryResponse): ActivityCardData[] => {
  const activityAnalysis = data?.activity_analysis || [];
  
  return activityAnalysis.map((activity: ActivityAnalysis) => {
    // 문제 요약 생성
    const problem = activity.problem?.[0];
    let problemSummary = "";
    if (problem && problem.situation !== "None" && problem.situation) {
      problemSummary = `오늘 <span style='color:#ef8e7f; font-weight:bold;'>${problem.situation}</span>을 <span style='color:#23bcdb; font-weight:bold;'>${problem.approach}</span>로 해결하려고 했고, 그 결과 <span style='color:#89db9b; font-weight:bold;'>${problem.outcome}</span>`;
    }

    // 만난 사람들과 감정 
    const peoplesEmotions = (activity.peoples || []).map((person) => {
      const emotions = person.interactions?.emotion || [];
      const intensities = person.interactions?.emotion_intensity || [];
      
      const emotionPairs = emotions.map((emotion: string, index: number) => 
        [emotion, intensities[index] || 0] as [string, number]
      ).sort((a, b) => b[1] - a[1]); // 강도순 정렬

      return {
        name: person.name || '',
        emotions: emotionPairs,
        name_intimacy: person.name_intimacy || '' // ✅ name_similarity → name_intimacy
      };
    });

    // 자의식 감정 
    const selfEmotions = (activity.self_emotions?.emotion || []).map((emotion: string, index: number) => 
      [emotion, activity.self_emotions?.emotion_intensity?.[index] || 0] as [string, number]
    );

    // 상태 감정 
    const stateEmotions = (activity.state_emotions?.emotion || []).map((emotion: string, index: number) => 
      [emotion, activity.state_emotions?.emotion_intensity?.[index] || 0] as [string, number]
    );

    return {
      activity: activity.activity || '',
      problem_summary: problemSummary,
      peoples_emotions: peoplesEmotions,
      self_emotions: selfEmotions,
      state_emotions: stateEmotions,
      strength: activity.strength || ''
    };
  });
};

// Reflection 데이터 처리를 위한 새로운 함수
export interface ReflectionData {
  achievements: string[];
  shortcomings: string[];
  tomorrow_mindset: string;
  todos: string[];
}

export const processReflectionData = (data: DiaryResponse): ReflectionData => {
  const reflection = data?.reflection || {};
  
  return {
    achievements: reflection.achievements || [],
    shortcomings: reflection.shortcomings || [],
    tomorrow_mindset: reflection.tomorrow_mindset || '',
    todos: reflection.todo || []
  };
};