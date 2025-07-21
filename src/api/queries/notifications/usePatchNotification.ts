import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchNotification } from "@/api/services/notification";

export const usePatchNotification = () => {
    const queryClient = useQueryClient();


    return useMutation({
        mutationFn: (id: number) => patchNotification(id),
        onSuccess: () => {
            
        // 알림 데이터를 다시 불러오거나 낙관적 업데이트를 위해 사용
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });
}