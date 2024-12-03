import { toast } from "sonner";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionsEditSchema, transactionsSchema } from "@/schemas";
import axios from "axios";

type ResponseType = z.infer<typeof transactionsSchema>;
type RequestType = z.infer<typeof transactionsEditSchema>;

export const useEditTransaction = (id?: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await axios.patch(`/api/transactions/${id}`, {
        ...json
      });

      if (response.data.error) {
        throw new Error("Failed to fetch transactions");
      }

      return response.data;
    },
    onSuccess: () => {
      toast.success('Transação editada com sucesso');
      queryClient.invalidateQueries({queryKey: ['transaction', {id}]});
      queryClient.invalidateQueries({queryKey: ['transactions']});
      queryClient.invalidateQueries({queryKey: ['summary']});
    },
    onError: () => {
      toast.error('Erro ao editar transação');
    }
  })
  return mutation;
};