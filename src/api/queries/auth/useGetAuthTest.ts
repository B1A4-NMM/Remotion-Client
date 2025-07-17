import { useQuery } from "@tanstack/react-query";
import api from "../../axios";

export const useGetAuthTest = () => {
  return useQuery({
    queryKey: ["authTest"],
    queryFn: async () => {
      const response = await api.get("/auth/test");
      console.log(response.data);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5분
  });
};
