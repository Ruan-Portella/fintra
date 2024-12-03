import { accountErrors, authErrors, categoriesErrors, transactionsErrors } from "@/errors";
import { prisma } from "@/lib/db";
import { sendError } from "@/lib/utils";
import { parse, subDays } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

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

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const userId = (await supabase.auth.getUser()).data.user?.id;

    if (!userId) {
      return sendError(authErrors.NOT_AUTHORIZED);
    }

    const { accountId, categoryId, amount, date, payee, description } = await req.json();

    if (!accountId) {
      return sendError(accountErrors.ACCOUNT_ID_REQUIRED);
    }

    if (!categoryId) {
      return sendError(categoriesErrors.CATEGORIES_ID_REQUIRED);
    }

    if (!amount || !date || !payee) {
      return sendError(transactionsErrors.TRANSACTION_DATA_REQUIRED);
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