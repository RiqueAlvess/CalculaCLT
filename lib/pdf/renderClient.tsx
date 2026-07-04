"use client";

import { pdf } from "@react-pdf/renderer";
import RelatorioDocument from "@/lib/pdf/RelatorioDocument";
import type { RelatorioPayload } from "@/lib/relatorio/types";

/** Gera o PDF inteiramente no navegador — sem passar por nenhum servidor. */
export async function gerarRelatorioPdfBlob(payload: RelatorioPayload): Promise<Blob> {
  return pdf(<RelatorioDocument payload={payload} />).toBlob();
}
