import { accountErrors, authErrors, categoriesErrors, transactionsErrors } from "@/errors";
import { prisma } from "@/lib/db";
import { sendError } from "@/lib/utils";
import { parse, subDays } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { ApiFormValues } from "@/services/transactions/components/transaction-form";
import { randomUUID } from "crypto";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const userId = (await supabase.auth.getUser()).data.user?.id;

    const searchParams = req.nextUrl.searchParams

    if (!userId) {
      return sendError(authErrors.NOT_AUTHORIZED);
    }

    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const accountId = searchParams.get('accountId');

    const defaultTo = new Date();
    const defaultFrom = subDays(defaultTo, 30);

    const startDate = from ? parse(from, 'yyyy-MM-dd', new Date()) : defaultFrom;
    const endDate = to ? parse(to, 'yyyy-MM-dd', new Date()) : defaultTo;

    const data = await prisma.transaction.findMany({
      where: {
        AND: [
          ...(accountId ? [{ accountId }] : []),
          { account: { userId: userId } },
          { date: { gte: startDate, lte: endDate } },
        ],
      },
      select: {
        id: true,
        category: { select: { name: true, id: true } },
        payee: true,
        amount: true,
        description: true,
        account: { select: { name: true, id: true } },
        date: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Erro desconhecido' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

const generateRecurringTransactions = (transaction: ApiFormValues) => {
  const { date, recurrenceType, recurrenceInterval } = transaction;
  const transactions = [];
  let index = 0;

  if (!recurrenceType || !recurrenceInterval) {
    return [transaction];
  }

  let nextDate = new Date(date);

  while (index <= recurrenceInterval) {
    const newTransaction = {
      ...transaction,
      id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      date: new Date(nextDate),
    };
    transactions.push(newTransaction);

    switch (recurrenceType) {
      case 'DAILY':
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'YEARLY':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
      default:
        throw new Error('Invalid recurrence type');
    }

    index++;
  }
  return transactions;
};

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const userId = (await supabase.auth.getUser()).data.user?.id;
   
    if (!userId) {
      return sendError(authErrors.NOT_AUTHORIZED);
    }

    const { accountId, categoryId, amount, date, payee, description, has_recurrence, ...props } = await req.json();

    if (!accountId) {
      return sendError(accountErrors.ACCOUNT_ID_REQUIRED);
    }

    if (!categoryId) {
      return sendError(categoriesErrors.CATEGORIES_ID_REQUIRED);
    }

    if (!amount || !date || !payee) {
      return sendError(transactionsErrors.TRANSACTION_DATA_REQUIRED);
    }

    if (has_recurrence) {
      const recurringTransactions = generateRecurringTransactions({
        accountId,
        categoryId,
        amount,
        date,
        payee,
        description,
        has_recurrence,
        ...props
      });

      const uuid = randomUUID()
    
      const data = await prisma.transaction.createMany({
        data: recurringTransactions.map((transaction: {
          accountId: string;
          categoryId: string;
          amount: string;
          date: Date;
          payee: string;
          description: string
        }) => ({
          ...transaction,
          amount: Number(transaction.amount),
          recurrenceDad: uuid,
        })),
      });

      return NextResponse.json(data);
    }

    const data = await prisma.transaction.create({
      data: {
        accountId,
        categoryId,
        amount,
        date,
        payee,
        description, 
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Erro desconhecido' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}