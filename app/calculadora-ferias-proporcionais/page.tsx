import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import FeriasCalculator from "@/components/calculators/FeriasCalculator";
import FaqAccordion from "@/components/FaqAccordion";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import { buildFaqSchema, buildWebApplicationSchema, type FaqItem } from "@/lib/schema";
import { SITE_URL } from "@/lib/site";

const PATH = "/calculadora-ferias-proporcionais";

export const metadata: Metadata = {
  title: "Calculadora de Férias Proporcionais CLT 2026 | Cálculo Grátis",
  description:
    "Calcule grátis suas férias proporcionais CLT: dias acumulados, valor + 1/3 constitucional e abono pecuniário. Resultado na hora.",
  alternates: { canonical: PATH },
};

const faqItems: FaqItem[] = [
  {
    question: "Como calcular férias proporcionais na CLT?",
    answer:
      "As férias proporcionais são calculadas em avos: para cada mês completo trabalhado dentro do período aquisitivo (12 meses a partir da admissão ou do início do período em curso), o trabalhador acumula 1/12 do direito a férias. Uma fração igual ou superior a 15 dias no mês conta como mês completo.",
  },
  {
    question: "O que é o período aquisitivo de férias?",
    answer:
      "É o intervalo de 12 meses que o trabalhador precisa completar para ter direito a 30 dias de férias. Ele começa na data de admissão e se renova a cada aniversário do contrato. Enquanto esse período não se completa, as férias são chamadas de 'proporcionais'.",
  },
  {
    question: "Tenho direito ao 1/3 de férias mesmo nas proporcionais?",
    answer:
      "Sim. O adicional de 1/3 constitucional, garantido pelo artigo 7º, inciso XVII, da Constituição Federal, incide sobre qualquer valor de férias, sejam elas proporcionais ou integrais (vencidas).",
  },
  {
    question: "O que é abono pecuniário e como ele é calculado?",
    answer:
      "Abono pecuniário é a possibilidade de 'vender' até 1/3 dos dias de férias para o empregador, recebendo o valor correspondente em dinheiro em vez de tirar esses dias de descanso. O valor segue a mesma proporção do salário e também recebe o 1/3 constitucional — ou seja, vender o abono não aumenta o total recebido, apenas antecipa parte em dinheiro.",
  },
  {
    question: "Já tirei férias este período — ainda tenho direito a valores proporcionais?",
    answer:
      "Se você já usufruiu (ou já recebeu antecipadamente) as férias referentes ao período aquisitivo em curso, não há valor proporcional adicional a receber por esse mesmo período. O próximo período aquisitivo começa a contar somente após o fechamento do atual.",
  },
  {
    question: "Férias proporcionais são pagas quando eu sou demitido?",
    answer:
      "Sim, em qualquer rescisão que não seja por justa causa — seja pedido de demissão, dispensa sem justa causa ou acordo mútuo. Para simular o valor dentro de uma rescisão completa, use nossa calculadora de FGTS + multa rescisória.",
  },
  {
    question: "Essa calculadora considera férias vencidas (já completas e não usufruídas)?",
    answer:
      "Não. Esta ferramenta calcula apenas férias proporcionais ao período aquisitivo ainda em curso. Se você já completou um período de 12 meses sem tirar férias, esse saldo integral (chamado de 'férias vencidas') deve ser somado separadamente, com valor em dobro conforme o artigo 137 da CLT.",
  },
];

