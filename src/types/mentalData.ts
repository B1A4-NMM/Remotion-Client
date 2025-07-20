export interface NegativeDataResponse {
    stressTarget: {
      targetId: number;
      targetName: string;
      emotion: string;
      totalIntensity: number;
      count: number;
    }[];
    depressionTarget: {
      targetId: number;
      targetName: string;
      emotion: string;
      totalIntensity: number;
      count: number;
    }[];
    anxietyTarget: {
      targetId: number;
      targetName: string;
      emotion: string;
      totalIntensity: number;
      count: number;
    }[];
    stressDate: {
      date: string;
      emotionGroup: string;
      intensity: number;
      count: number;
    }[];
    depressionDate: {
      date: string;
      emotionGroup: string;
      intensity: number;
      count: number;
    }[];
    anxietyDate: {
      date: string;
      emotionGroup: string;
      intensity: number;
      count: number;
    }[];
}

  

export interface PositiveDataResponse {
    stabilityTarget: {
      targetId: number;
      targetName: string;
      emotion: string;
      totalIntensity: number;
      count: number;
    }[];
    bondTarget: {
      targetId: number;
      targetName: string;
      emotion: string;
      totalIntensity: number;
      count: number;
    }[];
    vialityTarget: {
      targetId: number;
      targetName: string;
      emotion: string;
      totalIntensity: number;
      count: number;
    }[];
    stabilityDate: {
      date: string;
      emotionGroup: string;
      intensity: number;
      count: number;
    }[];
    bondDate: {
      date: string;
      emotionGroup: string;
      intensity: number;
      count: number;
    }[];
    vialityDate: {
      date: string;
      emotionGroup: string;
      intensity: number;
      count: number;
    }[];
}

export interface NegativeActData {
    stress: {
      activityId: number;
      activityContent: string;
      emotion: string;
      totalIntensity: number;
      count: number;
      percentage: number;
    }[];
    depression: {
      activityId: number;
      activityContent: string;
      emotion: string;
      totalIntensity: number;
      count: number;
      percentage: number;
    }[];
    anxiety: {
      activityId: number;
      activityContent: string;
      emotion: string;
      totalIntensity: number;
      count: number;
      percentage: number;
    }[];
  }

export interface PositiveActData {
    stability: {
      activityId: number;
      activityContent: string;
      emotion: string;
      totalIntensity: number;
      count: number;
      percentage: number;
    }[];
    bond: {
      activityId: number;
      activityContent: string;
      emotion: string;
      totalIntensity: number;
      count: number;
      percentage: number;
    }[];
    vitality: {
      activityId: number;
      activityContent: string;
      emotion: string;
      totalIntensity: number;
      count: number;
      percentage: number;
    }[];
  }
  
  