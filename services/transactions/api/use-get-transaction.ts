import { useQuery } from "@tanstack/react-query";
import { convertMiliunitsToAmount } from "@/lib/utils";
import axios from "axios";

export const useGetTransaction = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['transaction', { id }],
    queryFn: async () => {
      const response = await axios.get(`/api/transactions/${id}`);

      if (response.data.error) {
        throw new Error("Failed to fetch transactions");
      }
      
      return {
        ...response.data,
        categoryId: response.data.category?.id,
        accountId: response.data.account?.id,
        amount: convertMiliunitsToAmount(response.data.amount)
      };
    }
  });
  return query;
}