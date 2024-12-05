import { toast } from "sonner";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { transactionsEditSchema, transactionsSchema } from "@/schemas";

type ResponseType = z.infer<typeof transactionsSchema>;
type RequestType = z.infer<typeof transactionsEditSchema>;

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await axios.post(`/api/transactions`, {
        ...json
      });

      if (response.data.error) {
        throw new Error("Failed to create transaction");
      }

      return response.data;
    },
    onSuccess: () => {
      toast.success('Transação criada com sucesso');
      queryClient.invalidateQueries({queryKey: ['transactions']});
      queryClient.invalidateQueries({queryKey: ['summary']});
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  })
  return mutation;
};