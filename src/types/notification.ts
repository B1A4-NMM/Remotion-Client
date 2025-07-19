export type NotificationType = "RECAP" | "TODO" | "CHARACTER" | "ROUTINE"
                               | "TODAY_COMMENT"


export interface Notification {

    id : number;
    type : NotificationType; 
    //title : string;
    content :string;
    createdAt : string; 
    read: boolean; 
    targetDate? : string;
    diaryId? : number; 

}