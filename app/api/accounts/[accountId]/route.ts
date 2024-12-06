import { authErrors, accountErrors } from "@/errors";
import { prisma } from "@/lib/db";
import { sendError } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params: { accountId } }: { params: { accountId: string } }) {
  try {
    const supabase = await createClient();
    const userId = (await supabase.auth.getUser()).data.user?.id;

    if (!userId) {
      return sendError(authErrors.NOT_AUTHORIZED);
    }

    if (!accountId) {
      return sendError(accountErrors.ACCOUNT_ID_REQUIRED);
    }

    const accounts = await prisma.account.findMany({
      where: {
        userId: userId,
        id: accountId
      }
    });

    if (!accounts.length) {
      return sendError(accountErrors.ACCOUNT_NOT_FOUND);
    }

    return NextResponse.json(accounts);
  } catch (error) {
    console.log('[GET ACCOUNT]', error);
    return NextResponse.json({ error: 'Erro desconhecido' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params: { accountId } }: { params: { accountId: string } }) {
  try {
    const supabase = await createClient();
    const userId = (await supabase.auth.getUser()).data.user?.id;

    if (!userId) {
      return sendError(authErrors.NOT_AUTHORIZED);
    }

    if (!accountId) {
      return sendError(accountErrors.ACCOUNT_ID_REQUIRED);
    }

    const { name } = await req.json();

    if (!name) {
      return sendError(accountErrors.ACCOUNT_NAME_REQUIRED);
    }

    const account = await prisma.account.findUnique({
      where: {
        userId: userId,
        id: accountId
      }
    })

    if (!account) {
      return sendError(accountErrors.ACCOUNT_NOT_FOUND);
    }

    const updatedAccount = await prisma.account.update({
      where: {
        userId: userId,
        id: accountId
      },
      data: {
        name
      }
    });

    return NextResponse.json(updatedAccount);
  } catch (error) {
    console.log('[PATCH ACCOUNT]', error);
    return NextResponse.json({ error: 'Erro desconhecido' }, { status: 500 });
  } 
}

export async function DELETE(req: Request, { params: { accountId } }: { params: { accountId: string } }) {
  try {
    const supabase = await createClient();
    const userId = (await supabase.auth.getUser()).data.user?.id;

    if (!userId) {
      return sendError(authErrors.NOT_AUTHORIZED);
    }

    if (!accountId) {
      return sendError(accountErrors.ACCOUNT_ID_REQUIRED);
    }

    const account = await prisma.account.findUnique({
      where: {
        userId: userId,
        id: accountId
      }
    })

    if (!account) {
      return sendError(accountErrors.ACCOUNT_NOT_FOUND);
    }

    await prisma.account.delete({
      where: {
        userId: userId,
        id: accountId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log('[DELETE ACCOUNT]', error);
    return NextResponse.json({ error: 'Erro desconhecido' }, { status: 500 });
  } 
};