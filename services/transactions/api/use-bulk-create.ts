import { toast } from "sonner";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionsSchema } from "@/schemas";
import axios from "axios";

type ResponseType = z.infer<typeof transactionsSchema>;
type RequestType = z.infer<typeof transactionsSchema>;

export const useBulkCreateTransactions = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await axios.post(`/api/transactions`, {
        ...json
      });

      if (response.data.error) {
        throw new Error("Failed to create transactions");
      }

      return response.data;
    },
    onSuccess: () => {
      toast.success('Transações criadas com sucesso');
      queryClient.invalidateQueries({queryKey: ['transactions']});
    },
    onError: () => {
      toast.error('Erro ao criar transações');
    }
  })
  return mutation;
};