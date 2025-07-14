import axios from "axios";

export const postDiary = async (formData: FormData) => {
  const BASE_URL = import.meta.env.VITE_SOCIAL_AUTH_URL;

  const token = localStorage.getItem("accessToken");
  console.log("📦 FormData 전송 중...");
  for (const pair of formData.entries()) {
    console.log(`${pair[0]}:`, pair[1]);
  }

  const response = await axios.post(`${BASE_URL}/diary`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const patchDiaryBookmark = async (token: string, diaryId: number, isBookmarked: boolean) => {
  const BASE_URL = import.meta.env.VITE_SOCIAL_AUTH_URL;
  const response = await axios.patch(
    `${BASE_URL}/diary/bookmark/${diaryId}`,
    { id: diaryId, isBookmarked },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
