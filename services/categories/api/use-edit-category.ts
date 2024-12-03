import { toast } from "sonner";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { categoryEditSchema, categorySchema } from "@/schemas";

type ResponseType = z.infer<typeof categorySchema>;
type RequestType = z.infer<typeof categoryEditSchema>;

export const useEditCategory = (id?: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await axios.patch(`/api/categories/${id}`, {
        ...json
      });

      if (response.data.error) {
        throw new Error("Failed to fetch categories");
      }

      return response.data;
    },
    onSuccess: () => {
      toast.success('Categoria editada com sucesso');
      queryClient.invalidateQueries({queryKey: ['category', {id}]});
      queryClient.invalidateQueries({queryKey: ['categories']});
      queryClient.invalidateQueries({queryKey: ['transactions']});
      queryClient.invalidateQueries({queryKey: ['summary']});
    },
    onError: () => {
      toast.error('Erro ao editar categoria');
    }
  })
  return mutation;
};