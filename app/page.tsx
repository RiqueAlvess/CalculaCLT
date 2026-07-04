import Link from "next/link";
import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: { absolute: "CalculaCLT — Calculadora de FGTS, Rescisão e Férias CLT Online Grátis" },
  description:
    "Calcule grátis sua rescisão trabalhista: FGTS + multa de 40%, aviso prévio, 13º e férias proporcionais. Resultado instantâneo, direto do celular.",
  alternates: { canonical: "/" },
};

const calculadoras = [
  {
    href: "/calculadora-fgts-rescisao",
    title: "FGTS + Multa Rescisória",
    description:
      "Descubra o valor do saldo do FGTS, a multa de 40% (ou 20%), aviso prévio, 13º e férias proporcionais na sua rescisão.",
    emoji: "💰",
  },
  {
    href: "/calculadora-ferias-proporcionais",
    title: "Férias Proporcionais",
    description:
      "Calcule quantos dias de férias você já acumulou e quanto vai receber, incluindo o 1/3 constitucional e o abono pecuniário.",
    emoji: "🏖️",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto max-w-5xl px-4 pb-8 pt-10 sm:px-6 sm:pt-16">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            100% gratuito · sem cadastro
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Calculadoras trabalhistas CLT, <span className="text-brand-600">rápidas e sem enrolação</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
            Simule sua rescisão, o saldo do FGTS e as férias proporcionais em segundos — direto do
            celular, sem precisar criar conta.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {calculadoras.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <span className="text-3xl">{calc.emoji}</span>
              <h2 className="mt-3 text-xl font-bold text-slate-900 group-hover:text-brand-600">
                {calc.title}
              </h2>
              <p className="mt-2 flex-1 text-sm text-slate-600">{calc.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                Calcular agora
                <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
        <AdSlot label="Espaço reservado para anúncio (AdSense)" />
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
          <h2 className="text-xl font-bold text-slate-900">Por que usar o CalculaCLT?</h2>
          <div className="mt-4 grid grid-cols-1 gap-6 text-sm text-slate-600 sm:grid-cols-3">
            <div>
              <p className="font-semibold text-slate-800">Rápido</p>
              <p className="mt-1">Cálculo instantâneo, direto no seu navegador, sem esperar carregamento de servidor.</p>
            </div>
            <div>
              <p className="font-semibold text-slate-800">Transparente</p>
              <p className="mt-1">Mostramos o detalhamento completo de cada verba, não só um número final.</p>
            </div>
            <div>
              <p className="font-semibold text-slate-800">Privado</p>
              <p className="mt-1">Nenhum dado é enviado a servidores — tudo é calculado localmente no seu dispositivo.</p>
            </div>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Quer entender melhor a metodologia por trás dos cálculos?{" "}
            <Link href="/sobre" className="font-semibold text-brand-600 hover:underline">
              Conheça o CalculaCLT
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
