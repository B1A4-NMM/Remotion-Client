// src/api/queries/relation/getRelation.ts
import axios from "axios";

export const getRelation = async () => {
  const BASE_URL = import.meta.env.VITE_SOCIAL_AUTH_URL;
  const token = localStorage.getItem("accessToken");


  const response = await axios.get(`${BASE_URL}/relation`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
