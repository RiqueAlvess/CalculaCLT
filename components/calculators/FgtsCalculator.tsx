"use client";

import { useState } from "react";
import { DateInput, MoneyInput, RadioCardGroup, ResultRow, SubmitCta, ToggleYesNo } from "@/components/calculators/fields";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import ShareButton from "@/components/ShareButton";
import AdSlot from "@/components/AdSlot";
import { IconAlert, IconBanknote, IconCalendar, IconGift, IconSun, IconWallet } from "@/components/icons";
import { calcularFgtsRescisao, type TipoRescisao } from "@/lib/calculations/fgts";
import { formatBRL, parseInputDate } from "@/lib/format";

const TIPO_OPTIONS: { value: TipoRescisao; label: string; description: string }[] = [
  { value: "sem_justa_causa", label: "Sem justa causa", description: "Demissão pelo empregador" },
  { value: "pedido_demissao", label: "Pedido de demissão", description: "Você pediu para sair" },
  { value: "acordo_mutuo", label: "Acordo mútuo", description: "Distrato (art. 484-A)" },
  { value: "justa_causa", label: "Justa causa", description: "Demissão por justa causa" },
];

function todayInputValue(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function FgtsCalculator() {
  const [salario, setSalario] = useState(0);
  const [admissao, setAdmissao] = useState("");
  const [demissao, setDemissao] = useState(todayInputValue());
  const [tipo, setTipo] = useState<TipoRescisao>("sem_justa_causa");
  const [naoSeiSaldo, setNaoSeiSaldo] = useState(true);
  const [saldoInformado, setSaldoInformado] = useState(0);
  const [resultado, setResultado] = useState<ReturnType<typeof calcularFgtsRescisao> | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    const dataAdmissao = parseInputDate(admissao);
    const dataDemissao = parseInputDate(demissao);

    if (!dataAdmissao || !dataDemissao) {
      setErro("Preencha as datas de admissão e demissão.");
      setResultado(null);
      return;
    }
    if (dataDemissao <= dataAdmissao) {
      setErro("A data de demissão precisa ser depois da data de admissão.");
      setResultado(null);
      return;
    }
    if (salario <= 0) {
      setErro("Informe o salário bruto.");
      setResultado(null);
      return;
    }

    const r = calcularFgtsRescisao({
      salarioBruto: salario,
      dataAdmissao,
      dataDemissao,
      tipoRescisao: tipo,
      saldoFgtsInformado: naoSeiSaldo ? null : saldoInformado,
    });
    setResultado(r);
  }

  function buildShareText(): string {
    if (!resultado) return "";
    return [
      "Simulação de rescisão — CalculaCLT",
      `Saldo FGTS sacável: ${formatBRL(resultado.fgtsSacavel)}`,
      `Multa rescisória: ${formatBRL(resultado.multaFgts)}`,
      `Aviso prévio: ${formatBRL(resultado.avisoPrevioValor)}`,
      `13º proporcional: ${formatBRL(resultado.decimoTerceiroValor)}`,
      `Férias proporcionais + 1/3: ${formatBRL(resultado.feriasProporcionaisValor + resultado.tercoConstitucionalValor)}`,
      `Total estimado: ${formatBRL(resultado.totalEstimado)}`,
      "Simule também em calculaclt.com.br",
    ].join("\n");
  }

  return (
    <div className="space-y-6">
      <form
        id="fgts-form"
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 pb-28 shadow-card sm:p-6"
      >
        <MoneyInput id="salario" label="Salário bruto atual" value={salario} onChange={setSalario} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DateInput id="admissao" label="Data de admissão" value={admissao} onChange={setAdmissao} max={demissao || undefined} />
          <div>
            <DateInput id="demissao" label="Data de demissão" value={demissao} onChange={setDemissao} min={admissao || undefined} />
            <button
              type="button"
              onClick={() => setDemissao(todayInputValue())}
              className="mt-1.5 text-xs font-semibold text-brand-600 hover:underline"
            >
              Usar data de hoje
            </button>
          </div>
        </div>

        <RadioCardGroup
          label="Tipo de rescisão"
          name="tipo-rescisao"
          value={tipo}
          onChange={setTipo}
          options={TIPO_OPTIONS}
        />

        <ToggleYesNo
          label="Você sabe o saldo atual do FGTS na conta?"
          name="sabe-saldo"
          value={!naoSeiSaldo}
          onChange={(sabe) => setNaoSeiSaldo(!sabe)}
        />

        {!naoSeiSaldo && (
          <MoneyInput
            id="saldo-fgts"
            label="Saldo atual do FGTS"
            value={saldoInformado}
            onChange={setSaldoInformado}
            helperText="Consulte no app FGTS ou extrato da Caixa."
          />
        )}
        {naoSeiSaldo && (
          <p className="-mt-2 text-xs text-slate-500">
            Sem problema: vamos estimar o saldo com base em 8% do salário por mês trabalhado.
          </p>
        )}

        {erro && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{erro}</p>
        )}

        <SubmitCta formId="fgts-form" label="Calcular agora" />
      </form>

      {resultado && (
        <div className="animate-fade-in-up space-y-4">
          <div className="rounded-2xl bg-gradient-to-br from-money-600 to-money-700 p-6 text-white shadow-result sm:p-8">
            <p className="text-sm font-medium text-money-100">Total estimado a receber</p>
            <p className="mt-1 text-4xl font-extrabold tracking-tight sm:text-5xl">
              {formatBRL(resultado.totalEstimado)}
            </p>
            <p className="mt-3 text-xs text-money-100">
              Tempo de serviço considerado: {resultado.tempoServico.anos} ano(s), {resultado.tempoServico.meses} mês(es) e{" "}
              {resultado.tempoServico.dias} dia(s).
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">Detalhamento do cálculo</h3>
            <div className="mt-2 divide-y divide-slate-100">
              <ResultRow
                icon={<IconWallet />}
                label="FGTS sacável agora"
                hint={
                  resultado.saldoFgtsEstimado
                    ? `Saldo total estimado: ${formatBRL(resultado.saldoFgtsTotal)} (8% a.m.)`
                    : `${Math.round(resultado.percentualSaque * 100)}% do saldo de ${formatBRL(resultado.saldoFgtsTotal)}`
                }
                value={formatBRL(resultado.fgtsSacavel)}
                emphasis
              />
              <ResultRow
                icon={<IconAlert />}
                label="Multa rescisória"
                hint={`${Math.round(resultado.percentualMulta * 100)}% sobre o saldo do FGTS`}
                value={formatBRL(resultado.multaFgts)}
              />
              <ResultRow
                icon={<IconCalendar />}
                label="Aviso prévio indenizado"
                hint={`${resultado.avisoPrevioDias} dia(s)`}
                value={formatBRL(resultado.avisoPrevioValor)}
              />
              <ResultRow
                icon={<IconGift />}
                label="13º salário proporcional"
                hint={`${resultado.decimoTerceiroMeses}/12 avos`}
                value={formatBRL(resultado.decimoTerceiroValor)}
              />
              <ResultRow
                icon={<IconSun />}
                label="Férias proporcionais"
                hint={`${resultado.feriasProporcionaisMeses}/12 avos`}
                value={formatBRL(resultado.feriasProporcionaisValor)}
              />
              <ResultRow
                icon={<IconBanknote />}
                label="1/3 constitucional sobre férias"
                value={formatBRL(resultado.tercoConstitucionalValor)}
              />
            </div>
          </div>

          <DisclaimerBanner />

          <ShareButton getText={buildShareText} />

          <AdSlot label="Espaço reservado para anúncio (AdSense)" />
        </div>
      )}
    </div>
  );
}
