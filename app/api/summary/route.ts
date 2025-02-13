import { authErrors } from "@/errors";
import { prisma } from "@/lib/db";
import { calculatePercentageChange, fillMissingDays, sendError } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { differenceInDays, parse, subDays } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

async function fetchFinancialData(userId: string, endDate: Date, accountId: string | null) {
    const data = await prisma.transaction.findMany({
      where: {
        AND: [
          ...(accountId ? [{ accountId }] : []),
          { account: { userId: userId } },
          { date: { lte: endDate } },
        ],
      },
      select: {
        amount: true,
        accountId: true,
        date: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return data;
}

async function formatFinancialData(dataFinancial: { amount: bigint, date: Date }[], startDate: Date | undefined, endDate: Date) {
  const data = dataFinancial.filter(transaction => startDate ? transaction.date >= startDate : true && transaction.date <= endDate);

  console.log('data', data);
  
  const income = data.reduce((acc, transaction) => {
    return transaction.amount >= 0 ? acc + Number(transaction.amount) : acc;
  }, 0);

  const expenses = data.reduce((acc, transaction) => {
    return transaction.amount < 0 ? acc + Math.abs(Number(transaction.amount)) : acc;
  }, 0);

  const remaining = income - expenses;

  return [{ income, expenses: -expenses, remaining }];
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const userId = (await supabase.auth.getUser()).data.user?.id;
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

    const periodLength = differenceInDays(endDate, startDate);

    const lastPeriodStart = subDays(startDate, periodLength + 1);
    const lastPeriodEnd = subDays(endDate, periodLength + 1);

    const dataFinancial = await fetchFinancialData(userId, endDate, accountId);

    const [totalPeriod] = await formatFinancialData(dataFinancial, undefined, endDate);

    const [currentPeriod] = await formatFinancialData(dataFinancial, startDate, endDate);

    const [lastPeriod] = await formatFinancialData(dataFinancial, lastPeriodStart, lastPeriodEnd);

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
        value: Math.abs(Number(group._sum.amount) || 0),
      }
    });

    const topCategories = result.slice(0, 3);
    const otherCategories = result.slice(3);
    const otherSum = otherCategories.reduce((acc, category) => acc + category.value, 0);

    const finalCategories = topCategories;
    if (otherCategories.length > 0) {
      finalCategories.push({ name: 'Outros', value: otherSum });
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
      acc[dateKey].income += Number(transaction.amount) >= 0 ? Number(transaction.amount) : 0;
      acc[dateKey].expenses += Number(transaction.amount) < 0 ? Math.abs(Number(transaction.amount)) : 0;
      return acc;
    }, {});

    const resultDays = Object.values(consolidated);

    const days = fillMissingDays(resultDays, startDate, endDate);

    return NextResponse.json({
      data: {
        remainingAmount: currentPeriod.remaining,
        totalRemaining: totalPeriod.remaining,
        remainingChange,
        incomeAmount: currentPeriod.income,
        totalIncome: totalPeriod.income,
        incomeChange,
        expensesAmount: currentPeriod.expenses,
        totalExpenses: totalPeriod.expenses,
        expensesChange,
        categories: finalCategories,
        days
      }
    });
  } catch (error) {
    console.log('[GET SUMMARY]', error);
    return NextResponse.json({ error: 'Erro desconhecido' }, { status: 500 });
  } 
}