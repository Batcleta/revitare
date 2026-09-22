import { del } from "@vercel/blob";
import { NextResponse } from "next/server";

import { assertAccessKey } from "@/lib/access";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    assertAccessKey(request.headers.get("x-revitare-access"));

    const body = (await request.json()) as { pathname?: string };

    if (!body.pathname?.startsWith("revitare/results/")) {
      return NextResponse.json(
        { error: "Resultado inválido." },
        { status: 400 },
      );
    }

    await del(body.pathname);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Falha ao excluir resultado.",
      },
      { status: 400 },
    );
  }
}
