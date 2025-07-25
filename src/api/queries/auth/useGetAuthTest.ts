import { useQuery } from "@tanstack/react-query";
import api from "../../axios";

export const useGetAuthTest = () => {
  return useQuery({
    queryKey: ["authTest"],
    queryFn: async () => {
      const response = await api.get("/auth/test");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5분
  });
};
