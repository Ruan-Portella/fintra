import { authErrors, categoriesErrors } from "@/errors";
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
};