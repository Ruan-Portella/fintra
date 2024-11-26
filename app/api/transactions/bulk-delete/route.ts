import { authErrors, transactionsErrors } from "@/errors";
import { prisma } from "@/lib/db";
import { sendError } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const userId = '1';

  if (!userId) {
    return sendError(authErrors.NOT_AUTHORIZED);
  }

  const { ids } = await req.json();

  if (ids.length === 0) {
    return sendError(transactionsErrors.TRANSACTION_IDS_REQUIRED);
  }

  const transaction = await prisma.transaction.deleteMany({
    where: {
      id: {
        in: ids
      }
    }
  });

  return NextResponse.json(transaction);
};