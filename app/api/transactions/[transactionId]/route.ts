import { authErrors, transactionsErrors } from "@/errors";
import { prisma } from "@/lib/db";
import { sendError } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Response, { params: { transactionId } }: { params: { transactionId: string } }) {
  try {
    const supabase = await createClient();
    const userId = (await supabase.auth.getUser()).data.user?.id;

    if (!userId) {
      return sendError(authErrors.NOT_AUTHORIZED);
    }

    if (!transactionId) {
      return sendError(transactionsErrors.TRANSACTION_ID_REQUIRED);
    }

    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        account: { userId: userId },
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
    });

    if (!transaction) {
      return sendError(transactionsErrors.TRANSACTION_NOT_FOUND);
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Erro desconhecido' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(req: Response, { params: { transactionId } }: { params: { transactionId: string } }) {
  try {
    const supabase = await createClient();
    const userId = (await supabase.auth.getUser()).data.user?.id;

    if (!userId) {
      return sendError(authErrors.NOT_AUTHORIZED);
    }

    if (!transactionId) {
      return sendError(transactionsErrors.TRANSACTION_ID_REQUIRED);
    }

    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        account: { userId: userId },
      },
    });

    if (!transaction) {
      return sendError(transactionsErrors.TRANSACTION_NOT_FOUND);
    }

    const { accountId, categoryId, payee, amount, description, date } = await req.json();

    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        account: { connect: { id: accountId } },
        category: { connect: { id: categoryId } },
        payee,
        amount,
        description,
        date,
      },
    });

    return NextResponse.json(updatedTransaction);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Erro desconhecido' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(req: Request, { params: { transactionId } }: { params: { transactionId: string } }) {
  try {
    const supabase = await createClient();
    const userId = (await supabase.auth.getUser()).data.user?.id;

    if (!userId) {
      return sendError(authErrors.NOT_AUTHORIZED);
    }

    if (!transactionId) {
      return sendError(transactionsErrors.TRANSACTION_ID_REQUIRED);
    }

    const transaction = await prisma.transaction.findUnique({
      where: {
        id: transactionId
      }
    })

    if (!transaction) {
      return sendError(transactionsErrors.TRANSACTION_NOT_FOUND);
    }

    await prisma.transaction.delete({
      where: {
        id: transactionId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Erro desconhecido' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};