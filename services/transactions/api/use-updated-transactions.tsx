import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useUpdatedTransaction = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await axios.post(`/api/updated-transactions`);

      if (response.data.error) {
        throw new Error("Failed to fetch transactions");
      }

      return response.data;
    },
    onSuccess: (message) => {
      toast.success(message);
      queryClient.invalidateQueries({queryKey: ['transaction']});
      queryClient.invalidateQueries({queryKey: ['transactions']});
      queryClient.invalidateQueries({queryKey: ['summary']});
    },
    onError: () => {
      toast.error('Erro ao atualizar transações');
    }
  })
  return mutation;
}