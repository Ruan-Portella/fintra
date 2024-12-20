import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetStatus = () => {
  const query = useQuery({
    queryKey: ['status'],
    queryFn: async () => {
      const response = await axios.get(`/api/status`);

      if (response.data.error) {
        throw new Error("Failed to fetch status");
      }

      return response.data;
    }
  });
  return query;
}