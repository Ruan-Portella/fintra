import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetAccounts = () => {
  const query = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await axios.get("/api/accounts");
      if (response.data.error) {
        throw new Error("Failed to fetch accounts");
      }
      return response.data;
    }
  });
  return query;
}