import type { Metadata } from "next";
import ObrigadoClient from "@/components/relatorio/ObrigadoClient";

export const metadata: Metadata = {
  title: "Obrigado pela compra",
  description: "Seu relatório CalculaCLT está sendo preparado.",
  robots: { index: false, follow: false },
};

export default function ObrigadoPage() {
  return <ObrigadoClient />;
}
