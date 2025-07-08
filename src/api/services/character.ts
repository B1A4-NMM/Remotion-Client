// api/services/character.ts
import axios from "axios";
import type { Character } from "../../types/diary";

export const getCharacter = async (token: string): Promise<Character> => {
  const BASE_URL = import.meta.env.VITE_SOCIAL_AUTH_URL;

  try {
    const response = await axios.get(`${BASE_URL}/member/character`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("getCharacter response", response.data); // ✅ 절대 실행 안 되면 axios 에러남
    return response.data;
  } catch (err) {
    console.error("getCharacter ERROR:", err); // ✅ 반드시 찍어봐
    throw err; // React Query가 에러 핸들링하도록 다시 throw
  }
};