// api/services/relationDetail.ts
import api from "../axios";
import type { DiaryResponse } from "../../types";

export const getRelationDetail = async (id: string): Promise<DiaryResponse> => {
  const response = await api.get(`/relation/detail/${id}`);
  return response.data;
};
