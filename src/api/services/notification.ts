import api from "../axios";
import { Notification,NotiCount } from "@/types/notification";

export const getNotification = async (): Promise<Notification[]> => {
    const response =await api.get("/noti/all");

    // 서버에서 빈 객체({})로 오는 필드들을 정제해주는 전처리
    const cleaned = response.data.map((n: any): Notification => ({
    ...n,
    targetDate: typeof n.targetDate === "string" ? n.targetDate : null,
    diaryId: typeof n.diaryId === "number" ? n.diaryId : null,
    photoPath: typeof n.photoPath === "string" ? n.photoPath : null,
  }));

  return cleaned;

};


export const patchNotification = async ( id : number ):Promise<void> => {
    await api.patch(`/noti/${id}`);
}

//갯수 카운트 해오는 api
export const getNotiCount = async () : Promise<NotiCount> => {
    const response = await api.get("/noti/count");
    
    return response.data;
}
