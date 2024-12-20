import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { sendError } from "@/lib/utils";
import { authErrors } from "@/errors";

export async function POST() {
  try {
    const supabase = await createClient();
    const userId = (await supabase.auth.getUser()).data.user?.id;

    if (!userId) {
      return sendError(authErrors.NOT_AUTHORIZED);
    }

    const currentDate = new Date();

    const transactionsToUpdate = await prisma.transaction.findMany({
      where: {
        statusId: {
          in: ['cd38c215-e126-4141-a92b-1227ae38fe14']
        },
        date: {
          lt: currentDate
        }
      },
      orderBy: {
        date: 'desc',
      },
    });

    if (transactionsToUpdate.length === 0) {
      return NextResponse.json('Nenhuma transação para atualizar.', { status: 200 })
    }

    const updatePromises = transactionsToUpdate.map((transaction) =>
      prisma.transaction.update({
        where: { id: transaction.id },
        data: { statusId: 'd0618e3f-805d-4252-8fcb-53ce58bce469' },
      })
    );

    await Promise.all(updatePromises);

    return NextResponse.json(`${transactionsToUpdate.length} transações atualizadas com sucesso.`, { status: 200 });
  } catch (error) {
    console.log('[UPDATED TRANSACTION DATE]', error);
    return NextResponse.json({ error: 'Erro desconhecido' }, { status: 500 });
  }
}