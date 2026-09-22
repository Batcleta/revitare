import {
  del,
  get,
  issueSignedToken,
  presignUrl,
  put,
} from "@vercel/blob";
import { NextResponse } from "next/server";

import { assertAccessKey } from "@/lib/access";
import {
  restoreWithGemini,
  type RestorationMode,
} from "@/lib/restoration";

export const runtime = "nodejs";
export const maxDuration = 300;

type RestoreBody = {
  pathname?: string;
  originalName?: string;
  mode?: RestorationMode;
};

function safeBaseName(value: string) {
  return (
    value
      .replace(/\.[^/.]+$/, "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9-_]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 70) || "foto"
  );
}

function extensionFor(mimeType: string) {
  if (mimeType.includes("jpeg") || mimeType.includes("jpg")) return "jpg";
  if (mimeType.includes("webp")) return "webp";
  return "png";
}

export async function POST(request: Request) {
  let sourcePathname: string | undefined;

  try {
    assertAccessKey(request.headers.get("x-revitare-access"));

    const body = (await request.json()) as RestoreBody;
    sourcePathname = body.pathname;

    if (!sourcePathname?.startsWith("revitare/uploads/")) {
      return NextResponse.json(
        { error: "Imagem de origem inválida." },
        { status: 400 },
      );
    }

    const mode: RestorationMode =
      body.mode === "detail" ? "detail" : "faithful";

    const source = await get(sourcePathname, { access: "private" });

    if (!source || source.statusCode !== 200 || !source.stream) {
      throw new Error("Não foi possível abrir a imagem original.");
    }

    const sourceBuffer = Buffer.from(
      await new Response(source.stream).arrayBuffer(),
    );

    const restored = await restoreWithGemini({
      bytes: sourceBuffer,
      mimeType: source.blob.contentType || "image/jpeg",
      mode,
    });

    const baseName = safeBaseName(body.originalName || source.blob.pathname);
    const extension = extensionFor(restored.mimeType);
    const resultPathname = `revitare/results/${crypto.randomUUID()}-${baseName}.${extension}`;

    const stored = await put(resultPathname, restored.bytes, {
      access: "private",
      contentType: restored.mimeType,
      addRandomSuffix: false,
    });

    const validUntil = Date.now() + 2 * 60 * 60 * 1000;
    const signedToken = await issueSignedToken({
      pathname: stored.pathname,
      operations: ["get"],
      validUntil,
    });

    const { presignedUrl } = await presignUrl(signedToken, {
      pathname: stored.pathname,
      operation: "get",
      validUntil,
    });

    return NextResponse.json({
      pathname: stored.pathname,
      url: presignedUrl,
      model: restored.model,
      mimeType: restored.mimeType,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Falha ao restaurar a foto.",
      },
      { status: 500 },
    );
  } finally {
    if (sourcePathname?.startsWith("revitare/uploads/")) {
      try {
        await del(sourcePathname);
      } catch {
        // Input cleanup is best-effort. A later retention job can clean leftovers.
      }
    }
  }
}
