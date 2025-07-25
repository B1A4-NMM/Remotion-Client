// src/api/getMapData.ts
import api from "../axios";

export const getMapData = async () => {
  try {
    const response = await api.get("/map");
    return response.data;
  } catch (error) {
    throw error;
  }
};
