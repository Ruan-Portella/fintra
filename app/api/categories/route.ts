import { authErrors, categoriesErrors } from "@/errors";
import { prisma } from "@/lib/db";
import { sendError } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const userId = (await supabase.auth.getUser()).data.user?.id;

    if (!userId) {
      return sendError(authErrors.NOT_AUTHORIZED);
    }

    const categories = await prisma.category.findMany({
      where: {
        userId: userId
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Erro desconhecido' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const userId = (await supabase.auth.getUser()).data.user?.id;

    if (!userId) {
      return sendError(authErrors.NOT_AUTHORIZED);
    }

    const { name } = await req.json();

    if (!name) {
      return sendError(categoriesErrors.CATEGORIES_NAME_REQUIRED);
    }

    const category = await prisma.category.create({
      data: {
        name,
        userId
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Erro desconhecido' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};