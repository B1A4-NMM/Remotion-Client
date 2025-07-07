// utils/activityCardUtils.ts
export interface ActivityCardData {
    activity: string;
    problem_summary: string;
    peoples_emotions: Array<{
      name: string;
      emotions: Array<[string, number]>;
    }>;
    self_emotions: Array<[string, number]>;
    state_emotions: Array<[string, number]>;
  }
  
  export const processActivityData = (data: any): ActivityCardData[] => {
    const activityAnalysis = data?.activity_analysis || [];
    
    return activityAnalysis.map((activity: any) => {
      // 문제 요약 생성
      const problem = activity.problem?.[0];
      let problemSummary = "";
      if (problem && problem.situation !== "None") {
        problemSummary = `오늘 <span style='color:#ef8e7f'; font-weight:bold;>${problem.situation}</span>을 <span style='color:#23bcdb'; font-weight:bold;>${problem.approach}</span>로 해결하려고 했고, 그 결과 <span style='color:#89db9b'; font-weight:bold;>${problem.outcome}</span>`;
      
      }
  
      // 만난 사람들과 감정
      const peoplesEmotions = (activity.peoples || []).map((person: any) => {
        const relationEmotions = person.interactions?.relation_emotion || [];
        const intensities = person.interactions?.r_emotion_intensity || [];
        const emotions = relationEmotions.map((emotion: string, index: number) => 
          [emotion, intensities[index]] as [string, number]
        ).sort((a, b) => b[1] - a[1]); // 강도순 정렬
  
        return {
          name: person.name || '',
          emotions
        };
      });
  
      // 자의식 감정
      const selfEmotions = (activity.self_emotions?.self_emotion || []).map((emotion: string, index: number) => 
        [emotion, activity.self_emotions?.self_emotion_intensity?.[index] || 0] as [string, number]
      );
  
      // 상태 감정
      const stateEmotions = (activity.state_emotions?.state_emotion || []).map((emotion: string, index: number) => 
        [emotion, activity.state_emotions?.s_emotion_intensity?.[index] || 0] as [string, number]
      );
  
      return {
        activity: activity.activity || '',
        problem_summary: problemSummary,
        peoples_emotions: peoplesEmotions,
        self_emotions: selfEmotions,
        state_emotions: stateEmotions
      };
    });
  };
  