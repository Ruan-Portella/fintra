import { toast } from "sonner";
import * as z from "zod";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTransactions, transactionsSchema } from "@/schemas";

type ResponseType = z.infer<typeof transactionsSchema>;
type RequestType = z.infer<typeof deleteTransactions>;

export const useBulkDeleteTransactions = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await axios.post(`/api/transactions`, {
        data: {...json}
      });

      if (response.data.error) {
        throw new Error("Failed to delete transactions");
      }
    
      return response.data;
    },
    onSuccess: () => {
      toast.success('Transações deletadas com sucesso');
      queryClient.invalidateQueries({queryKey: ['transactions']});
      queryClient.invalidateQueries({queryKey: ['summary']});
    },
    onError: () => {
      toast.error('Erro ao deletar Transações');
    }
  })
  return mutation;
};