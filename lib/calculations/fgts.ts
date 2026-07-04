import { round2 } from "@/lib/format";
import { calendarDiff, mesesPeriodoAquisitivoEmCurso, mesesProporcionaisNoAno } from "@/lib/calculations/tempoServico";

export type TipoRescisao = "sem_justa_causa" | "pedido_demissao" | "acordo_mutuo" | "justa_causa";

export interface FgtsCalculoInput {
  salarioBruto: number;
  dataAdmissao: Date;
  dataDemissao: Date;
  tipoRescisao: TipoRescisao;
  /** Saldo real informado pelo usuário. Se null/undefined, o saldo é estimado. */
  saldoFgtsInformado?: number | null;
}

export interface FgtsCalculoResultado {
  tempoServico: { anos: number; meses: number; dias: number };
  saldoFgtsTotal: number;
  saldoFgtsEstimado: boolean;
  percentualSaque: number;
  fgtsSacavel: number;
  percentualMulta: number;
  multaFgts: number;
  avisoPrevioDias: number;
  avisoPrevioValor: number;
  decimoTerceiroMeses: number;
  decimoTerceiroValor: number;
  feriasProporcionaisMeses: number;
  feriasProporcionaisValor: number;
  tercoConstitucionalValor: number;
  totalEstimado: number;
}

export function calcularFgtsRescisao(input: FgtsCalculoInput): FgtsCalculoResultado {
  const { salarioBruto, dataAdmissao, dataDemissao, tipoRescisao } = input;
  const tempo = calendarDiff(dataAdmissao, dataDemissao);

  const mesesParaFgts = tempo.totalMonthsFloor + (tempo.dias > 0 ? tempo.dias / 30 : 0);
  const saldoFgtsEstimadoCalc = round2(salarioBruto * 0.08 * mesesParaFgts);
  const saldoFgtsEstimado = input.saldoFgtsInformado === null || input.saldoFgtsInformado === undefined;
  const saldoFgtsTotal = saldoFgtsEstimado ? saldoFgtsEstimadoCalc : round2(input.saldoFgtsInformado as number);

  let percentualSaque = 0;
  let percentualMulta = 0;
  if (tipoRescisao === "sem_justa_causa") {
    percentualSaque = 1;
    percentualMulta = 0.4;
  } else if (tipoRescisao === "acordo_mutuo") {
    percentualSaque = 0.8;
    percentualMulta = 0.2;
  }
  const fgtsSacavel = round2(saldoFgtsTotal * percentualSaque);
  const multaFgts = round2(saldoFgtsTotal * percentualMulta);

  const anosCompletos = Math.floor(tempo.totalMonthsFloor / 12);
  const avisoPrevioDiasBase = Math.min(30 + 3 * anosCompletos, 90);
  let avisoPrevioDias = 0;
  if (tipoRescisao === "sem_justa_causa") avisoPrevioDias = avisoPrevioDiasBase;
  else if (tipoRescisao === "acordo_mutuo") avisoPrevioDias = avisoPrevioDiasBase / 2;
  const avisoPrevioValor = round2((salarioBruto / 30) * avisoPrevioDias);

  const temDireitoProporcionais = tipoRescisao !== "justa_causa";

  const decimoTerceiroMeses = temDireitoProporcionais ? mesesProporcionaisNoAno(dataAdmissao, dataDemissao) : 0;
  const decimoTerceiroValor = round2((salarioBruto / 12) * decimoTerceiroMeses);

  const feriasProporcionaisMeses = temDireitoProporcionais
    ? mesesPeriodoAquisitivoEmCurso(dataAdmissao, dataDemissao)
    : 0;
  const feriasProporcionaisValor = round2((salarioBruto / 12) * feriasProporcionaisMeses);
  const tercoConstitucionalValor = round2(feriasProporcionaisValor / 3);

  const totalEstimado = round2(
    fgtsSacavel + multaFgts + avisoPrevioValor + decimoTerceiroValor + feriasProporcionaisValor + tercoConstitucionalValor
  );

  return {
    tempoServico: { anos: tempo.anos, meses: tempo.meses, dias: tempo.dias },
    saldoFgtsTotal,
    saldoFgtsEstimado,
    percentualSaque,
    fgtsSacavel,
    percentualMulta,
    multaFgts,
    avisoPrevioDias,
    avisoPrevioValor,
    decimoTerceiroMeses,
    decimoTerceiroValor,
    feriasProporcionaisMeses,
    feriasProporcionaisValor,
    tercoConstitucionalValor,
    totalEstimado,
  };
}
