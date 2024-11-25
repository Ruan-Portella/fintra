import { accountErrors, authErrors } from "@/app/errors";
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
    return sendError(accountErrors.ACCOUNT_IDS_REQUIRED);
  }

  const accounts = await prisma.account.deleteMany({
    where: {
      id: {
        in: ids
      }
    }
  });

  return NextResponse.json(accounts);
};