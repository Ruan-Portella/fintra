import { authErrors } from "@/errors";
import { prisma } from "@/lib/db";
import { calculatePercentageChange, fillMissingDays, sendError } from "@/lib/utils";
import { differenceInDays, parse, subDays } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = '1';
  const searchParams = req.nextUrl.searchParams

  if (!userId) {
    return sendError(authErrors.NOT_AUTHORIZED)
  }

  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const accountId = searchParams.get('accountId');

  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  const startDate = from ? parse(from, 'yyyy-MM-dd', new Date()) : defaultFrom;
  const endDate = to ? parse(to, 'yyyy-MM-dd', new Date()) : defaultTo;

  const periodLength = differenceInDays(endDate, startDate) + 1;

  const lastPeriodStart = subDays(startDate, periodLength);
  const lastPeriodEnd = subDays(endDate, periodLength);

  async function fetchFinancialData(userId: string, startDate: Date, endDate: Date, accountId?: string) {
    const data = await prisma.transaction.findMany({
      where: {
        AND: [
          ...(accountId ? [{ accountId }] : []),
          { account: { userId: userId } },
          { date: { gte: startDate, lte: endDate } },
        ],
      },
      select: {
        amount: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    const income = data.reduce((acc, transaction) => {
      return transaction.amount >= 0 ? acc + transaction.amount : acc;
    }, 0);

    const expenses = data.reduce((acc, transaction) => {
      return transaction.amount < 0 ? acc + Math.abs(transaction.amount) : acc;
    }, 0);

    const remaining = income - expenses;

    return [{ income, expenses: -expenses, remaining }];
  }

  const [currentPeriod] = await fetchFinancialData(userId, startDate, endDate);

  const [lastPeriod] = await fetchFinancialData(userId, lastPeriodStart, lastPeriodEnd);

  const incomeChange = calculatePercentageChange(currentPeriod.income, lastPeriod.income);
  const expensesChange = calculatePercentageChange(currentPeriod.expenses, lastPeriod.expenses);
  const remainingChange = calculatePercentageChange(currentPeriod.remaining, lastPeriod.remaining);

  const category = await prisma.transaction.groupBy({
    by: ['categoryId'],
    where: {
      AND: [
        ...(accountId ? [{ accountId }] : []),
        { account: { userId: userId } },
        { amount: { lt: 0 } },
        { date: { gte: startDate, lte: endDate } },
      ],
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: {
        amount: 'asc',
      },
    },
  });

  const allCategories = await prisma.category.findMany({
    where: {
      userId: userId,
    },
  });

  const result = category.map(group => {
    const categoryName = allCategories.find(category => category.id === group.categoryId);
    return {
      name: categoryName ? categoryName.name : null,
      value: Math.abs(group._sum.amount || 0),
    }
  });

  const topCategories = result.slice(0, 3);
  const otherCategories = result.slice(3);
  const otherSum = otherCategories.reduce((acc, category) => acc + category.value, 0);

  const finalCategories = topCategories;
  if (otherCategories.length > 0) {
    finalCategories.push({ name: 'Other', value: otherSum });
  }

  const data = await prisma.transaction.findMany({
    where: {
      AND: [
        ...(accountId ? [{ accountId }] : []),
        { account: { userId: userId } },
        { date: { gte: startDate, lte: endDate } },
      ],
    },
    select: {
      amount: true,
      date: true,
    },
    orderBy: {
      date: 'desc',
    },
  });
  
  const consolidated = data.reduce<{ [key: string]: { date: Date; income: number; expenses: number } }>((acc, transaction) => {
    const dateKey = transaction.date.toISOString().split("T")[0];
    if (!acc[dateKey]) {
      acc[dateKey] = { date: transaction.date, income: 0, expenses: 0 };
    }
    acc[dateKey].income += transaction.amount >= 0 ? transaction.amount : 0;
    acc[dateKey].expenses += transaction.amount < 0 ? Math.abs(transaction.amount) : 0;
    return acc;
  }, {});
  
  const resultDays = Object.values(consolidated);

  const days = fillMissingDays(resultDays, startDate, endDate);

  return NextResponse.json({
    data: {
      remainingAmount: currentPeriod.remaining,
      remainingChange,
      incomeAmount: currentPeriod.income,
      incomeChange,
      expensesAmount: currentPeriod.expenses,
      expensesChange,
      categories: finalCategories,
      days
    }
  })
}