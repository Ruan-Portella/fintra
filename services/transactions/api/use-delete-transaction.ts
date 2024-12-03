import { toast } from "sonner";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { transactionsSchema } from "@/schemas";

type ResponseType = z.infer<typeof transactionsSchema>;

export const useDeleteTransaction = (id?: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => { 
      const response = await axios.delete(`/api/transactions/${id}`);

      if (response.data.error) {
        throw new Error("Failed to delete account");
      }
    
      return response.data;
    },
    onSuccess: () => {
      toast.success('Transação deletada com sucesso');
      queryClient.invalidateQueries({queryKey: ['transaction', {id}]});
      queryClient.invalidateQueries({queryKey: ['transactions']});
      queryClient.invalidateQueries({queryKey: ['summary']});
    },
    onError: () => {
      toast.error('Erro ao deletar transação');
    }
  })
  return mutation;
};