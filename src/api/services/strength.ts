import api from "../axios";
import type { StrengthData } from "../../types/strength";

export const getStrength = async () => {
  const response = await api.get("/strength");
  return response.data;
};

export const getStrengthPeriod = async (year: string, month: string): Promise<StrengthData> => {
  const response = await api.get("/strength/period/", {
    params: {
      year,
      month,
    },
  });
  console.log("getStrengthPeriod", response.data);
  return response.data;
};
