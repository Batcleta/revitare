import {
  handleUpload,
  type HandleUploadBody,
} from "@vercel/blob/client";
import { NextResponse } from "next/server";

import { assertAccessKey } from "@/lib/access";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const payload = clientPayload
          ? (JSON.parse(clientPayload) as { accessKey?: string })
          : {};

        assertAccessKey(payload.accessKey);

        if (!pathname.startsWith("revitare/uploads/")) {
          throw new Error("Caminho de upload inválido.");
        }

        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp"],
          maximumSizeInBytes: 20 * 1024 * 1024,
          addRandomSuffix: false,
          tokenPayload: JSON.stringify({ kind: "revitare-photo" }),
        };
      },
      onUploadCompleted: async () => {
        // No database in the MVP. The restoration request owns the lifecycle.
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Falha ao autorizar upload.",
      },
      { status: 400 },
    );
  }
}
