import { useMutation } from "@tanstack/react-query";
import { deleteRoutineById } from "@/api/services/routine";

export const useDeleteRoutineById = () => {
    return useMutation({
        mutationFn:deleteRoutineById,
    });
};