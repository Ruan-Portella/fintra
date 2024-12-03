import { authErrors, categoriesErrors } from "@/errors";
import { prisma } from "@/lib/db";
import { sendError } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params: { categoryId } }: { params: { categoryId: string } }) {
  try {
    const supabase = await createClient();
    const userId = (await supabase.auth.getUser()).data.user?.id;

    if (!userId) {
      return sendError(authErrors.NOT_AUTHORIZED);
    }

    if (!categoryId) {
      return sendError(categoriesErrors.CATEGORIES_ID_REQUIRED);
    }

    const categories = await prisma.category.findMany({
      where: {
        userId: userId,
        id: categoryId
      }
    });

    if (!categories.length) {
      return sendError(categoriesErrors.CATEGORIES_NOT_FOUND);
    }

    return NextResponse.json(categories);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Erro desconhecido' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(req: Request, { params: { categoryId } }: { params: { categoryId: string } }) {
  try {
    const supabase = await createClient();
    const userId = (await supabase.auth.getUser()).data.user?.id;

    if (!userId) {
      return sendError(authErrors.NOT_AUTHORIZED);
    }

    if (!categoryId) {
      return sendError(categoriesErrors.CATEGORIES_ID_REQUIRED);
    }

    const { name } = await req.json();

    if (!name) {
      return sendError(categoriesErrors.CATEGORIES_NAME_REQUIRED);
    }

    const category = await prisma.category.findUnique({
      where: {
        userId: userId,
        id: categoryId
      }
    })

    if (!category) {
      return sendError(categoriesErrors.CATEGORIES_NOT_FOUND);
    }

    const updatedCategory = await prisma.category.update({
      where: {
        userId: userId,
        id: categoryId
      },
      data: {
        name
      }
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Erro desconhecido' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(req: Request, { params: { categoryId } }: { params: { categoryId: string } }) {
  try {
    const supabase = await createClient();
    const userId = (await supabase.auth.getUser()).data.user?.id;

    if (!userId) {
      return sendError(authErrors.NOT_AUTHORIZED);
    }

    if (!categoryId) {
      return sendError(categoriesErrors.CATEGORIES_ID_REQUIRED);
    }

    const category = await prisma.category.findUnique({
      where: {
        userId: userId,
        id: categoryId
      }
    })

    if (!category) {
      return sendError(categoriesErrors.CATEGORIES_NOT_FOUND);
    }

    await prisma.category.delete({
      where: {
        userId: userId,
        id: categoryId
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