import { toast } from "sonner";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryEditSchema, categorySchema } from "@/schemas";
import axios from "axios";

type ResponseType = z.infer<typeof categorySchema>;
type RequestType = z.infer<typeof categoryEditSchema>;

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await axios.post(`/api/categories`, {
        ...json
      });

      if (response.data.error) {
        throw new Error("Failed to create category");
      }

      return response.data;
    },
    onSuccess: () => {
      toast.success('Categoria criada com sucesso');
      queryClient.invalidateQueries({queryKey: ['categories']});
      queryClient.invalidateQueries({queryKey: ['summary']});
    },
    onError: () => {
      toast.error('Erro ao criar categoria');
    }
  })
  return mutation;
};