import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";

interface Diary {
  id?: number;
  userId?: number;
  writtenDate?: string;
  content?: string;
  // 기타 일기 속성들...
}

export const useDiaryOwnership = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 일기 소유권 확인
  const checkOwnership = (diary: Diary | null): boolean => {
    if (!diary || !user) {
      return false;
    }

    // userId가 없는 경우 (샘플 데이터 등)는 접근 허용
    if (!diary.userId) {
      return true;
    }

    return diary.userId === user.id;
  };

  // 일기 접근 권한 확인 및 리다이렉트
  const validateAccess = (diary: Diary | null): boolean => {
    if (!checkOwnership(diary)) {
      // 권한이 없으면 홈으로 리다이렉트
      navigate("/", { replace: true });
      return false;
    }

    return true;
  };

  // 일기 목록에서 소유하지 않은 일기 필터링
  const filterOwnedDiaries = (diaries: Diary[]): Diary[] => {
    if (!user) return [];

    return diaries.filter(diary => !diary.userId || diary.userId === user.id);
  };

  return {
    checkOwnership,
    validateAccess,
    filterOwnedDiaries,
  };
};
