import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Calculadora de FGTS, Rescisão e Férias CLT Online Grátis`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Calcule grátis e em segundos sua rescisão trabalhista: FGTS + multa de 40%, aviso prévio, 13º e férias proporcionais CLT.",
  applicationName: SITE_NAME,
  manifest: "/manifest.json",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: `${SITE_NAME} — Calculadoras Trabalhistas CLT Online Grátis`,
    description:
      "Ferramentas gratuitas para calcular FGTS, multa rescisória e férias proporcionais em segundos, direto do celular.",
  },
  twitter: {
    card: "summary",
    title: `${SITE_NAME} — Calculadoras Trabalhistas CLT Online Grátis`,
    description:
      "Calcule FGTS, multa rescisória e férias proporcionais gratuitamente, com resultado instantâneo.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3366ff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
