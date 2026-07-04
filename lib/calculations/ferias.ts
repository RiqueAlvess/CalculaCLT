import { round2 } from "@/lib/format";
import { mesesPeriodoAquisitivoEmCurso } from "@/lib/calculations/tempoServico";

export interface FeriasCalculoInput {
  salarioBruto: number;
  dataAdmissao: Date;
  dataReferencia: Date;
  jaTirouFerias: boolean;
  venderAbono: boolean;
}

export interface FeriasCalculoResultado {
  mesesAvos: number;
  diasProporcionais: number;
  feriasJaGozadas: boolean;
  valorFeriasGozo: number;
  tercoSobreGozo: number;
  diasAbono: number;
  valorAbono: number;
  tercoSobreAbono: number;
  totalEstimado: number;
}

export function calcularFeriasProporcionais(input: FeriasCalculoInput): FeriasCalculoResultado {
  const { salarioBruto, dataAdmissao, dataReferencia, jaTirouFerias, venderAbono } = input;

  const mesesAvos = mesesPeriodoAquisitivoEmCurso(dataAdmissao, dataReferencia);
  const diasProporcionais = Math.round(mesesAvos * 2.5);

  if (jaTirouFerias) {
    return {
      mesesAvos,
      diasProporcionais: 0,
      feriasJaGozadas: true,
      valorFeriasGozo: 0,
      tercoSobreGozo: 0,
      diasAbono: 0,
      valorAbono: 0,
      tercoSobreAbono: 0,
      totalEstimado: 0,
    };
  }

  const valorFeriasCheias = (salarioBruto / 12) * mesesAvos;

  const fracaoAbono = venderAbono ? 1 / 3 : 0;
  const valorAbono = round2(valorFeriasCheias * fracaoAbono);
  const tercoSobreAbono = round2(valorAbono / 3);

  const valorFeriasGozo = round2(valorFeriasCheias * (1 - fracaoAbono));
  const tercoSobreGozo = round2(valorFeriasGozo / 3);

  const diasAbono = venderAbono ? Math.round(diasProporcionais / 3) : 0;

  const totalEstimado = round2(valorFeriasGozo + tercoSobreGozo + valorAbono + tercoSobreAbono);

  return {
    mesesAvos,
    diasProporcionais,
    feriasJaGozadas: false,
    valorFeriasGozo,
    tercoSobreGozo,
    diasAbono,
    valorAbono,
    tercoSobreAbono,
    totalEstimado,
  };
}
