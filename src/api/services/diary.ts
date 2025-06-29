// src/api/diary.ts
import axios from "axios";

// 다이어리 포스트 함수(아직 api안나옴)
export const postDiary = async (formData: FormData) => {
  const response = await axios.post("/api/diary", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
