import { authErrors, transactionsErrors } from "@/app/errors";
import { prisma } from "@/lib/db";
import { sendError } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const userId = '1';

  if (!userId) {
    return sendError(authErrors.NOT_AUTHORIZED);
  }

  const { transactions } = await req.json();

  if (transactions.length === 0) {
    return sendError(transactionsErrors.TRANSACTION_DATA_REQUIRED);
  }

  const categories = await prisma.transaction.createMany({
    data: transactions
  });

  return NextResponse.json(categories);
};