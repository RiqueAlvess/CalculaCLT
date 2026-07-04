"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, FileCheck, Mail, Printer, ShieldCheck } from "lucide-react";
import FaqAccordion from "@/components/FaqAccordion";
import PdfPreviewMockup from "@/components/relatorio/PdfPreviewMockup";
import { lerRelatorioPendente, salvarUltimoPedidoId } from "@/lib/relatorio/session";
import type { RelatorioPayload } from "@/lib/relatorio/types";
import { formatBRL } from "@/lib/format";
import { KIWIFY_CHECKOUT_URL } from "@/lib/site";

const PRECO = 14.9;

const beneficios = [
  "Detalhamento linha por linha de cada verba calculada",
  "Pronto para enviar por e-mail ou imprimir",
  "Formato profissional, aceito por RH, sindicatos e advogados",
  "Gerado na hora, sem espera",
];

const objecoes = [
  {
    question: "É seguro comprar?",
    answer:
      "Sim. O pagamento é processado pela Kiwify, uma das maiores plataformas de pagamento do Brasil. Nós não temos acesso ao seu cartão ou dados bancários.",
  },
  {
    question: "Recebo o relatório na hora?",
    answer:
      "Assim que o pagamento é aprovado, o PDF é enviado automaticamente para o seu e-mail. Pagamentos via Pix costumam confirmar em poucos segundos; boleto pode levar até 2 dias úteis.",
  },
  {
    question: "Posso pedir reembolso?",
    answer:
      "Sim. Como em qualquer compra na Kiwify, você tem garantia de 7 dias, conforme o Código de Defesa do Consumidor.",
  },
  {
    question: "Preciso ter feito o cálculo antes?",
    answer:
      "Sim. O relatório é gerado a partir dos dados de um cálculo feito em uma das calculadoras do CalculaCLT. Se você ainda não calculou, volte para a calculadora, gere o resultado e clique em \"Gerar relatório em PDF\".",
  },
  {
    question: "Funciona para qualquer tipo de rescisão ou férias?",
    answer:
      "Sim, o relatório reflete exatamente o cenário que você simulou: tipo de rescisão, ou o cálculo de férias proporcionais com ou sem abono.",
  },
];

export default function RelatorioVendaClient() {
  const [payload, setPayload] = useState<RelatorioPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    setPayload(lerRelatorioPendente());
  }, []);

  const valor = payload?.resultado.totalEstimado ?? null;

  async function handleComprar() {
    if (!payload) return;
    setErro(null);
    setLoading(true);
    try {
      const res = await fetch("/api/save-calculo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("save-calculo failed");
      const { id } = (await res.json()) as { id: string };
      salvarUltimoPedidoId(id);

      const url = new URL(KIWIFY_CHECKOUT_URL);
      url.searchParams.set("s1", id);
      window.location.href = url.toString();
    } catch {
      setErro("Não foi possível iniciar o pagamento agora. Tente novamente em instantes.");
      setLoading(false);
    }
  }

  const ctaLabel = !payload
    ? "Faça um cálculo para continuar"
    : loading
      ? "Preparando pagamento seguro..."
      : "Gerar meu relatório agora";

  function Cta({ className = "" }: { className?: string }) {
    if (!payload) {
      return (
        <Link
          href="/"
          className={`inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 py-4 text-base font-semibold text-white transition hover:bg-slate-800 ${className}`}
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        </Link>
      );
    }
    return (
      <button
        type="button"
        onClick={handleComprar}
        disabled={loading}
        className={`inline-flex items-center justify-center gap-2 rounded-lg bg-accent-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-accent-700 disabled:cursor-wait disabled:opacity-70 ${className}`}
      >
        {ctaLabel}
        <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
      </button>
    );
  }

  return (
    <div>
      <section className="mx-auto max-w-3xl px-4 pb-10 pt-14 text-center sm:px-8 sm:pt-20">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-600">
          Relatório completo em PDF
        </span>
        {/* Headline B (perda/urgência), escolhida no lugar da headline A
            ("Você tem R$ [valor] a receber. Leve a prova completa para o
            RH, o sindicato ou seu advogado."). Trocar aqui se quiser testar
            a outra variação. */}
        <h1 className="mx-auto mt-5 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
          Não deixe esse dinheiro passar em branco.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
          Receba o relatório completo do seu cálculo em PDF, pronto para usar.
        </p>
        {valor !== null && (
          <p className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full bg-accent-50 px-4 py-2 text-sm font-semibold text-accent-700">
            Você tem {formatBRL(valor)} a receber
          </p>
        )}
        <div className="mt-8">
          <Cta className="w-full sm:w-auto" />
        </div>
        {erro && <p className="mt-3 text-sm font-medium text-red-600">{erro}</p>}
      </section>

      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-10 sm:grid-cols-2">
          <PdfPreviewMockup />
          <div>
            <h2 className="text-xl font-semibold text-slate-900">O que vem no relatório</h2>
            <ul className="mt-5 space-y-3.5">
              {beneficios.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                  <FileCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" strokeWidth={1.75} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Printer className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" /> Pronto para imprimir
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" /> Enviado por e-mail
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8 text-center sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Cálculo baseado nas regras da CLT
          </p>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-600">
            Ainda não temos depoimentos publicados — o CalculaCLT é novo. Assim que tivermos
            avaliações reais de quem usou o relatório, elas aparecerão aqui.
          </p>
          {/* Espaço reservado para depoimentos reais. Não inserir depoimentos fictícios. */}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10 text-center sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Investimento</p>
        <p className="mt-3 text-5xl font-bold tracking-tight text-slate-900">{formatBRL(PRECO)}</p>
        <p className="mt-3 text-sm text-slate-500">
          Menos que o preço de um lanche, para não perder dinheiro que é seu por direito.
        </p>
        <div className="mt-8">
          <Cta />
        </div>
        {erro && <p className="mt-3 text-sm font-medium text-red-600">{erro}</p>}
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
        <h2 className="text-xl font-semibold text-slate-900">Perguntas antes de comprar</h2>
        <div className="mt-5">
          <FaqAccordion items={objecoes} />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-8">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-card sm:flex-row sm:text-left">
          <ShieldCheck className="h-8 w-8 shrink-0 text-accent-600" strokeWidth={1.5} aria-hidden="true" />
          <p className="text-xs leading-relaxed text-slate-500">
            Este relatório é uma <strong>estimativa educacional</strong> baseada nas regras gerais
            da CLT e não substitui o cálculo oficial de um contador, do RH da empresa ou do
            sindicato da categoria. Pagamento processado com segurança pela Kiwify.
          </p>
        </div>
      </section>
    </div>
  );
}
