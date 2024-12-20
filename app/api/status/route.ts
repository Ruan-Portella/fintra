import { authErrors } from "@/errors";
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

    const status = await prisma.status.findMany();

    return NextResponse.json(status);
  } catch (error) {
    console.log('[GET STATUS]', error);
    return NextResponse.json({ error: 'Erro desconhecido' }, { status: 500 });
  } 
}