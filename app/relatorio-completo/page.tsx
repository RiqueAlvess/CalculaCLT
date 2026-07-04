import type { Metadata } from "next";
import RelatorioVendaClient from "@/components/relatorio/RelatorioVendaClient";

export const metadata: Metadata = {
  title: "Relatório completo em PDF da sua rescisão ou férias",
  description:
    "Gere o relatório completo do seu cálculo em PDF, pronto para levar ao RH, ao sindicato ou ao seu advogado.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/relatorio-completo" },
};

export default function RelatorioCompletoPage() {
  return <RelatorioVendaClient />;
}
