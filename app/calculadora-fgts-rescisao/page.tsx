import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import FgtsCalculator from "@/components/calculators/FgtsCalculator";
import FaqAccordion from "@/components/FaqAccordion";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import { buildFaqSchema, buildWebApplicationSchema, type FaqItem } from "@/lib/schema";
import { SITE_URL } from "@/lib/site";

const PATH = "/calculadora-fgts-rescisao";

export const metadata: Metadata = {
  title: "Calculadora de FGTS + Multa Rescisória 2026 | Grátis e Atualizada",
  description:
    "Calcule grátis o saldo do FGTS, a multa de 40%, aviso prévio, 13º e férias proporcionais da sua rescisão. Resultado instantâneo.",
  alternates: { canonical: PATH },
};

const faqItems: FaqItem[] = [
  {
    question: "Tenho direito à multa de 40% do FGTS se eu pedir demissão?",
    answer:
      "Não. A multa de 40% sobre o saldo do FGTS só é devida quando o empregador demite o trabalhador sem justa causa. Em pedido de demissão, o trabalhador não recebe a multa nem pode sacar o saldo do FGTS depositado.",
  },
  {
    question: "Como funciona a multa do FGTS no acordo mútuo (distrato)?",
    answer:
      "No acordo mútuo, previsto no artigo 484-A da CLT, a multa é reduzida para 20% sobre o saldo do FGTS, o aviso prévio (se indenizado) é pago pela metade, e o trabalhador pode sacar 80% do saldo do FGTS. O 13º salário e as férias proporcionais são pagos integralmente.",
  },
  {
    question: "Quem é demitido por justa causa recebe algum valor do FGTS?",
    answer:
      "O saldo já depositado permanece na conta, mas o trabalhador não pode sacá-lo neste momento, não recebe a multa de 40%, não tem direito a aviso prévio, e não recebe 13º salário nem férias proporcionais — apenas o saldo de salário dos dias trabalhados e férias vencidas, se houver, que não são calculados nesta ferramenta.",
  },
  {
    question: "Como é calculado o saldo do FGTS quando eu não sei o valor exato?",
    answer:
      "Quando você não informa o saldo real, estimamos com base na regra geral: 8% do salário bruto por mês trabalhado. É uma aproximação — o valor real pode variar por reajustes salariais ao longo do contrato, rendimento da conta e eventuais saques anteriores. Para o valor exato, consulte o aplicativo FGTS ou um extrato da Caixa Econômica Federal.",
  },
  {
    question: "O aviso prévio é sempre de 30 dias?",
    answer:
      "O piso é de 30 dias, mas a Lei 12.506/2011 garante 3 dias adicionais para cada ano completo trabalhado na mesma empresa, até o limite de 90 dias. Por isso, quanto mais tempo de casa, maior o aviso prévio proporcional.",
  },
  {
    question: "O 13º salário proporcional entra no cálculo da rescisão?",
    answer:
      "Sim, em qualquer rescisão que não seja por justa causa. O 13º proporcional é calculado com base nos meses trabalhados no ano corrente até a data de saída, considerando mês completo qualquer fração igual ou superior a 15 dias.",
  },
  {
    question: "Férias proporcionais são pagas em qualquer tipo de rescisão?",
    answer:
      "Sim, exceto em demissão por justa causa. O valor é proporcional aos meses trabalhados no período aquisitivo em curso (ainda não completado), acrescido do 1/3 constitucional.",
  },
  {
    question: "Esse cálculo é oficial e pode ser usado na Justiça do Trabalho?",
    answer:
      "Não. Esta calculadora oferece uma estimativa educacional baseada nas regras gerais da CLT, sem considerar convenções coletivas, acordos individuais específicos ou detalhes do seu contrato. Para valores oficiais, consulte um contador, o RH da empresa ou o sindicato da categoria.",
  },
];

