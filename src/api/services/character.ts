// api/services/character.ts
import api from "../axios";
import type { Character } from "../../types/diary";

export const getCharacter = async (): Promise<Character> => {
  try {
    const response = await api.get("/member/character");
    return response.data;
  } catch (err) {
    throw err;
  }
};
