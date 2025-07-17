import axios from "axios";

export const demoLogin = async () => {
  const BASE_URL = import.meta.env.VITE_SOCIAL_AUTH_URL;
  const response = await axios.get(`${BASE_URL}/auth/demo`);
  console.log("hello", response.data);
  return response.data;
};
