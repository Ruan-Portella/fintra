import { authErrors, categoriesErrors } from "@/errors";
import { prisma } from "@/lib/db";
import { sendError } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
  const userId = '1';

  if (!userId) {
    return sendError(authErrors.NOT_AUTHORIZED);
  }

  const categories = await prisma.category.findMany({
    where: {
      userId: userId
    }
  });

  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const userId = '1';

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
};