export default function FeriasProporcionaisPage() {
  return (
    <div>
      <JsonLd
        data={buildWebApplicationSchema({
          name: "Calculadora de Férias Proporcionais CLT",
          description:
            "Ferramenta gratuita para calcular férias proporcionais, o 1/3 constitucional e o abono pecuniário.",
          url: `${SITE_URL}${PATH}`,
        })}
      />
      <JsonLd data={buildFaqSchema(faqItems)} />
      <Breadcrumbs items={[{ name: "Calculadora de Férias Proporcionais", path: PATH }]} />

      <section className="mx-auto max-w-3xl px-4 pb-6 pt-6 sm:px-6 sm:pt-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Calculadora de Férias Proporcionais CLT
        </h1>
        <p className="mt-3 text-sm text-slate-600 sm:text-base">
          Informe seu salário e as datas de admissão e referência para descobrir quantos dias de
          férias você já acumulou e quanto vai receber, incluindo o 1/3 constitucional.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
        <FeriasCalculator />
      </section>

      <section className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
        <AdSlot label="Espaço reservado para anúncio (AdSense)" />
      </section>

      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="article-content text-slate-700">
          <h2>Como funciona o cálculo de férias proporcionais na CLT</h2>
          <p>
            Todo trabalhador CLT tem direito a 30 dias de férias remuneradas a cada 12 meses
            trabalhados — o chamado período aquisitivo. Mas o que acontece se o contrato termina, ou
            se você simplesmente quer saber quantos dias já acumulou, antes de completar esse ciclo
            inteiro? É aí que entram as <strong>férias proporcionais</strong>.
          </p>
          <p>
            A lógica é simples: para cada mês completo trabalhado dentro do período aquisitivo em
            curso, o trabalhador acumula 1/12 avos do direito a férias — o equivalente a 2,5 dias por
            mês (30 dias ÷ 12 meses). A regra de arredondamento prevista na CLT considera que uma
            fração de mês igual ou superior a 15 dias já conta como mês completo para fins desse
            cálculo.
          </p>

          <h3>Exemplo prático</h3>
          <p>
            Suponha um trabalhador com salário bruto de R$ 3.000,00, admitido em 1º de março, que
            está calculando suas férias proporcionais em 20 de outubro do mesmo período aquisitivo.
            Isso representa 7 meses completos (março a setembro) mais 20 dias de outubro — que, por
            serem 20 dias (mais de 15), contam como o 8º mês completo. O valor das férias
            proporcionais seria de R$ 3.000,00 ÷ 12 × 8 = <strong>R$ 2.000,00</strong>, mais o 1/3
            constitucional de R$ 666,67, totalizando <strong>R$ 2.666,67</strong>.
          </p>

          <h2>O adicional de 1/3 constitucional</h2>
          <p>
            Independentemente de as férias serem proporcionais ou integrais (vencidas), a
            Constituição Federal garante um adicional de 1/3 sobre o valor das férias — o famoso
            "terço de férias". Esse valor é calculado simplesmente dividindo o valor das férias por
            3, e é pago junto, seja no recibo de férias, seja no Termo de Rescisão do Contrato de
            Trabalho (TRCT).
          </p>

          <h2>Abono pecuniário: vender 1/3 das férias</h2>
          <p>
            A CLT permite que o trabalhador negocie com o empregador a conversão de até 1/3 dos dias
            de férias em dinheiro — o chamado <strong>abono pecuniário</strong> — em vez de tirar
            esses dias como descanso. Um ponto importante (e que gera confusão): vender o abono não
            aumenta o valor total recebido. O trabalhador simplesmente recebe uma parte do valor das
            férias (equivalente a 1/3 dos dias) antecipadamente em dinheiro, no lugar de folgas, mas
            o 1/3 constitucional continua incidindo normalmente sobre essa parcela também.
          </p>

          <h2>Férias proporcionais x férias vencidas</h2>
          <p>
            É importante não confundir os dois conceitos. As <strong>férias proporcionais</strong>{" "}
            se referem ao período aquisitivo que ainda está em curso (incompleto). Já as{" "}
            <strong>férias vencidas</strong> são aquelas de um período aquisitivo já completo (12
            meses), mas que o trabalhador ainda não usufruiu — nesse caso, se a empresa não conceder
            as férias dentro dos 12 meses seguintes (o chamado período concessivo), o valor deve ser
            pago em dobro, conforme o artigo 137 da CLT. Esta calculadora foi desenhada
            especificamente para o cálculo de férias <strong>proporcionais</strong>.
          </p>
        </div>
      </article>

      <section className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <h2 className="text-xl font-bold text-slate-900">Perguntas frequentes</h2>
        <div className="mt-4">
          <FaqAccordion items={faqItems} />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 pt-4 sm:px-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Veja também</h2>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <Link
            href="/calculadora-fgts-rescisao"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 font-semibold text-brand-600 shadow-sm hover:border-brand-300"
          >
            Calculadora de FGTS + Rescisão →
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-600 shadow-sm hover:border-slate-300"
          >
            Página inicial →
          </Link>
        </div>
      </section>
    </div>
  );
}
