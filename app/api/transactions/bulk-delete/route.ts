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
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Erro desconhecido' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};