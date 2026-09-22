import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Revitare — restauração fiel de fotografias",
  description:
    "Restaure fotografias antigas em uma fila simples, preservando a identidade e o caráter da imagem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
