"use client";

import { useState } from "react";
import { DateInput, MoneyInput, ResultRow, SubmitCta, ToggleYesNo } from "@/components/calculators/fields";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import ShareButton from "@/components/ShareButton";
import AdSlot from "@/components/AdSlot";
import { IconBanknote, IconGift, IconSun } from "@/components/icons";
import { calcularFeriasProporcionais } from "@/lib/calculations/ferias";
import { formatBRL, parseInputDate } from "@/lib/format";

function todayInputValue(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function FeriasCalculator() {
  const [salario, setSalario] = useState(0);
  const [admissao, setAdmissao] = useState("");
  const [referencia, setReferencia] = useState(todayInputValue());
  const [jaTirouFerias, setJaTirouFerias] = useState(false);
  const [venderAbono, setVenderAbono] = useState(false);
  const [resultado, setResultado] = useState<ReturnType<typeof calcularFeriasProporcionais> | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    const dataAdmissao = parseInputDate(admissao);
    const dataReferencia = parseInputDate(referencia);

    if (!dataAdmissao || !dataReferencia) {
      setErro("Preencha as datas de admissão e de referência.");
      setResultado(null);
      return;
    }
    if (dataReferencia <= dataAdmissao) {
      setErro("A data de referência precisa ser depois da data de admissão.");
      setResultado(null);
      return;
    }
    if (salario <= 0) {
      setErro("Informe o salário bruto.");
      setResultado(null);
      return;
    }

    const r = calcularFeriasProporcionais({
      salarioBruto: salario,
      dataAdmissao,
      dataReferencia,
      jaTirouFerias,
      venderAbono,
    });
    setResultado(r);
  }

  function buildShareText(): string {
    if (!resultado) return "";
    if (resultado.feriasJaGozadas) {
      return "Simulação de férias proporcionais — CalculaCLT\nVocê já usufruiu as férias deste período aquisitivo.\nSimule também em calculaclt.com.br";
    }
    return [
      "Simulação de férias proporcionais — CalculaCLT",
      `Dias proporcionais: ${resultado.diasProporcionais}`,
      `Férias (gozo): ${formatBRL(resultado.valorFeriasGozo)}`,
      `1/3 constitucional (gozo): ${formatBRL(resultado.tercoSobreGozo)}`,
      ...(resultado.valorAbono > 0
        ? [
            `Abono pecuniário: ${formatBRL(resultado.valorAbono)}`,
            `1/3 sobre o abono: ${formatBRL(resultado.tercoSobreAbono)}`,
          ]
        : []),
      `Total estimado: ${formatBRL(resultado.totalEstimado)}`,
      "Simule também em calculaclt.com.br",
    ].join("\n");
  }

  return (
    <div className="space-y-6">
      <form
        id="ferias-form"
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 pb-28 shadow-card sm:p-6"
      >
        <MoneyInput id="salario-ferias" label="Salário bruto" value={salario} onChange={setSalario} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DateInput id="admissao-ferias" label="Data de admissão" value={admissao} onChange={setAdmissao} max={referencia || undefined} />
          <div>
            <DateInput
              id="referencia-ferias"
              label="Data de referência"
              value={referencia}
              onChange={setReferencia}
              min={admissao || undefined}
            />
            <button
              type="button"
              onClick={() => setReferencia(todayInputValue())}
              className="mt-1.5 text-xs font-semibold text-brand-600 hover:underline"
            >
              Usar data de hoje
            </button>
          </div>
        </div>

        <ToggleYesNo
          label="Já tirou férias neste período aquisitivo?"
          name="ja-tirou-ferias"
          value={jaTirouFerias}
          onChange={setJaTirouFerias}
        />

        {!jaTirouFerias && (
          <ToggleYesNo
            label="Vai vender 1/3 das férias (abono pecuniário)?"
            name="vender-abono"
            value={venderAbono}
            onChange={setVenderAbono}
          />
        )}

        {erro && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{erro}</p>
        )}

        <SubmitCta formId="ferias-form" label="Calcular agora" />
      </form>

      {resultado && (
        <div className="animate-fade-in-up space-y-4">
          {resultado.feriasJaGozadas ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-card">
              <p className="text-lg font-bold text-slate-800">
                Você já usufruiu as férias deste período aquisitivo.
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Não há férias proporcionais adicionais a receber por este período. Um novo período
                aquisitivo começa a contar a partir do fechamento do período atual.
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-2xl bg-gradient-to-br from-money-600 to-money-700 p-6 text-white shadow-result sm:p-8">
                <p className="text-sm font-medium text-money-100">Total estimado a receber</p>
                <p className="mt-1 text-4xl font-extrabold tracking-tight sm:text-5xl">
                  {formatBRL(resultado.totalEstimado)}
                </p>
                <p className="mt-3 text-xs text-money-100">
                  {resultado.mesesAvos}/12 avos acumulados — aproximadamente {resultado.diasProporcionais} dias de férias
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">Detalhamento do cálculo</h3>
                <div className="mt-2 divide-y divide-slate-100">
                  <ResultRow
                    icon={<IconSun />}
                    label="Férias proporcionais (gozo)"
                    hint={venderAbono ? "2/3 dos dias, em descanso remunerado" : `${resultado.diasProporcionais} dia(s)`}
                    value={formatBRL(resultado.valorFeriasGozo)}
                    emphasis
                  />
                  <ResultRow
                    icon={<IconBanknote />}
                    label="1/3 constitucional (gozo)"
                    value={formatBRL(resultado.tercoSobreGozo)}
                  />
                  {resultado.valorAbono > 0 && (
                    <>
                      <ResultRow
                        icon={<IconGift />}
                        label="Abono pecuniário (venda de 1/3)"
                        hint={`${resultado.diasAbono} dia(s) convertido(s) em dinheiro`}
                        value={formatBRL(resultado.valorAbono)}
                      />
                      <ResultRow
                        icon={<IconBanknote />}
                        label="1/3 constitucional sobre o abono"
                        value={formatBRL(resultado.tercoSobreAbono)}
                      />
                    </>
                  )}
                </div>
                {resultado.valorAbono > 0 && (
                  <p className="mt-3 text-xs text-slate-400">
                    Vender parte das férias não aumenta o valor total recebido — apenas antecipa uma
                    parte em dinheiro no lugar de dias de descanso.
                  </p>
                )}
              </div>

              <DisclaimerBanner />

              <ShareButton getText={buildShareText} />

              <AdSlot label="Espaço reservado para anúncio (AdSense)" />
            </>
          )}
        </div>
      )}
    </div>
  );
}
