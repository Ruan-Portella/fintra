import { toast } from "sonner";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { accountsEditSchema, accountsSchema } from "@/schemas";

type ResponseType = z.infer<typeof accountsSchema>;
type RequestType = z.infer<typeof accountsEditSchema>;

export const useEditAccount = (id?: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await axios.patch(`/api/accounts/${id}`, {
        data: {
          ...json
        }
      });

      if (response.data.error) {
        throw new Error("Failed to fetch accounts");
      }
    
      return response.data;
    },
    onSuccess: () => {
      toast.success('Conta editada com sucesso');
      queryClient.invalidateQueries({queryKey: ['account', {id}]});
      queryClient.invalidateQueries({queryKey: ['accounts']});
      queryClient.invalidateQueries({queryKey: ['transactions']});
      queryClient.invalidateQueries({queryKey: ['summary']});
    },
    onError: () => {
      toast.error('Erro ao editar conta');
    }
  })
  return mutation;
};