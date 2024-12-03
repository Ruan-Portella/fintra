import { toast } from "sonner";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categorySchema } from "@/schemas";
import axios from "axios";

type ResponseType = z.infer<typeof categorySchema>;
export const useDeleteCategory = (id?: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await axios.delete(`/api/categories/${id}`);

      if (response.data.error) {
        throw new Error("Failed to delete category");
      }
    
      return response.data;
    },
    onSuccess: () => {
      toast.success('Categoria deletada com sucesso');
      queryClient.removeQueries({queryKey: ['category', {id}]});
      queryClient.invalidateQueries({queryKey: ['categories']});
      queryClient.invalidateQueries({queryKey: ['transactions']});
      queryClient.invalidateQueries({queryKey: ['summary']});
    },
    onError: () => {
      toast.error('Erro ao deletar categoria');
    }
  })
  return mutation;
};