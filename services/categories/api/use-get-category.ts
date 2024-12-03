import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetCategory = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['category', { id }],
    queryFn: async () => {
      const response = await axios.get(`/api/categories/${id}`);

      if (response.data.error) {
        throw new Error("Failed to fetch categories");
      }

      return response.data[0];
    }
  });
  return query;
}