import { renderToBuffer } from "@react-pdf/renderer";
import RelatorioDocument from "@/lib/pdf/RelatorioDocument";
import type { RelatorioPayload } from "@/lib/relatorio/types";

export async function gerarRelatorioPdfBuffer(payload: RelatorioPayload): Promise<Buffer> {
  return renderToBuffer(<RelatorioDocument payload={payload} />);
}
