import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetAccount = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['account', { id }],
    queryFn: async () => {
      const response = await axios.get(`/api/accounts/${id}`);

      if (response.data.error) {
        throw new Error("Failed to fetch accounts");
      }

      return response.data[0];
    }
  });
  return query;
}