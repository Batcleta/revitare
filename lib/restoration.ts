import { GoogleGenAI } from "@google/genai";

export type RestorationMode = "faithful" | "detail";

function buildPrompt(mode: RestorationMode) {
  const detailInstruction =
    mode === "detail"
      ? "Recover additional damaged detail only when it can be inferred conservatively from the source. If information is genuinely missing, prefer a subtle plausible reconstruction rather than redesigning the scene."
      : "Use a conservation-first approach. Change as little as possible outside clearly damaged areas. If information is missing and cannot be supported by the source, keep the reconstruction subtle and restrained.";

  return [
    "Restore this old photograph from the supplied image.",
    "",
    "PRIMARY GOAL:",
    "Produce a clean, natural restoration while preserving the identity of every person and the historical character of the original photograph.",
    "",
    "PRESERVE EXACTLY:",
    "- number and position of people",
    "- recognizable facial traits and facial proportions",
    "- apparent age and expression",
    "- head orientation, pose and body proportions",
    "- hairstyle geometry",
    "- clothing shape, patterns and accessories",
    "- handwritten or printed text",
    "- background geometry and important objects",
    "- original framing, crop and aspect ratio",
    "- black-and-white appearance when the source is black-and-white",
    "",
    "REPAIR WHEN PRESENT:",
    "- scratches",
    "- dust",
    "- faded contrast",
    "- minor stains",
    "- creases",
    "- mild blur and low-detail degradation",
    "- small damaged or missing regions",
    "",
    "DO NOT:",
    "- beautify faces",
    "- change eye shape, nose, mouth or jaw",
    "- make people younger or older",
    "- add teeth, jewelry, hair, clothing details or objects that are not supported by the source",
    "- modernize the scene",
    "- colorize a black-and-white image",
    "- change composition or camera angle",
    "- add decorative borders or text",
    "",
    detailInstruction,
    "",
    "Return only the restored photograph as an image.",
  ].join("\n");
}

export async function restoreWithGemini(input: {
  bytes: Buffer;
  mimeType: string;
  mode: RestorationMode;
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY não configurada.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model =
    process.env.GEMINI_IMAGE_MODEL?.trim() || "gemini-3.1-flash-image";

  const interaction = await ai.interactions.create({
    model,
    input: [
      {
        type: "image",
        mime_type: input.mimeType,
        data: input.bytes.toString("base64"),
      },
      {
        type: "text",
        text: buildPrompt(input.mode),
      },
    ],
    response_format: {
      type: "image",
      image_size: "2K",
    },
  });

  const generatedImage = interaction.output_image;

  if (!generatedImage?.data) {
    throw new Error("O modelo não retornou uma imagem restaurada.");
  }

  const mimeType =
    "mime_type" in generatedImage && typeof generatedImage.mime_type === "string"
      ? generatedImage.mime_type
      : "image/png";

  return {
    bytes: Buffer.from(generatedImage.data, "base64"),
    mimeType,
    model,
  };
}
