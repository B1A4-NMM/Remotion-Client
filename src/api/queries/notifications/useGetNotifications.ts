// src/api/queries/relation/useGetRelation.ts
import { useQuery } from "@tanstack/react-query";
import { getNotification } from "../../services/notification";
import axios from "axios";
import { Notification } from "@/types/notification";


export const useGetNotifications = () => {
  return useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: useGetNotifications,
  });
};