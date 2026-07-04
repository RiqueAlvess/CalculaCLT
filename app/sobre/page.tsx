import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Sobre o CalculaCLT",
  description:
    "Conheça o CalculaCLT: calculadoras trabalhistas gratuitas e independentes para ajudar você a entender FGTS, rescisão e férias na CLT.",
  alternates: { canonical: "/sobre" },
};

export default function SobrePage() {
  return (
    <div>
      <Breadcrumbs items={[{ name: "Sobre", path: "/sobre" }]} />
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Sobre o CalculaCLT</h1>
        <div className="article-content mt-6 text-slate-700">
          <p>
            O <strong>CalculaCLT</strong> nasceu de um problema simples: entender quanto você tem
            direito a receber em uma rescisão trabalhista, ou como funcionam as férias
            proporcionais, exige ler artigos da CLT cheios de termos técnicos — ou pagar por uma
            consulta só para tirar uma dúvida rápida.
          </p>
          <p>
            Criamos duas calculadoras gratuitas, sem cadastro e sem burocracia, para que qualquer
            trabalhador brasileiro consiga estimar rapidamente:
          </p>
          <ul>
            <li>O saldo do FGTS e a multa rescisória (40% ou 20%, conforme o tipo de rescisão);</li>
            <li>O aviso prévio, o 13º salário proporcional e as férias proporcionais + 1/3;</li>
            <li>O valor de férias proporcionais fora do contexto de rescisão, incluindo o abono pecuniário.</li>
          </ul>

          <h2>Como calculamos</h2>
          <p>
            Todos os cálculos seguem as regras gerais previstas na Consolidação das Leis do
            Trabalho (CLT) e na Reforma Trabalhista (Lei 13.467/2017), como o percentual de 8% de
            FGTS sobre o salário mensal, a multa de 40% em demissão sem justa causa (ou 20% em
            acordo mútuo), a regra de 30 dias de aviso prévio + 3 dias por ano trabalhado (limitado
            a 90 dias) e a contagem de avos por mês trabalhado, considerando fração igual ou
            superior a 15 dias como mês completo.
          </p>
          <p>
            Nenhuma convenção coletiva, acordo individual específico ou particularidade contratual
            é considerada — por isso, os resultados são <strong>estimativas educacionais</strong>,
            não um cálculo trabalhista oficial. Sempre valide os valores com um contador, o RH da
            empresa ou o sindicato da sua categoria antes de tomar qualquer decisão.
          </p>

          <h2>Privacidade em primeiro lugar</h2>
          <p>
            As duas calculadoras são 100% gratuitas e rodam inteiramente no seu navegador — nenhum
            salário, data ou dado pessoal que você digita nelas é enviado, armazenado ou
            compartilhado com terceiros. A única exceção é o relatório em PDF pago (opcional): para
            gerá-lo e enviá-lo por e-mail após a compra, guardamos os dados do cálculo por um
            período curto e os descartamos em seguida.
          </p>

          <p>
            Tem alguma dúvida ou sugestão? Volte para a{" "}
            <Link href="/">página inicial</Link> e experimente as calculadoras.
          </p>
        </div>
      </article>
    </div>
  );
}
