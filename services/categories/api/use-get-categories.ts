import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetCategories = () => {
  const query = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get(`/api/categories`);

      if (response.data.error) {
        throw new Error("Failed to fetch category");
      }

      return response.data;
    }
  });
  return query;
}