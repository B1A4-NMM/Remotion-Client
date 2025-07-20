import { useQuery } from "@tanstack/react-query";
import { client } from "@/api/client";

interface Routine {
    id: number;
    content: string;
}
export const useDepressionRoutines = () => {
    return useQuery<Routine[]>({
        queryKey: ["depressionRoutines"],
        queryFn: async () => {
            const response = await client.get("/routine/depression");
            return response.data;
        },
    });
};