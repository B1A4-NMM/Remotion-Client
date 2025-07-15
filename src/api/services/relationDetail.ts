// api/services/relationDetail.ts
import axios from "axios";
import type { RelationData } from "../../types/relation";

export const getRelationDetail = async (token: string, id: string): Promise<RelationData> => {
  const BASE_URL = import.meta.env.VITE_SOCIAL_AUTH_URL;

  const response = await axios.get(`${BASE_URL}/relation/detail/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  // console.log(response.data);
  return response.data;
};
