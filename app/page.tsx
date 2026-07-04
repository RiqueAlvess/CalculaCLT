import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Palmtree, ShieldCheck, Wallet, Zap } from "lucide-react";
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
    icon: Wallet,
  },
  {
    href: "/calculadora-ferias-proporcionais",
    title: "Férias Proporcionais",
    description:
      "Calcule quantos dias de férias você já acumulou e quanto vai receber, incluindo o 1/3 constitucional e o abono pecuniário.",
    icon: Palmtree,
  },
];

const highlights = [
  {
    icon: Zap,
    title: "Rápido",
    description: "Cálculo instantâneo, direto no seu navegador, sem esperar carregamento de servidor.",
  },
  {
    icon: ShieldCheck,
    title: "Transparente",
    description: "Mostramos o detalhamento completo de cada verba, não só um número final.",
  },
  {
    icon: ShieldCheck,
    title: "Privado",
    description: "Nenhum dado é enviado a servidores — tudo é calculado localmente no seu dispositivo.",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 pb-12 pt-14 sm:px-8 sm:pt-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-3.5 py-1.5 text-xs font-semibold text-accent-700">
            100% gratuito · sem cadastro
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-6xl">
            Calculadoras trabalhistas CLT, <span className="text-accent-600">rápidas e sem enrolação</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
            Simule sua rescisão, o saldo do FGTS e as férias proporcionais em segundos — direto do
            celular, sem precisar criar conta.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
          {calculadoras.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-8 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-50 text-accent-700">
                <calc.icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h2 className="mt-5 text-xl font-semibold text-slate-900">{calc.title}</h2>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-500">{calc.description}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600">
                Calcular agora
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" strokeWidth={2} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-4 sm:px-8">
        <AdSlot label="Espaço reservado para anúncio (AdSense)" />
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-8">
        <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-card sm:p-12">
          <h2 className="text-2xl font-semibold text-slate-900">Por que usar o CalculaCLT?</h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.title}>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-500">
                  <item.icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <p className="mt-3 font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-sm text-slate-500">
            Quer entender melhor a metodologia por trás dos cálculos?{" "}
            <Link href="/sobre" className="font-semibold text-accent-600 hover:underline">
              Conheça o CalculaCLT
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
