// api/services/diary/deleteDiary.ts
import api from "../axios";

export const deleteDiary = async (diaryId: string): Promise<void> => {
  await api.delete(`/diary/${diaryId}`);
};
