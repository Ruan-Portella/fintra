import { toast } from "sonner";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountsSchema } from "@/schemas";
import axios from "axios";

type ResponseType = z.infer<typeof accountsSchema>;

export const useDeleteAccount = (id?: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await axios.delete(`/api/accounts/${id}`);

      if (response.data.error) {
        throw new Error("Failed to delete account");
      }
    
      return response.data;
    },
    onSuccess: () => {
      toast.success('Conta deletada com sucesso');
      queryClient.invalidateQueries({queryKey: ['account', {id}]});
      queryClient.invalidateQueries({queryKey: ['accounts']});
      queryClient.invalidateQueries({queryKey: ['transactions']});
      queryClient.invalidateQueries({queryKey: ['summary']});
    },
    onError: () => {
      toast.error('Erro ao deletar conta');
    }
  })
  return mutation;
};