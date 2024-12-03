import { authErrors, categoriesErrors } from "@/errors";
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
      return sendError(categoriesErrors.CATEGORIES_IDS_REQUIRED);
    }

    const categories = await prisma.category.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Erro desconhecido' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};