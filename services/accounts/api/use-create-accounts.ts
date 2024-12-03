import { toast } from "sonner";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountsEditSchema, accountsSchema } from "@/schemas";
import axios from "axios";

type ResponseType = z.infer<typeof accountsSchema>;
type RequestType = z.infer<typeof accountsEditSchema>;

export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await axios.post(`/api/accounts`, {
        data: {...json}
      });

      if (response.data.error) {
        throw new Error("Failed to create account");
      }
    
      return response.data;
    },
    onSuccess: () => {
      toast.success('Conta criada com sucesso');
      queryClient.invalidateQueries({queryKey: ['accounts']});
    },
    onError: () => {
      toast.error('Erro ao criar conta');
    }
  })
  return mutation;
};