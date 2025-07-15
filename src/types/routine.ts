// types/routine.ts

// 1. 공통 루틴 타입
export interface BaseRoutine {
    routineId: number;
    content: string;
    isTrigger: boolean;
  }
  
  // 2. 감정 유형
  export type RoutineType = "depression" | "stress" | "anxiety";
  
  // 3. 실제 응답 루틴 타입 (routineType 포함)
  export interface Routine extends BaseRoutine {
    routineType: RoutineType;
  }
  