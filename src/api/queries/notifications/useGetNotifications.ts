// src/api/queries/relation/useGetRelation.ts
import { useQuery } from "@tanstack/react-query";
import { getNotification } from "@/api/services/notification";
import { Notification } from "@/types/notification";


export const useGetNotification = () => {
  return useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: getNotification,
  });
};