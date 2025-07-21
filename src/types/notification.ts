export type NotificationType = "RECAP" | "TODO" | "CHARACTER" | "ROUTINE"
                               | "TODAY_COMMENT"


export interface Notification {

    id : number;
    type : NotificationType; 
    content :string;
    createdAt : string; 
    read: boolean; 
    targetDate? : string | null ;
    diaryId? : number | null; 
    photoPath? : string | null;

}

export interface NotiCount {
    count : number ; 
}