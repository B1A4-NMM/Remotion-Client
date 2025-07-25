// import { useMutation } from "@tanstack/react-query";
// //import { addRoutine } from "../../services/routine";
// import type { UseMutationOptions } from "@tanstack/react-query";

// export const useAddRoutine = (
//   options?: UseMutationOptions<any, unknown, { title: string; routineType: string }>
// ) => {
//   return useMutation({
//     ...options,

//     mutationFn: async variables => {
//       const res = await addRoutine(variables);
//       return res;
//     },

//     onSuccess: (data, variables, context) => {

//       // 외부에서 전달된 onSuccess 실행 (예: refetch)
//       try {
//         options?.onSuccess?.(data, variables, context);
//       } catch (err) {
//         console.error("외부 onSuccess 에러:", err);
//       }
//     },

//     onError: (error, variables, context) => {
//       console.error("루틴 추가 실패:", error);
//       options?.onError?.(error, variables, context);
//     },
//   });
// };
