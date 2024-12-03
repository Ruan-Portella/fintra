import { toast } from "sonner";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { accountsSchema, deleteAccounts } from "@/schemas";

type ResponseType = z.infer<typeof accountsSchema>;
type RequestType = z.infer<typeof deleteAccounts>;

export const useBulkDeleteAccounts = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await axios.post(`/api/accounts`, {
        data: {...json}
      });

      if (response.data.error) {
        throw new Error("Failed to delete account");
      }
    
      return response.data;
    },
    onSuccess: () => {
      toast.success('Contas deletadas com sucesso');
      queryClient.invalidateQueries({queryKey: ['accounts']});
    },
    onError: () => {
      toast.error('Erro ao deletar contas');
    }
  })
  return mutation;
};