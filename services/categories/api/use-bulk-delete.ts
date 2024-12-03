import { toast } from "sonner";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categorySchema, deleteCategory } from "@/schemas";
import axios from "axios";

type ResponseType = z.infer<typeof categorySchema>;
type RequestType = z.infer<typeof deleteCategory>;

export const useBulkDeleteCategories = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await axios.post(`/api/categories`, {
        data: {...json}
      });

      if (response.data.error) {
        throw new Error("Failed to delete category");
      }
    
      return response.data;
    },
    onSuccess: () => {
      toast.success('Categorias deletadas com sucesso');
      queryClient.invalidateQueries({queryKey: ['categories']});
      queryClient.invalidateQueries({queryKey: ['summary']});
    },
    onError: () => {
      toast.error('Erro ao deletar categorias');
    }
  })
  return mutation;
};