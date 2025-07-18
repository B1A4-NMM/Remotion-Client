import api from "../axios";

export const getNotification = async (): Promise<void> => {
    const response =await api.get("/notification");
    return response.data;
};



