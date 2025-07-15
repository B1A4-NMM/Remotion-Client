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

    return response.data;
  } catch (err) {
    throw err; 
  }
};