export default function FgtsRescisaoPage() {
  return (
    <div>
      <JsonLd
        data={buildWebApplicationSchema({
          name: "Calculadora de FGTS + Multa Rescisória",
          description:
            "Ferramenta gratuita para estimar o saldo do FGTS, a multa rescisória, aviso prévio, 13º e férias proporcionais.",
          url: `${SITE_URL}${PATH}`,
        })}
      />
      <JsonLd data={buildFaqSchema(faqItems)} />
      <Breadcrumbs items={[{ name: "Calculadora de FGTS + Rescisão", path: PATH }]} />

      <section className="mx-auto max-w-3xl px-4 pb-8 pt-8 sm:px-6 sm:pt-12">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Calculadora de FGTS + Multa Rescisória
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base">
          Informe seu salário, as datas de admissão e demissão e o tipo de rescisão para estimar,
          em segundos, o saldo do FGTS, a multa rescisória, o aviso prévio, o 13º e as férias
          proporcionais.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
        <FgtsCalculator />
      </section>

      <section className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
        <AdSlot label="Espaço reservado para anúncio (AdSense)" />
      </section>

      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <div className="article-content text-slate-700">
          <h2>O que é a multa rescisória do FGTS?</h2>
          <p>
            Quando um trabalhador é contratado pelo regime CLT, o empregador é obrigado a depositar
            mensalmente, em uma conta vinculada ao FGTS (Fundo de Garantia do Tempo de Serviço),
            valor equivalente a 8% do salário bruto do empregado. Esse dinheiro fica reservado como
            uma espécie de poupança forçada, que o trabalhador só pode movimentar em situações
            específicas previstas em lei — sendo a demissão sem justa causa uma delas.
          </p>
          <p>
            Além de liberar o saque de todo o saldo acumulado, a demissão sem justa causa obriga o
            empregador a pagar uma <strong>multa rescisória de 40%</strong> sobre o valor total
            depositado ao longo de todo o contrato de trabalho. Essa multa existe justamente para
            compensar o trabalhador pela perda involuntária do emprego e desestimular demissões
            arbitrárias.
          </p>

          <h3>Exemplo prático</h3>
          <p>
            Imagine um trabalhador com salário bruto de R$ 3.000,00 que ficou 2 anos na empresa e
            foi demitido sem justa causa. O saldo estimado do FGTS seria de aproximadamente
            R$ 3.000,00 × 8% × 24 meses = <strong>R$ 5.760,00</strong>. Sobre esse valor, incide a
            multa de 40%, ou seja, mais <strong>R$ 2.304,00</strong> pagos pelo empregador — além do
            saldo integral do FGTS, que pode ser sacado.
          </p>

          <h2>Multa reduzida no acordo mútuo (distrato)</h2>
          <p>
            Desde a Reforma Trabalhista (Lei 13.467/2017), existe uma modalidade chamada{" "}
            <strong>rescisão por acordo mútuo</strong> (ou distrato), prevista no artigo 484-A da
            CLT. Nesse formato, negociado entre empresa e trabalhador, a multa do FGTS cai para 20%,
            o trabalhador pode sacar 80% do saldo da conta (em vez de 100%), e o aviso prévio, se
            indenizado, é pago pela metade. Em compensação, esse tipo de rescisão libera o acesso ao
            seguro-desemprego de forma diferente das demais modalidades — o que não é calculado
            nesta ferramenta.
          </p>

          <h2>Quando a multa não é devida</h2>
          <p>
            Em caso de <strong>pedido de demissão</strong> pelo próprio trabalhador, não há multa de
            40% nem saque do FGTS — o saldo permanece depositado até que o trabalhador se enquadre
            em outra situação que permita a movimentação, como uma demissão futura sem justa causa,
            aposentadoria, ou compra da casa própria, entre outras hipóteses previstas em lei.
          </p>
          <p>
            Na <strong>demissão por justa causa</strong> — quando o empregador comprova falta grave
            do trabalhador, como ato de improbidade ou insubordinação — a situação é ainda mais
            restritiva: além de não haver multa, o trabalhador também não pode sacar o saldo do FGTS
            imediatamente, não recebe aviso prévio, 13º proporcional nem férias proporcionais.
          </p>

          <h2>Outras verbas que compõem a rescisão</h2>
          <p>
            Além do FGTS e da multa, a rescisão sem justa causa (e, em menor proporção, o acordo
            mútuo) também garantem ao trabalhador o <strong>aviso prévio</strong> — indenizado ou
            trabalhado, com acréscimo de 3 dias por ano completo de casa, até o limite de 90 dias —,
            o <strong>13º salário proporcional</strong> aos meses trabalhados no ano corrente, e as{" "}
            <strong>férias proporcionais</strong> ao período aquisitivo em curso, sempre acrescidas
            do 1/3 constitucional garantido pela Constituição Federal.
          </p>
          <p>
            Todas essas verbas, somadas, formam o total estimado que aparece no resultado desta
            calculadora. Lembre-se: trata-se de uma estimativa educacional — o cálculo oficial da
            sua rescisão deve constar no Termo de Rescisão do Contrato de Trabalho (TRCT), conferido
            por um contador ou pelo sindicato da categoria.
          </p>
        </div>
      </article>

      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <h2 className="text-xl font-semibold text-slate-900">Perguntas frequentes</h2>
        <div className="mt-4">
          <FaqAccordion items={faqItems} />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 pt-4 sm:px-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Veja também</h2>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <Link
            href="/calculadora-ferias-proporcionais"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 font-semibold text-accent-600 shadow-sm hover:border-accent-300"
          >
            Calculadora de Férias Proporcionais →
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
