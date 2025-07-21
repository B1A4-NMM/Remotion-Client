import { useQuery } from "@tanstack/react-query";
import { getNotiCount } from "@/api/services/notification";
import { NotiCount } from "@/types/notification";


export const useGetNotiCount = () => { 
    return useQuery<NotiCount>({
        queryKey:["notiCount"],
        queryFn: getNotiCount,
    },
    
    )
}





