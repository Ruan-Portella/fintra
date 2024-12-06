import { useQuery } from "@tanstack/react-query";
import * as z from "zod";
import { useSearchParams } from "next/navigation";
import { convertMiliunitsToAmount } from "@/lib/utils";
import axios from "axios";

export const transactionsSchema = z.object({
  id: z.string(),
  amount: z.number(),
  date: z.date(),
  payee: z.string(),
  accountId: z.string(),
  account: z.object({
    id: z.string(),
    name: z.string(),
  }),
  categoryId: z.string(),
  category: z.object({
    id: z.string(),
    name: z.string(),
  }),
  description: z.string(),
});

type ResponseType = z.infer<typeof transactionsSchema>;

export const useGetTransactions= () => {
  const params = useSearchParams();
  const from = params.get('from') || '';
  const to = params.get('to') || '';

  const query = useQuery({
    queryKey: ['transactions', { from, to }],
    queryFn: async () => {
      const response = await axios.get("/api/transactions", {
        params: {
          from,
          to,
        }
      });
      if (response.data.error) {
        throw new Error("Failed to fetch transactions");
      }

      return response.data.map((transaction: ResponseType) => ({
        ...transaction,
        category: transaction?.category?.name || '',
        account: transaction?.account?.name || '',
        amount: convertMiliunitsToAmount(transaction.amount)
      }));
    }
  });
  return query;
}