import { accountErrors, authErrors } from "@/errors";
import { prisma } from "@/lib/db";
import { sendError } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
  const userId = '1';

  if (!userId) {
    return sendError(authErrors.NOT_AUTHORIZED);
  }

  const accounts = await prisma.account.findMany({
    where: {
      userId: userId
    }
  });

  return NextResponse.json(accounts);
}

export async function POST(req: Request) {
  const userId = '1';

  if (!userId) {
    return sendError(authErrors.NOT_AUTHORIZED);
  }

  const { name } = await req.json();

  if (!name) {
    return sendError(accountErrors.ACCOUNT_NAME_REQUIRED);
  }

  const account = await prisma.account.create({
    data: {
      name,
      userId
    }
  });

  return NextResponse.json(account);
};