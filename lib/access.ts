import { timingSafeEqual } from "node:crypto";

export function assertAccessKey(received?: string | null) {
  const expected = process.env.REVITARE_ACCESS_KEY?.trim();

  if (!expected) {
    return;
  }

  const candidate = received?.trim() ?? "";
  const expectedBuffer = Buffer.from(expected);
  const candidateBuffer = Buffer.from(candidate);

  if (
    expectedBuffer.length !== candidateBuffer.length ||
    !timingSafeEqual(expectedBuffer, candidateBuffer)
  ) {
    throw new Error("Chave de acesso inválida.");
  }
}
