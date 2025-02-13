import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { convertMiliunitsToAmount } from "@/lib/utils";
import axios from "axios";

const Summary = z.object({
  incomeAmount: z.number(),
  totalIncome: z.number(),
  incomeChange: z.number(),
  expensesAmount: z.number(),
  totalExpenses: z.number(),
  expensesChange: z.number(),
  remainingAmount: z.number(),
  totalRemaining: z.number(),
  remainingChange: z.number(),
  categories: z.array(z.object({
    name: z.string(),
    value: z.number()
  })),
  days: z.array(z.object({
    date: z.string(),
    income: z.number(),
    expenses: z.number()
  }))
});

export type Summary = z.infer<typeof Summary>;

export const useGetSummary = () => {
  const params = useSearchParams();
  const from = params.get('from') || '';
  const to = params.get('to') || '';
  const accountId = params.get('accountId') || '';

  const query = useQuery({
    queryKey: ['summary', { from, to, accountId }],
    queryFn: async () => {	
      const response = await axios.get("/api/summary", {
        params: {
          from,
          to,
          accountId
        }
      });
      if (response.data.error) {
        throw new Error("Failed to fetch summary");
      }

      const data = response.data.data as Summary;

      return {
        ...data,
        incomeAmount: convertMiliunitsToAmount(data.incomeAmount),
        expensesAmount: convertMiliunitsToAmount(data.expensesAmount),
        remainingAmount: convertMiliunitsToAmount(data.remainingAmount),
        totalIncome: convertMiliunitsToAmount(data.totalIncome),
        totalExpenses: convertMiliunitsToAmount(data.totalExpenses),
        totalRemaining: convertMiliunitsToAmount(data.totalRemaining),
        categories: data.categories.map((category) => ({
          ...category,
          value: convertMiliunitsToAmount(category.value)
        })),
        days: data.days.map((day) => ({
          ...day,
          income: convertMiliunitsToAmount(day.income),
          expenses: convertMiliunitsToAmount(day.expenses)
        }))
      }
    },
  });

  return query;
}