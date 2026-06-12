import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
import "./globals.css";

/* Fontes da marca via next/font (self-hosted no build, zero request externo).
   As CSS vars alimentam o @theme do globals.css. */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zenaxis.com.br"),
  title: {
    default: "Zenaxis. Sites e soluções digitais que dão resultado",
    template: "%s · Zenaxis",
  },
  description:
    "Não entrego só site. Entrego presença online que gera cliente: design distintivo, automação e IA sob medida para o seu negócio.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Zenaxis",
    title: "Zenaxis. Sites e soluções digitais que dão resultado",
    description:
      "Não entrego só site. Entrego presença online que gera cliente: design distintivo, automação e IA sob medida.",
  },
  twitter: {
    card: "summary_large_image",
  },
};

/* O Header entra pelos layouts de rota (variante completa no home,
   variante voltar na cotação). Cada um abre o <main> landmark. */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${hanken.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <Footer />
      </body>
    </html>
  );
}
