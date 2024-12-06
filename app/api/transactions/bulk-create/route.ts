import { authErrors, transactionsErrors } from "@/errors";
import { prisma } from "@/lib/db";
import { sendError } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const userId = (await supabase.auth.getUser()).data.user?.id;

    if (!userId) {
      return sendError(authErrors.NOT_AUTHORIZED);
    }

    const { transactions } = await req.json();

    if (transactions.length === 0) {
      return sendError(transactionsErrors.TRANSACTION_DATA_REQUIRED);
    }

    const transactionsCreated = await prisma.transaction.createMany({
      data: transactions
    });

    return NextResponse.json(transactionsCreated);
  } catch (error) {
    console.log('[BULK CREATE TRANSACTION]', error);
    return NextResponse.json({ error: 'Erro desconhecido' }, { status: 500 });
  } 
};