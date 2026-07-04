import type { FgtsCalculoResultado, TipoRescisao } from "@/lib/calculations/fgts";
import type { FeriasCalculoResultado } from "@/lib/calculations/ferias";

export interface RelatorioPayloadFgts {
  tipo: "fgts";
  input: {
    salarioBruto: number;
    dataAdmissao: string;
    dataDemissao: string;
    tipoRescisao: TipoRescisao;
    saldoFgtsInformado: number | null;
  };
  resultado: FgtsCalculoResultado;
}

export interface RelatorioPayloadFerias {
  tipo: "ferias";
  input: {
    salarioBruto: number;
    dataAdmissao: string;
    dataReferencia: string;
    jaTirouFerias: boolean;
    venderAbono: boolean;
  };
  resultado: FeriasCalculoResultado;
}

export type RelatorioPayload = RelatorioPayloadFgts | RelatorioPayloadFerias;

export function totalEstimadoDoPayload(payload: RelatorioPayload): number {
  return payload.resultado.totalEstimado;
}
